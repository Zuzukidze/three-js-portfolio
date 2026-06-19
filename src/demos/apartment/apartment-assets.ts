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
    'floorMap': 
        assetDefTexture(
            '/textures/background/floor_reflection.png', 
            true
        ),
    'buildingModel': 
        assetDefGLTF(
            '/models/apartment/building.glb', 
            true
        ),
    'buildingGroundModel': 
        assetDefGLTF(
            '/models/apartment/building_ground.glb', 
            true
        ),
};