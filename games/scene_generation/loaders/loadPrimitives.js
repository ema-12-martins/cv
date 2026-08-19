import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

// Function to create the rectangle geometry
export function createRectangle(child) {
    const width = Math.abs(child.representations[0].xy2[0]) + Math.abs(child.representations[0].xy2[0]);
    const height = Math.abs(child.representations[0].xy2[1]) + Math.abs(child.representations[0].xy2[1]);
    return new THREE.PlaneGeometry(width, height,child.representations[0].parts_x, child.representations[0].parts_y);
}

// Function to create NURBS surface geometry
export function createNurbs(child) {
    const knots1 = [];
    const knots2 = [];
    for (let i = 0; i <= child.representations[0].degree_u; i++) {
        knots1.push(0);
    }
    for (let i = 0; i <= child.representations[0].degree_u; i++) {
        knots1.push(1);
    }
    for (let i = 0; i <= child.representations[0].degree_v; i++) {
        knots2.push(0);
    }
    for (let i = 0; i <= child.representations[0].degree_v; i++) {
        knots2.push(1);
    }

    const stackedPoints = [];
    for (let i = 0; i < child.representations[0].degree_u + 1; i++) {
        const newRow = [];
        for (let j = 0; j < child.representations[0].degree_v + 1; j++) {
            const row = child.representations[0].controlpoints[i * (child.representations[0].degree_v + 1) + j];
            newRow.push(new THREE.Vector4(row.x, row.y, row.z, 1));
        }
        stackedPoints[i] = newRow;
    }

    const nurbsSurface = new NURBSSurface(child.representations[0].degree_u, child.representations[0].degree_v, knots1, knots2, stackedPoints);
    return new ParametricGeometry((u, v, target) => {
        nurbsSurface.getPoint(u, v, target);
    }, child.representations[0].parts_u, child.representations[0].parts_v);
}

// Function to create cylinder geometry
export function createCylinder(child) {
    return new THREE.CylinderGeometry(
        child.representations[0].top,
        child.representations[0].base,
        child.representations[0].height,
        child.representations[0].slices,
        child.representations[0].stacks,
        child.representations[0].capsclose,
        child.representations[0].thetaStart,
        child.representations[0].thetaLength
    );
}

// Function to create sphere geometry
export function createSphere(child) {
    const representation = child.representations[0];
    
    return new THREE.SphereGeometry(
        representation.radius,                           
        representation.slices,                          
        representation.stacks,                        
        representation.thetastart * (Math.PI / 180) || 0,                
        representation.thetalength * (Math.PI / 180) || Math.PI * 2,   
        representation.phistart * (Math.PI / 180) || 0,                   
        representation.philength * (Math.PI / 180) || Math.PI       
    );
}


// Function to create box geometry
export function createBox(child) {
    const v1 = new THREE.Vector3(...child.representations[0].xyz1);
    const v2 = new THREE.Vector3(...child.representations[0].xyz2);
    const width = Math.abs(v2.x - v1.x);
    const height = Math.abs(v2.y - v1.y);
    const depth = Math.abs(v2.z - v1.z);
    return new THREE.BoxGeometry(width, height, depth, child.representations[0].parts_x, child.representations[0].parts_y, child.representations[0].parts_z);
}

// Function to create triangle geometry with UV mapping
export function createTriangle(child) {
    const v1 = new THREE.Vector3(...child.representations[0].xyz1);
    const v2 = new THREE.Vector3(...child.representations[0].xyz2);
    const v3 = new THREE.Vector3(...child.representations[0].xyz3);

    const textlength_s = child.custom?.texlength_s || 1;
    const textlength_t = child.custom?.texlength_t || 1;

    const s1 = 0, t1 = 0;
    const edgeLength = v1.distanceTo(v2);
    const s2 = edgeLength / textlength_s, t2 = 0;

    const base = v3.clone().sub(v1).length();
    const angle = Math.atan2(v3.y - v1.y, v3.x - v1.x);

    const s3 = (base * Math.cos(angle)) / textlength_s;
    const t3 = (base * Math.sin(angle)) / textlength_t;

    const vertices = new Float32Array([
        ...v1.toArray(),
        ...v2.toArray(),
        ...v3.toArray(),
    ]);

    const uvs = new Float32Array([
        s1, t1, 
        s2, t2, 
        s3, t3,
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    return geometry;
}

// Function to create polygon geometry with gradient
export function createPolygon(child) {
    const numberOfSlices = child.representations[0].slices;
    const numberofStacks = child.representations[0].stacks;
    const angle = (Math.PI * 2) / child.representations[0].slices;

    let vertices = [];
    for (let i = 0; i < numberOfSlices; i++) {
        let x = child.representations[0].radius * Math.cos(i * angle);
        let y = child.representations[0].radius * Math.sin(i * angle);
        let nextX = child.representations[0].radius * Math.cos((i + 1) * angle);
        let nextY = child.representations[0].radius * Math.sin((i + 1) * angle);

        vertices.push(0, 0, 0);
        vertices.push(x, y, 0);
        vertices.push(nextX, nextY, 0);
    }

    for (let stack = 1; stack <= numberofStacks; stack++) {
        for (let slice = 0; slice <= numberOfSlices; slice++) {
            let x1 = child.representations[0].radius * Math.cos(slice * angle);
            let y1 = child.representations[0].radius * Math.sin(slice * angle);
            let x2 = child.representations[0].radius * Math.cos((slice + 1) * angle);
            let y2 = child.representations[0].radius * Math.sin((slice + 1) * angle);

            vertices.push(x1 * stack, y1 * stack, 0);
            vertices.push(x1 * (stack + 1), y1 * (stack + 1), 0);
            vertices.push(x2 * stack, y2 * stack, 0);

            vertices.push(x2 * (stack + 1), y2 * (stack + 1), 0);
            vertices.push(x2 * stack, y2 * stack, 0);
            vertices.push(x1 * (stack + 1), y1 * (stack + 1), 0);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    let gradientMaterial = new THREE.ShaderMaterial({
        uniforms: {
            colorCenter: { value: new THREE.Color(...child.representations[0].color_c) },
            colorPeriphery: { value: new THREE.Color(...child.representations[0].color_p) },
            geometrySize: { value: (child.representations[0].slices - 1) * child.representations[0].radius }
        },
        vertexShader: `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 colorCenter;
            uniform vec3 colorPeriphery;
            uniform float geometrySize;
            varying vec3 vPosition;
            void main() {
                float distance = length(vPosition.xy) / geometrySize;
                distance = clamp(distance, 0.0, 1.0);
                vec3 color = mix(colorCenter, colorPeriphery, distance);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        side: THREE.DoubleSide,
        transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, gradientMaterial);
    return mesh;
}

// Function to create a spotlight
export function createSpotLight(child) {
    const lightColor = new THREE.Color(...child.color);
    const spotLight = new THREE.SpotLight(lightColor, child.intensity, child.distance, (child.angle * (Math.PI / 180)), child.penumbra, child.decay);

    spotLight.position.set(...child.position);

    if (child.castshadow) {
        spotLight.shadow.camera.far = child.shadowfar;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 0.5;
        spotLight.shadow.camera.far = 500;
    }

    const target = new THREE.Object3D();
    target.position.set(...child.target);
    spotLight.target = target;

    //To set if is visible or not
    spotLight.visible = child.enabled

    const spotLightGroup = new THREE.Group();
    spotLightGroup.add(spotLight);
    spotLightGroup.add(target);

    return spotLightGroup;
}

// Function to create a point light
export function createPointLight(child) {
    const lightColor = new THREE.Color(...child.color);
    const pointLight = new THREE.PointLight(lightColor, child.intensity, child.distance, child.decay);

    pointLight.position.set(...child.position);

    // Casting shadow
    if (child.castshadow) {
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = child.shadowmapsize || 512; // Default value
        pointLight.shadow.mapSize.height = child.shadowmapsize || 512; // Default value
        pointLight.shadow.camera.near = 0.5;
        pointLight.shadow.camera.far = child.shadowfar || 500; // Default value
    }

    //To set if is visible or not
    pointLight.visible = child.enabled

    return pointLight;
}

// Function to create a directional light
export function createDirectionalLight(child) {
    const lightColor = new THREE.Color(...child.color);
    const directionalLight = new THREE.DirectionalLight(lightColor, child.intensity);

    directionalLight.position.set(...child.position);

    // Casting shadow
    if (child.castshadow) {
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = child.shadowmapsize || 512; // Default value
        directionalLight.shadow.mapSize.height = child.shadowmapsize || 512; // Default value
        directionalLight.shadow.camera.left = child.shadowleft || -5; // Default value
        directionalLight.shadow.camera.right = child.shadowright || 5; // Default value
        directionalLight.shadow.camera.top = child.shadowtop || 5; // Default value
        directionalLight.shadow.camera.bottom = child.shadowbottom || -5; // Default value
        directionalLight.shadow.camera.far = child.shadowfar || 500; // Default value
        directionalLight.shadow.camera.near = 0.5;
    }
    
    //To set if is visible or not
    directionalLight.visible = child.enabled

    return directionalLight;
}



