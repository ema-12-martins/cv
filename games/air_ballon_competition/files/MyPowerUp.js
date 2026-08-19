import * as THREE from 'three';

export class MyPowerUp {
    constructor(app) {
        this.app = app;

        // Load textures
        const textureLoader = new THREE.TextureLoader();
        const candyTexture = textureLoader.load('./../scenes/textures/candy_2.png'); // Candy texture

        // Create material with texture
        const candyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 }, // Uniform for time
                uTexture: { value: candyTexture }, // Candy texture
            },
            vertexShader: `
                uniform float uTime;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    float scale = 1.5 + 0.25 * sin(uTime * 0.5); // Slow pulsating effect
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
            side: THREE.DoubleSide,
            transparent: true,
        });

        // Geometry for the candy
        const geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32);

        // Create an array of candies
        this.candies = [];
        for (let i = 0; i < 5; i++) {
            const candy = new THREE.Mesh(geometry, candyMaterial);
            candy.name = `candy${i + 1}`;
            this.candies.push(candy);
        }

        // Set positions and rotations for candies
        this.candies[0].position.set(50, -20, 100);
        this.candies[1].position.set(80, 20, -20);
        this.candies[2].position.set(0, 10, -130);
        this.candies[3].position.set(-115, -10, -80);
        this.candies[4].position.set(-100, -20, 90);

        this.candies[0].rotation.set(0, 0, (3 * Math.PI) / 2);
        this.candies[1].rotation.set((3 * Math.PI) / 2, 0, 0);
        this.candies[2].rotation.set(0, 0, Math.PI / 2);
        this.candies[3].rotation.set(Math.PI / 3, 0, Math.PI / 2);
        this.candies[4].rotation.set(Math.PI / 2, 0, (4 * Math.PI) / 6);

        // Add candies to the scene
        this.candies.forEach((candy) => this.app.scene.add(candy));

        // Create bounding boxes
        this.boundingBoxes = this.candies.map((candy) => new THREE.Box3().setFromObject(candy));
    }

    // Update shaders for pulsating effect
    update(deltaTime) {
        this.candies.forEach((candy) => {
            if (candy.material && candy.material.uniforms && candy.material.uniforms.uTime) {
                candy.material.uniforms.uTime.value += deltaTime * 0.5; // Slow down the time
            }
        });
    }

    // Check for collisions with an object
    checkCollisions(object) {
        const objectBox = new THREE.Box3().setFromObject(object);

        for (let i = this.boundingBoxes.length - 1; i >= 0; i--) {
            if (this.boundingBoxes[i].intersectsBox(objectBox)) {
                const collidedCandy = this.candies[i];
                if (collidedCandy) {
                    // Remove candy from the scene
                    this.app.scene.remove(collidedCandy);

                    // Update arrays
                    this.candies.splice(i, 1);
                    this.boundingBoxes.splice(i, 1);
                }
                return true;
            }
        }
        return false;
    }

    clearPowerUps() {
        // Remove all candies from the scene
        this.candies.forEach((candy) => {
            this.app.scene.remove(candy);
        });
    
        // Limpar arrays de candies e bounding boxes
        this.candies = [];
        this.boundingBoxes = [];
    }
}
