import * as THREE from 'three';

export class MyOutdoorDisplay {
    constructor(scene) {
        this.scene = scene;
        this.canvas = null;
        this.context = null;
        this.texture = null;
        this.outdoorDisplay = null;
    }

    // Method to create the outdoor display
    create(elapsedTime, laps, airLayer, vouchers, status,name) {
        // Create a canvas for the display
        this.canvas = document.createElement('canvas');
        this.canvas.width = 512;
        this.canvas.height = 256;
        this.context = this.canvas.getContext('2d');

        // Draw the initial content for the outdoor display
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'white';
        this.context.font = '20px Arial';
        this.context.fillText(`Elapsed Time: ${elapsedTime}`, 10, 50);
        this.context.fillText(`Laps: ${laps}/2`, 10, 100);
        this.context.fillText(`Air Layer: ${airLayer}`, 10, 150);
        this.context.fillText(`Vouchers: ${vouchers}`, 10, 200);
        this.context.fillText(`Status: ${status}`, 10, 250);

        // Second column, to align to the center
        this.context.fillText(`Layers:`, 280, 50); 
        this.context.fillText(`0 - No wind`, 300, 75); 
        this.context.fillText(`1 - North`, 300, 100); 
        this.context.fillText(`2 - East`, 300, 125); 
        this.context.fillText(`3 - West`, 300, 150);

        // Create a texture from the canvas
        this.texture = new THREE.CanvasTexture(this.canvas);

        // Create the outdoor plane
        const geometry = new THREE.PlaneGeometry(10, 5);
        const material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide });
        this.outdoorDisplay = new THREE.Mesh(geometry, material);

        // Position the outdoor display in the 3D scene
        this.outdoorDisplay.position.set(0, 10, -20); // Adjust as needed
        this.outdoorDisplay.name = name;

        // Add the display to the scene
        this.scene.add(this.outdoorDisplay);
    }

    // Method to update the outdoor display
    update(elapsedTime, laps, airLayer, vouchers, status) {
        if (!this.context || !this.texture) return;

        // Clear the canvas
        this.context.clearRect(0, 0, 512, 256);

        // Redraw the updated information
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, 512, 270);
        this.context.fillStyle = 'white';
        this.context.font = '20px Arial';
        this.context.fillText(`Elapsed Time: ${elapsedTime}`, 10, 50);
        this.context.fillText(`Laps: ${laps}/2`, 10, 100);
        this.context.fillText(`Air Layer: ${airLayer}`, 10, 150);
        this.context.fillText(`Vouchers: ${vouchers}`, 10, 200);
        this.context.fillText(`Status: ${status}`, 10, 250);

        // Second column, to align to the center
        this.context.fillText(`Layers:`, 280, 50); 
        this.context.fillText(`0 - No wind`, 300, 75); 
        this.context.fillText(`1 - North`, 300, 100); 
        this.context.fillText(`2 - East`, 300, 125); 
        this.context.fillText(`3 - West`, 300, 150);



        // Update the texture
        this.texture.needsUpdate = true;
    }

    // Method to remove the outdoor display
    remove() {
        if (this.outdoorDisplay) {
            this.scene.remove(this.outdoorDisplay);
            this.outdoorDisplay.geometry.dispose();
            this.outdoorDisplay.material.dispose();
            this.texture.dispose();
            this.outdoorDisplay = null;
            this.canvas = null;
            this.context = null;
            this.texture = null;
        }
    }
}
