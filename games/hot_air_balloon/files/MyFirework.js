import * as THREE from 'three';

export class MyFirework {
    constructor(app) {
        this.app = app; // Reference to the application (scene, renderer, etc.)
        this.done = false; // Indicates whether the firework has completed its animation

        this.dest = []; // Destination position for the rocket before explosion
        this.geometry = null; // BufferGeometry for the particles
        this.material = new THREE.PointsMaterial({
            size: 2, // Size of each particle
            vertexColors: true, // Enables custom colors for particles
            transparent: true, // Allows opacity changes
            opacity: 1, // Initial opacity of particles
            depthTest: false, // Particles will not be occluded by other objects
        });

        this.height = 110; // Target height for the firework launch
        this.speed = 30; // Speed at which the rocket travels to its destination
        this.particles = []; // Array to store particles after the explosion

        // Predefined hues for limiting colors to red, yellow, green, and blue
        const predefinedHues = [0.0, 0.16, 0.33, 0.66];
        this.hue = predefinedHues[Math.floor(Math.random() * predefinedHues.length)]; // Randomly select a color hue

        this.launch(); // Initialize the firework launch
    }

    launch() {
        const color = new THREE.Color();
        // Set color to a random hue with high saturation and brightness
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.9);

        const colors = [color.r, color.g, color.b]; // Store RGB values for the rocket
        const vertices = [0, 0, 0]; // Initial position at the origin (launch point)

        // Set random destination coordinates for the rocket
        this.dest = [
            THREE.MathUtils.randFloat(-35, 35),
            THREE.MathUtils.randFloat(this.height * 0.9, this.height * 1.1),
            THREE.MathUtils.randFloat(-35, 35),
        ];

        // Create a BufferGeometry and assign initial position and color
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

        // Create the Points object and add it to the scene
        this.points = new THREE.Points(this.geometry, this.material);
        this.app.scene.add(this.points);
    }

    explode(origin) {

        const numParticles = 70; // Number of particles in the explosion
        const positions = []; // Array to store particle positions
        const velocities = []; // Array to store particle velocities
        const colors = []; // Array to store particle colors

        for (let i = 0; i < numParticles; i++) {
            // Randomize the direction and speed of each particle
            const angle = Math.random() * Math.PI * 2;
            const speed = THREE.MathUtils.randFloat(0, 2.5);
            const ySpeed = THREE.MathUtils.randFloat(0, 1.5) * (Math.random() < 0.5 ? 1 : -1); // Randomize vertical direction

            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed, // X-axis velocity
                ySpeed,                 // Y-axis velocity
                Math.sin(angle) * speed // Z-axis velocity
            );

            velocities.push(velocity); // Store velocity for the particle

            // Initialize particle position at the origin of the explosion
            positions.push(origin[0], origin[1], origin[2]);

            // Set a predefined hue and slightly reduced saturation and brightness
            const color = new THREE.Color();
            color.setHSL(this.hue, 0.8, 0.4);
            colors.push(color.r, color.g, color.b); // Store RGB values for the particle
        }

        // Update the geometry with new particle attributes
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        this.particles = velocities; // Store the particle velocities for the update loop
    }

    reset() {
        // Remove the firework from the scene and dispose of its resources
        this.app.scene.remove(this.points);
        this.geometry.dispose();
        this.material.dispose();
        this.done = true; // Mark the firework as completed
    }

    update() {
        if (this.done) return; // Exit if the firework is already done

        const positions = this.geometry.getAttribute('position').array;

        if (this.particles.length === 0) {
            // Move the rocket towards its destination
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += (this.dest[i] - positions[i]) / this.speed;
                positions[i + 1] += (this.dest[i + 1] - positions[i + 1]) / this.speed;
                positions[i + 2] += (this.dest[i + 2] - positions[i + 2]) / this.speed;
            }

            this.geometry.getAttribute('position').needsUpdate = true;

            // Trigger explosion when the rocket is near its destination
            if (Math.ceil(positions[1]) > this.dest[1] * 0.95) {
                this.explode(positions.slice(0, 3)); // Pass the rocket's position to the explosion
            }
        } else {
            // Update the positions of the particles based on their velocities
            for (let i = 0; i < this.particles.length; i++) {
                const velocity = this.particles[i];

                positions[i * 3] += velocity.x;       // Update X position
                positions[i * 3 + 1] += velocity.y;  // Update Y position
                positions[i * 3 + 2] += velocity.z;  // Update Z position

                velocity.y -= 0.01; // Apply gravity to Y-axis velocity
            }

            this.geometry.getAttribute('position').needsUpdate = true;

            // Gradually reduce opacity of the particles
            this.material.opacity -= 0.015;
            this.material.needsUpdate = true;

            // Reset the firework when particles are fully faded out
            if (this.material.opacity <= 0) {
                this.reset();
            }
        }
    }
}
