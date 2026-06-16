import { Scene, Texture } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

export type AssetType =
    | 'texture'
    | 'exr'
    | 'gltf';

export interface AssetDefinition<T> {
    type: AssetType;
    url: string;
    preload?: boolean;
}

export type AssetManifest = Record<string, AssetDefinition<unknown>>;

export function assetDefTexture(url: string, preload = false): AssetDefinition<Texture> {
    return {
        type: 'texture',
        url,
        preload,
    };
}

export function assetDefEXR(url: string, preload = false): AssetDefinition<Texture> {
    return {
        type: 'exr',
        url,
        preload,
    };
}

export function assetDefGLTF(url: string, preload = false): AssetDefinition<GLTF> {
    return {
        type: 'gltf',
        url,
        preload,
    };
}