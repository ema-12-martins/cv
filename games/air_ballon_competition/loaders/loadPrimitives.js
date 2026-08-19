import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

// Upload the texture fot the letters
const textureLoader = new THREE.TextureLoader();
const Letterstexture = textureLoader.load('./../scenes/textures/letters.avif'); // Path to the letters texture
const ArrowTexture = textureLoader.load('./../scenes/textures/arrow.png'); // Path to the arrow texture

//Size of the leettersTextures
const LetterstextureWidth = 626
const LetterstextureHeight = 417

//Dictionaries to map the letters
const dicXMin = {"a":20,"b":115,"c":195,"d":270,"e":365,"f":450,"g":530, "h":20,"i":115,"j":175,"k":250,"l":335,"m":410,"n":515,"o":20,"p":110,"q":185,"r":280,"s":365,"t":440,"u":520,"v":85,"w":175,"x":280,"y":365,"z":450, "-":0}
const dicXMax = {"a":115,"b":195,"c":270,"d":365,"e":450,"f":530,"g":600, "h":115, "i":175,"j":250,"k":330,"l":405,"m":510,"n":600,"o":100,"p":180,"q":275,"r":360,"s":435,"t":520,"u":600,"v":175,"w":280,"x":365,"y":450,"z":540,"-": 20}
const dicYMin = {"a":25,"b":25,"c":25,"d":25,"e":25,"f":25,"g":25,"h":120,"i":110,"j":120,"k":120,"l":120,"m":120,"n":120,"o":210,"p":210,"q":210,"r":210,"s":210,"t":210,"u":210,"v":300,"w":300,"x":300,"y":300,"z":300, "-": 0}
const dicYMax = {"a":120,"b":120,"c":120,"d":120, "e":120,"f":120,"g":120, "h":210,"i":210,"j":210,"k":210,"l":210,"m":210,"n":210,"o":300,"p":300,"q":300,"r":300,"s":300,"t":300,"u":300,"v":390,"w":390,"x":390,"y":390,"z":390, "-": 20}

export function createLathe(child) {
    const controlpoints2D = child.representations[0].controlpoints2D;

    // Convert points into Vector2
    const points = controlpoints2D.map((point) => {
        if (point.x !== undefined && point.y !== undefined) {
            return new THREE.Vector2(point.x, point.y);
        } else {
            console.error("Invalid point format:", point);
            return null;
        }
    }).filter(Boolean); // Filtra pontos inválidos

    // Create the geometry
    return new THREE.LatheGeometry(points, child.representations[0].segments);
}

// Function to create the rectangle geometry
export function createRectangle(child) {
    const width = Math.abs(child.representations[0].xy2[0]) + Math.abs(child.representations[0].xy2[0]);
    const height = Math.abs(child.representations[0].xy2[1]) + Math.abs(child.representations[0].xy2[1]);
    return new THREE.PlaneGeometry(width, height,child.representations[0].parts_x, child.representations[0].parts_y);
}

// Function to create the rectangle geometry
export function createLetter(child) {
    const width = Math.abs(child.representations[0].xy2[0]) + Math.abs(child.representations[0].xy2[0]);
    const height = Math.abs(child.representations[0].xy2[1]) + Math.abs(child.representations[0].xy2[1]);
    const geometry = new THREE.PlaneGeometry(width, height, child.representations[0].parts_x, child.representations[0].parts_y);

    if (child.representations[0].letter!=="->" && child.representations[0].letter!=="<-"){
        // To define the UV values
        const uvAttribute = geometry.attributes.uv;

        // Define the limits of the pixels that we want
        const xMin = dicXMin[child.representations[0].letter]; // Píxel inicial X
        const xMax = dicXMax[child.representations[0].letter]; // Píxel final X
        const yMin = dicYMin[child.representations[0].letter];  // Píxel inicial Y
        const yMax = dicYMax[child.representations[0].letter]; // Píxel final Y

        // Converte the values for the space UV
        const uMin = xMin / LetterstextureWidth;
        const uMax = xMax / LetterstextureWidth;
        const vMin = 1- (yMin / LetterstextureHeight);
        const vMax = 1- (yMax / LetterstextureHeight);

        // Update the values 
        uvAttribute.setXY(0, uMin, vMin); // Inf Left
        uvAttribute.setXY(1, uMax, vMin); // Inf Right
        uvAttribute.setXY(2, uMin, vMax); // Sup Left
        uvAttribute.setXY(3, uMax, vMax); // Sup Right

        uvAttribute.needsUpdate = true;


        // Create the material with the texture of the letters
        const material = new THREE.MeshBasicMaterial({
            map: Letterstexture, 
            side: THREE.DoubleSide
        });

        // Create the mesh
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }else{
        // Create the material with the texture of the letters
        const material = new THREE.MeshBasicMaterial({
            map: ArrowTexture, 
            side: THREE.DoubleSide
        });

        // Create the mesh
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
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

//To find the perpendicular point of the points given by the curve
export function findPerpendicularPoint(pointA, pointB, distance) {
    // Vetor entre os pontos A e B
    const v = {
        x: pointB.x - pointA.x,
        y: pointB.y - pointA.y,
        z: pointB.z - pointA.z
    };

    // Vetor arbitrário não paralelo a v
    const w = { x: 0, y: 1, z: 0 }; // Pode ser ajustado

    // Produto vetorial para obter vetor perpendicular
    const n = {
        x: v.y * w.z - v.z * w.y,
        y: v.z * w.x - v.x * w.z,
        z: v.x * w.y - v.y * w.x
    };

    // Comprimento do vetor perpendicular
    const lengthN = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z);

    // Normalizar o vetor perpendicular
    const nUnit = {
        x: n.x / lengthN,
        y: n.y / lengthN,
        z: n.z / lengthN
    };

    // Encontrar o ponto perpendicular a uma distância especificada
    const perpendicularPoint = {
        x: pointA.x + nUnit.x * distance,
        y: pointA.y + nUnit.y * distance,
        z: pointA.z + nUnit.z * distance
    };

    return perpendicularPoint;
}


// Function to create box geometry
export function createRoad(child) {
    // COnvert to THREE.Vector3
    const points = child.representations[0].controlpoints.flat().map(point => new THREE.Vector3(point.x, point.y, point.z));


   //Create cat-mull-rom curve
    const curve = new THREE.CatmullRomCurve3(points, true);
    const curvePoints = curve.getPoints(child.representations[0].segments);

    //To close the curve, repeat the first point in the final -> copy because if not it uses the same reference
    curvePoints.push(new THREE.Vector3(curvePoints[0].x, curvePoints[0].y, curvePoints[0].z));
    curvePoints.push(new THREE.Vector3(curvePoints[1].x, curvePoints[1].y, curvePoints[1].z));

    // Determine the points to create the road
    const points_to_buffer = []
    for (let i = 0; i < curvePoints.length-2; i++) {

        //Determining the perpendicular point
        const perpendicularPoint1 = findPerpendicularPoint(curvePoints[i],curvePoints[i+1],child.representations[0].width)
        const perpendicularPoint2 = findPerpendicularPoint(curvePoints[i+1],curvePoints[i+2],child.representations[0].width)

        // Verify if points are valid (not NaN)
        if (isNaN(perpendicularPoint2.x) || isNaN(perpendicularPoint2.y) || isNaN(perpendicularPoint2.z)) {
            curvePoints.splice(i+1, 1); //Take off the point that makes NaN
            i--
            continue; // Skip this iteration
        }

        //1 triangle
        points_to_buffer.push(curvePoints[i].x)
        points_to_buffer.push(curvePoints[i].y)
        points_to_buffer.push(curvePoints[i].z)

        points_to_buffer.push(perpendicularPoint1.x)
        points_to_buffer.push(perpendicularPoint1.y)
        points_to_buffer.push(perpendicularPoint1.z)

        points_to_buffer.push(curvePoints[i+1].x)
        points_to_buffer.push(curvePoints[i+1].y)
        points_to_buffer.push(curvePoints[i+1].z)

        //2 triangle
        points_to_buffer.push(perpendicularPoint1.x)
        points_to_buffer.push(perpendicularPoint1.y)
        points_to_buffer.push(perpendicularPoint1.z)

        points_to_buffer.push(curvePoints[i+1].x)
        points_to_buffer.push(curvePoints[i+1].y)
        points_to_buffer.push(curvePoints[i+1].z)

        points_to_buffer.push(perpendicularPoint2.x)
        points_to_buffer.push(perpendicularPoint2.y)
        points_to_buffer.push(perpendicularPoint2.z)

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points_to_buffer, 3));
    geometry.computeVertexNormals();

    return geometry
}



