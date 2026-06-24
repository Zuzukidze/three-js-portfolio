import { TextureLoader } from "three";
import { AssetDefinition, AssetManifest } from "./asset-types";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class AssetManager {
    private readonly cache = new WeakMap<
        AssetDefinition<unknown>,
        unknown
    >();
    private readonly cacheKeys = new Set<AssetDefinition<unknown>>();

    private readonly loading = new WeakMap<
        AssetDefinition<unknown>,
        Promise<unknown>
    >();

    private readonly textureLoader = new TextureLoader();
    private readonly exrLoader = new EXRLoader();
    private readonly gltfLoader = new GLTFLoader();

    async load<T>(asset: AssetDefinition<T>): Promise<T> {
        const cached = this.cache.get(asset);

        if (cached !== undefined) {
            return cached as T;
        }

        const loading = this.loading.get(asset);

        if (loading) {
            return loading as Promise<T>;
        }

        const promise = this.loadInternal(asset);

        this.loading.set(asset, promise);

        try {
            const result = await promise;

            this.cache.set(asset, result);
            this.cacheKeys.add(asset);

            return result as T;
        }
        finally {
            this.loading.delete(asset);
        }
    }

    async loadManifest(manifest: AssetManifest): Promise<void> {
        const assets = Object.values(manifest)
            .filter(asset => asset.preload !== false);

        await Promise.all(
            assets.map(asset => this.load(asset))
        );
    }

    isLoaded(asset: AssetDefinition<unknown>): boolean {
        return this.cache.has(asset);
    }

    unload(asset: AssetDefinition<unknown>): void {
        const resource = this.cache.get(asset);

        if (resource && 'dispose' in (resource as object)) {
            (resource as { dispose(): void }).dispose();
        }

        this.cache.delete(asset);
        this.cacheKeys.delete(asset);
    }

    clear(): void {
        for (const asset of this.cacheKeys) {
            this.unload(asset);
        }
    }

    private async loadInternal<T>(
        asset: AssetDefinition<T>
    ): Promise<T> {
        switch (asset.type) {
            case 'texture':
                return await this.textureLoader.loadAsync(this.getUrl(asset.url)) as T;

            case 'exr':
                return await this.exrLoader.loadAsync(this.getUrl(asset.url)) as T;

            case 'gltf':
                return await this.gltfLoader.loadAsync(this.getUrl(asset.url)) as T;

            default:
                throw new Error(
                    `Unknown asset type: ${asset.type}`
                );
        }
    }
    private getUrl(baseUrl: string){
        return new URL(
            baseUrl,
            import.meta.url
        ).href;
    }
}