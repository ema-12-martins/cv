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

        // Load the height map texture if exists
        const heightMapLoaded = materialData.height_map_path
            ? textureLoader.load(
                materialData.height_map_path,
                undefined, // onLoad callback
                undefined, // onProgress callback
                (err) => {
                    console.error('Error loading heightMap:', err);
                }
            )
            : null;

        // If normal_map_path exists, create BasRelief material
        if (materialData.normal_map_path) {
            const colorTexture = aux_texture || null;
            const depthTexture = textureLoader.load(materialData.normal_map_path);

            // Create BasRelief material
            materials[materialData.id] = new THREE.ShaderMaterial({
                uniforms: {
                    uColorTexture: { value: colorTexture },
                    uDepthTexture: { value: depthTexture },
                    uStrength: { value: materialData.displacementScale || 0.5 },
                },
                vertexShader: `
                    uniform sampler2D uDepthTexture;
                    uniform float uStrength;
                    varying vec2 vUv;

                    void main() {
                        vUv = uv;

                        // Sample displacement map (grayscale image)
                        float displacement = texture2D(uDepthTexture, uv).r;

                        // Calculate new position based on displacement
                        vec3 displacedPosition = position + normal * displacement * uStrength;

                        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D uColorTexture;
                    varying vec2 vUv;

                    void main() {
                        // Sample color texture for object painting
                        vec4 color = texture2D(uColorTexture, vUv);

                        gl_FragColor = color;
                    }
                `,
                side: materialData.twosided ? THREE.DoubleSide : THREE.FrontSide,
                flatShading: materialData.shading === 'flat', // Flat shading if specified
                wireframe: wireframe_value,
                transparent: true,
            });
        } else {
            // Create standard material if normal_map_path is null
            materials[materialData.id] = new THREE.MeshPhongMaterial({
                map: aux_texture || null, // Diffuse texture
                bumpMap: bumpMapLoaded, // Bump map texture
                bumpScale: materialData.bumpscale || 1, // Scale for bump map effect
                displacementMap: heightMapLoaded, // Height map texture
                displacementScale: materialData.displacementScale || 10, // Scale for height map effect
                side: materialData.twosided ? THREE.DoubleSide : THREE.FrontSide, // Double or single-sided material
                color: new THREE.Color(...materialData.color), // Base color
                specular: new THREE.Color(...materialData.specular), // Specular color
                emissive: new THREE.Color(...materialData.emissive), // Emissive color
                shininess: materialData.shininess, // Shininess factor
                flatShading: materialData.shading === 'flat', // Flat shading if specified
                wireframe: wireframe_value,
                transparent: true,
            });

            // Configure shadow side for the material
            materials[materialData.id].shadowSide = THREE.BackSide;
        }
    }

    // Return the dictionary of created materials
    return materials;
}
