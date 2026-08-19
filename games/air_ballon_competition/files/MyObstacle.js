import * as THREE from 'three';

export class MyObstacle {
    constructor(app) {
        this.app = app;

        // Load textures
        const textureLoader = new THREE.TextureLoader();
        const hemisphereTexture = textureLoader.load('./../scenes/textures/lateral_orange.png');
        const circleTexture = textureLoader.load('./../scenes/textures/front_orange.png');

        // Shader material for hemisphere
        const hemisphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 }, // Uniform for time
                uTexture: { value: hemisphereTexture }, // Hemisphere texture
            },
            vertexShader: `
                uniform float uTime;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    float scale = 1.0 + 0.2 * sin(uTime * 0.4); // Pulsating scale
                    vec3 newPosition = position * scale;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                varying vec2 vUv;

                void main() {
                    vec4 textureColor = texture2D(uTexture, vUv);
                    gl_FragColor = vec4(textureColor.rgb, textureColor.a);
                }
            `,
            side: THREE.DoubleSide
        });

        // Shader material for circle
        const circleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 }, // Uniform for time
                uTexture: { value: circleTexture }, // Circle texture
            },
            vertexShader: `
                uniform float uTime;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    float scale = 1.0 + 0.2 * sin(uTime * 0.4); // Pulsating scale
                    vec3 newPosition = position * scale;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                varying vec2 vUv;

                void main() {
                    vec4 textureColor = texture2D(uTexture, vUv);
                    gl_FragColor = vec4(textureColor.rgb, textureColor.a);
                }
            `,
            side: THREE.DoubleSide
        });

        // Create oranges array
        this.oranges = [];
        for (let i = 0; i < 5; i++) {
            const hemisphere = new THREE.Mesh(
                new THREE.SphereGeometry(2.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
                hemisphereMaterial
            );
            const circle = new THREE.Mesh(
                new THREE.CircleGeometry(2.5, 32),
                circleMaterial
            );
            circle.rotation.x = -Math.PI / 2;

            const orangeGroup = new THREE.Group();
            orangeGroup.add(hemisphere);
            orangeGroup.add(circle);

            orangeGroup.name = `orange${i + 1}`;
            this.oranges.push(orangeGroup);
        }

        // Set positions and rotations
        this.oranges[0].position.set(30, -10, 90);
        this.oranges[1].position.set(70, 15, 20);
        this.oranges[2].position.set(70, 10, -110);
        this.oranges[3].position.set(-40, 10, -130);
        this.oranges[4].position.set(-120, -20, 0);

        this.oranges[0].rotation.set(0, 0, (3 * Math.PI) / 2);
        this.oranges[1].rotation.set((3 * Math.PI) / 2, 0, 0);
        this.oranges[2].rotation.set(0, 0, Math.PI / 2);
        this.oranges[3].rotation.set(0, 0, Math.PI / 2);
        this.oranges[4].rotation.set(Math.PI / 2, 0, 0);

        // Add oranges to the scene
        this.oranges.forEach((orange) => this.app.scene.add(orange));

        // Create bounding boxes
        this.boundingBoxes = this.oranges.map((orange) => new THREE.Box3().setFromObject(orange));
    }

    // Update shaders for pulsating effect
    update(deltaTime) {
        this.oranges.forEach((orange) => {
            orange.children.forEach((child) => {
                if (child.material && child.material.uniforms && child.material.uniforms.uTime) {
                    child.material.uniforms.uTime.value += deltaTime; // Atualizar o tempo
                }
            });
        });
    }
    

    // Check for collisions
    checkCollisions(object) {
        const objectBox = new THREE.Box3().setFromObject(object);

        for (let i = this.boundingBoxes.length - 1; i >= 0; i--) {
            if (this.boundingBoxes[i].intersectsBox(objectBox)) {
                const collidedOrange = this.oranges[i];
                if (collidedOrange) {
                    this.app.scene.remove(collidedOrange);
                    this.oranges.splice(i, 1);
                    this.boundingBoxes.splice(i, 1);
                }
                return true;
            }
        }
        return false;
    }

    // Function to clear all obstacles
    clearObstacles() {
        // Remove all obstacles from the scene
        this.oranges.forEach((orange) => {
            this.app.scene.remove(orange);
        });

        // Clear arrays
        this.oranges = [];
        this.boundingBoxes = [];
    }
}
