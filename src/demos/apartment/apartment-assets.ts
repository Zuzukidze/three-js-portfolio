import { assetDefEXR, assetDefGLTF, assetDefTexture, AssetManifest } from "../common/assets/asset-types";

export const apartmentAssetManifest: AssetManifest = {
    'skyboxTexture': 
        assetDefEXR(
            '/textures/background/skybox_ground.exr', 
            true
        ),
    'groundMap': 
        assetDefTexture(
            '/textures/background/ground.jpg', 
            true
        ),
    'groundReflectionMap': 
        assetDefTexture(
            '/textures/background/ground_reflection.jpg', 
            true
        ),
    'buildingModel': 
        assetDefGLTF(
            '/models/apartment/building.glb', 
            true
        ),
};