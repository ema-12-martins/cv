import * as THREE from 'three';

export function loadMaterials(data, textures, wireframe_value) {
    // Object to store the materials
    const materials = {};

    // Iterate over all materials in the data
    for (const key in data.materials) {
        const materialData = data.materials[key];
        
        // Retrieve the texture associated with the material, or use null if not found
        const aux_texture = textures[materialData.textureref] || null;

        if (aux_texture) {
            // Configure texture properties if texture exists
            aux_texture.repeat.set(materialData.texlength_s, materialData.texlength_t);
            aux_texture.wrapS = THREE.RepeatWrapping;
            aux_texture.wrapT = THREE.RepeatWrapping;
        }

        // Load the bump map texture if exists
        const textureLoader = new THREE.TextureLoader();
        const bumpMapLoaded = materialData.bumpref
            ? textureLoader.load(
                materialData.bumpref,
                undefined, // onLoad callback
                undefined, // onProgress callback
                (err) => {
                    console.error('Error loading bumpMap:', err);
                }
            )
            : null;

        // Determine shading type
        const shadingType = materialData.shading;

        // Create the material properties
        materials[materialData.id] = new THREE.MeshPhongMaterial({
            map: aux_texture || null, // Diffuse texture
            bumpMap: bumpMapLoaded, // Bump map texture
            bumpScale: materialData.bumpscale, // Scale for bump map effect
            side: materialData.twosided ? THREE.DoubleSide : THREE.FrontSide, // Double or single-sided material
            color: new THREE.Color(...materialData.color), // Base color
            specular: new THREE.Color(...materialData.specular), // Specular color
            emissive: new THREE.Color(...materialData.emissive), // Emissive color
            shininess: materialData.shininess, // Shininess factor
            flatShading: shadingType === 'flat', // Flat shading if specified
            wireframe: wireframe_value
        });

        // Configure shadow side for the material
        materials[materialData.id].shadowSide = THREE.BackSide;
    }

    // Return the dictionary of created materials
    return materials;
}
