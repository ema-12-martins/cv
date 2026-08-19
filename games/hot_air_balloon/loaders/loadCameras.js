import * as THREE from 'three';

export function loadCameras(data, app, gui) {
    // Iterate over the cameras 
    for (const key in data.cameras) {
        const cameraData = data.cameras[key];
        let newCamera;

        if (cameraData.type === 'perspective') {
            // Create a perspective camera
            newCamera = new THREE.PerspectiveCamera(
                cameraData.fov,
                cameraData.aspect,
                cameraData.near,
                cameraData.far
            );

            newCamera.position.set(
                cameraData.location[0],
                cameraData.location[1],
                cameraData.location[2]
            );

            newCamera.lookAt(
                cameraData.target[0],
                cameraData.target[1],
                cameraData.target[2]
            );
        } else if (cameraData.type === 'orthogonal') {
            // Calculate frustum dimensions
            const aspect = window.innerWidth / window.innerHeight;
            const frustumSize = 20; // Adjustable size

            const left = -frustumSize / 2 * aspect;
            const right = frustumSize / 2 * aspect;
            const top = frustumSize / 2;
            const bottom = -frustumSize / 2;
            const near = 1;
            const far = 1000;

            // Create an orthographic camera
            newCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);

            newCamera.position.set(
                cameraData.location[0],
                cameraData.location[1],
                cameraData.location[2]
            );

            newCamera.lookAt(
                new THREE.Vector3(
                    cameraData.target[0],
                    cameraData.target[1],
                    cameraData.target[2]
                )
            );
        }

        // Store the camera in the app object using its ID
        app.cameras[cameraData.id] = newCamera;

        // Add the camera name to the GUI list
        gui.addList_of_cameras(cameraData.id);
    }

    // Set the active camera
    app.setActiveCamera(data.activeCameraId);

    // Set the first camera in the GUI
    gui.setCurrent_camera(data.activeCameraId);

    //To know the inicial position of the camera
    return new THREE.Vector3(...data.cameras[data.activeCameraId].location)
}
