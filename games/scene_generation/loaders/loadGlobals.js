import * as THREE from 'three';

export function configureShadows(renderer) {
    //The shadows are this type, per default
    renderer.shadowMap.enabled = true; 
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

export function configureBackground(scene, backgroundColor) {
    //Background with the color passed by argument
    scene.background = new THREE.Color(...backgroundColor);
}

export function addAmbientLight(scene, ambientOptions) {
    //Ambient collor with the attributes pased by arguement
    const ambientColor = new THREE.Color(...ambientOptions.slice(0, 3));
    const ambientIntensity = ambientOptions[3];
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);
}

export function configureFog(scene, fogOptions) {
    //Fog defined with the attributes given by argument
    const fogColor = new THREE.Color(...fogOptions.color);
    scene.fog = new THREE.Fog(fogColor, fogOptions.near, fogOptions.far);
}

export function addSkybox(scene, skyboxOptions) {
    // Create a texture loader for loading skybox textures
    const loader = new THREE.TextureLoader();

    // Create materials for each side of the skybox
    const materials_skybox = ['front', 'back', 'up', 'down', 'left', 'right'].map((side) =>
        new THREE.MeshStandardMaterial({
            map: loader.load(skyboxOptions[side]), // Load the texture for the current side
            emissive: new THREE.Color(...skyboxOptions.emissive), // Set the emissive color
            emissiveIntensity: skyboxOptions.intensity, // Set the emissive intensity
            side: THREE.BackSide, // Render in both sizes
        })
    );

    // Create a box geometry with the specified size
    const skyboxGeometry = new THREE.BoxGeometry(...skyboxOptions.size);

    // Create a mesh by combining the box geometry and the array of materials
    const skybox = new THREE.Mesh(skyboxGeometry, materials_skybox);

    // Position the skybox in the scene based on the specified center
    skybox.position.set(...skyboxOptions.center);

    // Add the skybox mesh to the scene
    scene.add(skybox);
}

