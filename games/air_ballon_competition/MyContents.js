import * as THREE from 'three';
import { MyFileReader } from './parser/MyFileReader.js';

import {
    configureShadows,
    configureBackground,
    addAmbientLight,
    configureFog,
    addSkybox,
} from './loaders/loadGlobals.js';

import { loadTextures } from './loaders/loadTextures.js';

import { loadMaterials } from './loaders/loadMaterials.js';

import { loadCameras } from './loaders/loadCameras.js';

import { createNodeDict, likeTheFather, traverseNodes } from './loaders/loadNodes.js';

import {
    createBox,
    createCylinder,
    createNurbs,
    createPointLight,
    createPolygon,
    createRectangle,
    createRoad,
    createLetter,
    createSpotLight,
    createTriangle,
    createLathe,
    createSphere,
    createDirectionalLight,
} from './loaders/loadPrimitives.js';

import { MyRoute } from './files/MyRoute.js';
import { MyObstacle } from './files/MyObstacle.js';
import { MyPowerUp } from './files/MyPowerUp.js';
import { MyFirework } from './files/MyFirework.js';
import { MyOutdoorDisplay } from './files/MyOutdoorDisplay.js';

/**
 *  This class contains the contents of our application
 */
class MyContents {
    /**
     * Constructs the object
     * @param {MyApp} app The application object
     */
    constructor(app, gui) {
        this.app = app;
        this.gui = gui;
        this.axis = false;

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open('scenes/SGI_TP2_JSON_T07_G03_v02.json');

        // To know if the position changed, we have the position of the camera
        this.camera_position_before = new THREE.Vector3(0, 0, 0);

        // To know if it is to have the objects in wireframe or not
        this.wireframe = false;

        // To know if it is to have the objects in axis or not
        this.axis = false;

        // If it is the first time, needs to enter the loop
        this.loop = true;

        // For picking some objects
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Add event listener for picking
        window.addEventListener('click', this.onMouseClick.bind(this));

        // List of objects by name (use string names that will match objects in the scene)
        this.objects_ballon_1 = ["basketLateral1", "basketLateral2", "basketLateral3", "basketLateral4", "basketBase", "balloon", "rope1", "rope2", "rope3", "rope4"];
        this.objects_ballon_2 = ["basketLateral5", "basketLateral6", "basketLateral7", "basketLateral8", "basketBase2", "balloon2", "rope5", "rope6", "rope7", "rope8"];

        //List of objects that make some objects
        this.elementsSelect = ["select1", "select2", "select3", "select4", "select5", "select6"];
        this.elementsChoose = ["choose1", "choose2", "choose3", "choose4", "choose5", "choose6", "choose7", "choose8", "choose9", "choose10", "choose11", "choose12", "choose13", "choose14", "choose15", "choose17", "choose18", "choose19", "choose20", "choose21", "choose22", "choose23", "choose24", "choose25", "choose26", "choose27", "choose28"]

        this.elementsSide = ["side1", "side2", "side3", "side4", "side5", "side6", "side7", "side8", "side9", "side10", "side11", "side12", "side13", "side14", "side15", "side16", "side17", "side18", "side19", "side20", "side21", "side22", "arrow1", "arrow2", "start1", "start2", "start3", "start4", "start5"]

        this.elementsName = ["name1", "name2", "name3", "name4", "name5", "name6", "name7", "name8", "name9", "name10", "name11", "name12", "name13", "fullName_plane"]

        this.elementsPause = ["pause1","pause2","pause3","pause4","pause5"]
        this.elementsPause2 = ["pause6","pause7","pause8","pause9","pause10"]
        this.elementsPause3 = ["pause11","pause12","pause13","pause14","pause15"]

        //To set the selected ballon
        this.selected_ballon = null

        this.side = "r"

        //To know in which state i am in
        this.menu_number = 1

        //To see which key was clicked 
        this.onKeyDown = this.onKeyDown.bind(this);  // Define this first
        document.addEventListener('keydown', this.onKeyDown); // Add event listener after defining the method

        //To know in which level the balloon is
        this.level = 0

        //Define the velocity of the ballon
        this.velocity = 15

        //Old position of the balloon -> used to know how to change the position of the camera
        this.old_balloon_position = { x: 0, y: 0, z: 0 }

        //Nº vouchers
        this.vouchers = 1

        //To see if is out of road
        this.out_road = false
        this.mid_side_road = 1400

        //To change level
        this.changeLevel = false
        this.forEachLevel = null

        //Infos for the autonomous balloon
        const myRoute = new MyRoute();
        this.route1 = myRoute.getPointsRoute1()

        //Variables to check and to know if it pass the finish line
        this.checkPlane1 = false
        this.checkPlane2 = false
        this.checkPlane3 = false
        this.checkPlane1_autonomous = false

        //To know the lap
        this.lap_balloon = 0
        this.lap_balloon_autonomous = 0

        //To change between cameras
        this.actual_camera_index = 0

        //To check collision with another balloon
        this.balloonCollision = false

        //Containing the particles of the fireworks
        this.fireworks = []
        this.active_fireworks = false

        //Name of the player
        this.playerName = []
        this.textureLoader = new THREE.TextureLoader();
        this.lettersTexture = this.textureLoader.load('./scenes/textures/alphabet2.png'); // Path to the letters texture

        //Start time
        this.startTime = 0

        //To know when the pause occored
        this.status = "running"

        //To know if it wins 
        this.win = null

        //Time of the run
        this.run_time = null

    }

    createRaceInfoElement() {
        // Check if the element already exists to avoid duplicates
        if (document.getElementById('race-info')) return;
    
        // Create the container div for race info
        const raceInfoDiv = document.createElement('div');
        raceInfoDiv.id = 'race-info';
        raceInfoDiv.style.position = 'absolute';
        raceInfoDiv.style.top = '10px';
        raceInfoDiv.style.right = '10px';
        raceInfoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        raceInfoDiv.style.color = 'white';
        raceInfoDiv.style.padding = '10px';
        raceInfoDiv.style.borderRadius = '5px';
        raceInfoDiv.style.fontFamily = 'Arial, sans-serif';
        raceInfoDiv.style.fontSize = '14px';
        raceInfoDiv.style.zIndex = '1000';
    
        // Add default race information
        raceInfoDiv.innerHTML = `
            <div id="race-position">Position: 1st / 8</div>
            <div id="race-time">Time: 00:00.00</div>
            <div id="race-lap">Lap: 1 / 3</div>
            <div id="race-speed">Speed: 0 km/h</div>
        `;
    
        // Append the div to the body
        document.body.appendChild(raceInfoDiv);
    }

    disableRaceInfoElement() {
        const raceInfoDiv = document.getElementById('race-info');
        if (raceInfoDiv) {
            // Remove the race info element from the DOM
            document.body.removeChild(raceInfoDiv);
        }
    }
    
    

    // Function to update the balloon based on the current wind direction (level)
    createKeyframeAnimation(balloonPart) {
        // Determine the movement based on the current level
        let positionKF;

        if (this.changeLevel) {
            if (this.forEachLevel === "up") {
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[y]`,
                    [0, 1],
                    [balloonPart.position.y, balloonPart.position.y + 700]
                );
            } else if (this.forEachLevel === "down") {
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[y]`,
                    [0, 1],
                    [balloonPart.position.y, balloonPart.position.y - 700]
                );
            }
            // Reset `changeLevel` and `forEachLevel` after setting the animation
            this.changeLevel = false;
            this.forEachLevel = null;
        } else {

            //To animate if dependent of the level and if is in our out the road
            if (this.level === 0) {
                //Create frameTrack
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[y]`, // Path to the animate property
                    [0, 1], // Time for the frames
                    [balloonPart.position.y, balloonPart.position.y] // No movement
                );
                if (this.balloonCollision === true) {
                                    //Create frameTrack
                    positionKF = new THREE.KeyframeTrack(
                        `${balloonPart.name}.position[x]`, // Path to the animate property
                        [0, 1], // Time for the frames
                        [balloonPart.position.x, balloonPart.position.x - this.mid_side_road]
                    );
                    this.balloonCollision = false
                }
            }
            else if (this.level === 3 && this.out_road === false) {

                //Create frameTrack
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[z]`, // Path to the animate property
                    [0, 1], // Time for the frames
                    [balloonPart.position.z, balloonPart.position.z + this.velocity]
                );
            }
            else if (this.level === 3 && (this.out_road === true || this.out_road === "processed" || this.balloonCollision === true)) {

                //Create frameTrack
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[z]`, // Path to the animate property
                    [0, 1], // Time for the frames
                    [balloonPart.position.z, balloonPart.position.z - this.mid_side_road],

                );
                if (this.balloonCollision === false) {
                    
                    if (this.vouchers>0){
                        this.out_road = false
                        this.vouchers -= 1
                    }else{
                        this.out_road = "processed"
                    }
                }
                this.balloonCollision = false
            }
            else if (this.level === 4 && this.out_road === false) {

                //Create frameTrack
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[z]`, // Path to the animate property
                    [0, 1], // Time for the frames
                    [balloonPart.position.z, balloonPart.position.z - this.velocity]
                );
            }
            else if (this.level === 4 && (this.out_road === true || this.out_road === "processed" || this.balloonCollision === true)) {

                //Create frameTrack
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[z]`, // Path to the animate property
                    [0, 1], // Time for the frames
                    [balloonPart.position.z, balloonPart.position.z + this.mid_side_road]
                );
                if (this.balloonCollision === false) {
                    if (this.vouchers>0){
                        this.out_road = false
                        this.vouchers -= 1
                    }else{
                        this.out_road = "processed"
                    }    
                }
                this.balloonCollision = false

            }
            else if (this.level === 1 && this.out_road === false) {

                //Create frameTrack
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[x]`, // Path to the animate property
                    [0, 1], // Time for the frames
                    [balloonPart.position.x, balloonPart.position.x + this.velocity]
                );
            }
            else if (this.level === 1 && (this.out_road === true || this.out_road === "processed" || this.balloonCollision === true)) {

                //Create frameTrack
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[x]`, // Path to the animate property
                    [0, 1], // Time for the frames
                    [balloonPart.position.x, balloonPart.position.x - this.mid_side_road]
                );
                if (this.balloonCollision === false) {
                    if (this.vouchers>0){
                        this.out_road = false
                        this.vouchers -= 1
                    }else{
                        this.out_road = "processed"
                    }
                }
                this.balloonCollision = false

            }
            else if (this.level === 2 && this.out_road === false) {

                //Create frameTrack
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[x]`, // Path to the animate property
                    [0, 1], // Time for the frames
                    [balloonPart.position.x, balloonPart.position.x - this.velocity]
                );
            }
            else if (this.level === 2 && (this.out_road === true || this.out_road === "processed" || this.balloonCollision === true)) {
                //Create frameTrack
                positionKF = new THREE.KeyframeTrack(
                    `${balloonPart.name}.position[x]`, // Path to the animate property
                    [0, 1], // Time for the frames
                    [balloonPart.position.x, balloonPart.position.x + this.mid_side_road]
                );
                if (this.balloonCollision === false) {  
                    if (this.vouchers>0){
                        this.out_road = false
                        this.vouchers -= 1
                    }else{
                        this.out_road = "processed"
                    }
                }
                this.balloonCollision = false
            }
        }
        if (positionKF === undefined) {
            return
        }
        // Create animation clip with the keyframes
        const clip = new THREE.AnimationClip('moveBalloon', 1, [positionKF]); //The number is the seconds
        

        // Create mixer for animation
        this.mixer = new THREE.AnimationMixer(balloonPart);

        // Add animation to mixer and play
        this.mixer.clipAction(clip).play();

    }


    verifyIfInsideRoad(balloonPart) {
        // Ray is the position on the ballon
        const raycaster = new THREE.Raycaster();
        let actualPosition;
        if (this.selected_ballon === 1) {
            actualPosition = new THREE.Vector3(balloonPart.position.x-8, balloonPart.position.y, balloonPart.position.z-2.75);
        }
        else {
            actualPosition = new THREE.Vector3(balloonPart.position.x+5, balloonPart.position.y, balloonPart.position.z-2.75)
        }
        raycaster.set(actualPosition, new THREE.Vector3(0, -1, 0)); // To go down

        const road1 = this.app.scene.getObjectByName("road1");
        if (!road1) return;

        // Verify interseptions
        const intersects = raycaster.intersectObject(road1, true); // 'true'
        
        if (intersects.length <= 0) { //Its outside the road
            this.out_road = true
        
        }
    }

    detectionCollisionWithEnemy(balloon, other) {
        //Get the balloon objects
        let other_balloon = this.app.scene.getObjectByName(other);
        let balloonBox = new THREE.Box3().setFromObject(balloon);
        let other_balloonBox = new THREE.Box3().setFromObject(other_balloon);
        return balloonBox.intersectsBox(other_balloonBox);
    }

    detectCollisionWithCheckpoints(ballon, other) {

        //Get the ballon objects
        let other_ballon = this.app.scene.getObjectByName(other);
        let plane1 = this.app.scene.getObjectByName("verificationPlanes1");
        let plane2 = this.app.scene.getObjectByName("verificationPlanes2");
        let plane3 = this.app.scene.getObjectByName("verificationPlanes3");
        let plane4 = this.app.scene.getObjectByName("verificationPlanes4");

        //Create the boxes
        let ballonBox = new THREE.Box3().setFromObject(ballon);
        let other_ballonBox = new THREE.Box3().setFromObject(other_ballon);
        let plane1Box = new THREE.Box3().setFromObject(plane1);
        let plane2Box = new THREE.Box3().setFromObject(plane2);
        let plane3Box = new THREE.Box3().setFromObject(plane3);
        let plane4Box = new THREE.Box3().setFromObject(plane4);

        //Verify if the ballon pass a plane
        if (ballonBox.intersectsBox(plane1Box)) {
            this.checkPlane1 = true
        } else if (ballonBox.intersectsBox(plane2Box)) {
            this.checkPlane2 = true
        } else if (ballonBox.intersectsBox(plane3Box)) {
            this.checkPlane3 = true
        } else if (ballonBox.intersectsBox(plane4Box)) {
            if (this.checkPlane1 === true && this.checkPlane2 === true && this.checkPlane3 === true) {
                this.checkPlane1 = false
                this.checkPlane2 = false
                this.checkPlane3 = false
                this.lap_balloon += 1

                if(this.lap_balloon ===2){
                    //Put visible the menu 5
                    this.menu_number = 5
                    this.win = true
                    this.run_time = this.calculate_time()
                    this.change_to_menu_5()
                }
            }
        }

        //Check if the opositor pass a plane
        if (other_ballonBox.intersectsBox(plane1Box)) {
            this.checkPlane1_autonomous = true
        } else if (other_ballonBox.intersectsBox(plane4Box)) {
            if (this.checkPlane1_autonomous === true) {
                this.checkPlane1_autonomous = false
                this.lap_balloon_autonomous += 1

                if(this.lap_balloon_autonomous ===2){
                    //Put visible the menu 5
                    this.menu_number = 5
                    this.win = false
                    this.run_time = this.calculate_time()
                    this.change_to_menu_5()
                }
            }
        }
    }

    calculate_time(){
        // Calculate the elapsed time in milliseconds
        const elapsedTimeMs = new Date() - this.startTime;

        // Convert elapsed time to minutes (integer part)
        const minutes = Math.floor(elapsedTimeMs / 60000);

        // Calculate the remaining seconds (integer part)
        const seconds = Math.floor((elapsedTimeMs % 60000) / 1000);

        // Get the remaining milliseconds
        const milliseconds = elapsedTimeMs % 1000;

        // Format the time as "MM:SS.mmm" (e.g., 01:23.456)
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;

        return formattedTime

    }


    animate() {
        //See if is paused
        if (this.status === "paused") {
            return;
        }

        this.display_info.update(this.calculate_time(), this.lap_balloon, this.level, this.vouchers,this.status)
        this.display_info2.update(this.calculate_time(), this.lap_balloon, this.level, this.vouchers,this.status)
        this.display_info3.update(this.calculate_time(), this.lap_balloon, this.level, this.vouchers,this.status)

        // Chama a animação do balão sempre que a seleção ou nível mudar
        if (this.menu_number === 4) {
            //The target is the balloon
            let balloonPart = null
            let other_ballon = null

            //To update the size of the obstacles
            const deltaTime = this.app.clock.getDelta();

            this.myObstacle.update(deltaTime);
            this.myPowerUp.update(deltaTime);

            //To update projection of the ballon
            const projection_ballon = this.app.scene.getObjectByName("projection_ballon");

            //To update the the pause
            const pause = this.app.scene.getObjectByName("pause_group");
            const pause3 = this.app.scene.getObjectByName("pause_group3");

            //Set properties of the cameras
            if (this.selected_ballon === 1) {
                balloonPart = this.app.scene.getObjectByName("ballon1_group");

                other_ballon = "ballon2_group"
                if (this.actual_camera_index === 0) {
                    this.app.renderer.render(this.app.scene, this.app.cameras["cam1"]);
                    this.app.controls.target.copy(balloonPart.position);
                } else if (this.actual_camera_index === 2) {
                    this.app.renderer.render(this.app.scene, this.app.cameras["cam3"]);
                    if (this.level === 0 || this.level === 1) {
                        this.app.controls.target.copy({ x: 2000, y: -26.74, z: balloonPart.position.z });
                    } else if (this.level === 2) {
                        this.app.controls.target.copy({ x: -2000, y: -26.74, z: balloonPart.position.z });
                    } else if (this.level === 3) {
                        this.app.controls.target.copy({ x: balloonPart.position.x, y: -26.74, z: 2000 });
                    } else if (this.level === 4) {
                        this.app.controls.target.copy({ x: balloonPart.position.x, y: -26.74, z: -2000 });
                    }

                } else {
                    this.app.renderer.render(this.app.scene, this.app.cameras["cam2"]);
                    this.app.controls.target.copy({ x: 0, y: 0, z: -11 });
                }

            } else {
                balloonPart = this.app.scene.getObjectByName("ballon2_group");
                other_ballon = "ballon1_group"
                if (this.actual_camera_index === 0) {
                    this.app.renderer.render(this.app.scene, this.app.cameras["cam1"]);
                    this.app.controls.target.copy(balloonPart.position);
                } else if (this.actual_camera_index === 2) {
                    this.app.renderer.render(this.app.scene, this.app.cameras["cam3"]);
                    if (this.level === 0 || this.level === 1) {
                        this.app.controls.target.copy({ x: 2000, y: -26.74, z: balloonPart.position.z });
                    } else if (this.level === 2) {
                        this.app.controls.target.copy({ x: -2000, y: -26.74, z: balloonPart.position.z });
                    } else if (this.level === 3) {
                        this.app.controls.target.copy({ x: balloonPart.position.x, y: -26.74, z: 2000 });
                    } else if (this.level === 4) {
                        this.app.controls.target.copy({ x: balloonPart.position.x, y: -26.74, z: -2000 });
                    }
                } else {
                    this.app.renderer.render(this.app.scene, this.app.cameras["cam2"]);
                    this.app.controls.target.copy({ x: 0, y: 0, z: -11 });
                }
            }
            if (this.out_road === "processed") {
                //Spot the mixer 
                if (this.mixer) {
                    this.mixer.stopAllAction();
                }

                setTimeout(() => {
                    //To update the camera with the same moviments made by the balloon
                    let actualCamera = this.app.getActiveCamera();
                    this.createKeyframeAnimation(balloonPart);

                    //Positions when we do the calculations
                    const ballon_x = balloonPart.position.x
                    const ballon_y = balloonPart.position.y
                    const ballon_z = balloonPart.position.z

                    //Move as the same as the ballon
                    const move_x = this.old_balloon_position.x - ballon_x
                    const move_y = this.old_balloon_position.y - ballon_y
                    const move_z = this.old_balloon_position.z - ballon_z

                    //Update camera position
                    this.app.cameras["cam1"].position.set(this.app.cameras["cam1"].position.x - move_x, this.app.cameras["cam1"].position.y - move_y, this.app.cameras["cam1"].position.z - move_z);
                    this.app.cameras["cam3"].position.set(this.app.cameras["cam3"].position.x - move_x, this.app.cameras["cam3"].position.y - move_y, this.app.cameras["cam3"].position.z - move_z);

                    //Update the position of the shadow
                    projection_ballon.position.set(projection_ballon.position.x - move_x, projection_ballon.position.y, projection_ballon.position.z - move_z);

                    //Update the position of outdoor
                    this.OutdoorDisplay.position.set(this.OutdoorDisplay.position.x - move_x, this.OutdoorDisplay.position.y - move_y, this.OutdoorDisplay.position.z - move_z);
                    this.OutdoorDisplay3.position.set(this.OutdoorDisplay3.position.x - move_x, this.OutdoorDisplay3.position.y - move_y, this.OutdoorDisplay3.position.z - move_z);
                    
                    //Update pause
                    pause.position.set(pause.position.x - move_x, pause.position.y - move_y, pause.position.z - move_z);
                    pause3.position.set(pause3.position.x - move_x, pause3.position.y - move_y, pause3.position.z - move_z);

                    //Update the old position of the balloon
                    this.old_balloon_position.x = ballon_x
                    this.old_balloon_position.y = ballon_y
                    this.old_balloon_position.z = ballon_z

                    //Update controls
                    this.app.controls.object = actualCamera;
                    this.app.controls.update();
                    // change the state to out
                    this.out_road = false;

                    // Continua o loop de animação
                    requestAnimationFrame(this.animate.bind(this));

                }, 3000);


            } else {
                if (this.mixer) {
                    this.mixer.update(0.016); // Update animation   
                }


                //To update the camera with the same moviments made by the balloon
                let actualCamera = this.app.getActiveCamera();

                
                //Verify colisions
                this.verifyIfInsideRoad(balloonPart)
                this.createKeyframeAnimation(balloonPart);

                //Positions when we do the calculations
                const ballon_x = balloonPart.position.x
                const ballon_y = balloonPart.position.y
                const ballon_z = balloonPart.position.z

                //Move as the same as the ballon
                const move_x = this.old_balloon_position.x - ballon_x
                const move_y = this.old_balloon_position.y - ballon_y
                const move_z = this.old_balloon_position.z - ballon_z

                //Update camera position
                this.app.cameras["cam1"].position.set(this.app.cameras["cam1"].position.x - move_x, this.app.cameras["cam1"].position.y - move_y, this.app.cameras["cam1"].position.z - move_z);this.app.cameras["cam3"].position.set(this.app.cameras["cam3"].position.x - move_x, this.app.cameras["cam3"].position.y - move_y, this.app.cameras["cam3"].position.z - move_z);

                //Update the position of the shadow
                projection_ballon.position.set(projection_ballon.position.x - move_x, projection_ballon.position.y, projection_ballon.position.z - move_z);

                //Update the position of outdoor
                this.OutdoorDisplay.position.set(this.OutdoorDisplay.position.x - move_x, this.OutdoorDisplay.position.y - move_y, this.OutdoorDisplay.position.z - move_z);
                this.OutdoorDisplay3.position.set(this.OutdoorDisplay3.position.x - move_x, this.OutdoorDisplay3.position.y - move_y, this.OutdoorDisplay3.position.z - move_z);

                //Update pause
                pause.position.set(pause.position.x - move_x, pause.position.y - move_y, pause.position.z - move_z);
                pause3.position.set(pause3.position.x - move_x, pause3.position.y - move_y, pause3.position.z - move_z);

                //Update the old position of the balloon
                this.old_balloon_position.x = ballon_x
                this.old_balloon_position.y = ballon_y
                this.old_balloon_position.z = ballon_z

                //Update controls
                this.app.controls.object = actualCamera;
                this.app.controls.update();


                //Check if colides with an obstacle or powerup
                const colide_powerUp = this.myPowerUp.checkCollisions(balloonPart)
                if (colide_powerUp === true) {
                    this.vouchers += 1
                }

                const colide_enemy = this.detectionCollisionWithEnemy(balloonPart, other_ballon)

                const colide_obstacle = this.myObstacle.checkCollisions(balloonPart)
                if (colide_obstacle === true || colide_enemy === true) {
                    if (colide_enemy === true) {
                        this.balloonCollision = true
                        this.createKeyframeAnimation(balloonPart)
                    } 
                    else{
                        this.balloonCollision = false
                    } 
                    if (this.vouchers > 0) {
                        this.vouchers -= 1
                        requestAnimationFrame(this.animate.bind(this));
                    } else {
                        if (this.mixer) {
                            this.mixer.stopAllAction();
                        }

                        setTimeout(() => {
                            // Continua o loop de animação
                            requestAnimationFrame(this.animate.bind(this));
                        }, 3000);
                    }
                } else {
                    //Watch chekpoints
                    this.detectCollisionWithCheckpoints(balloonPart, other_ballon)

                    // Continua o loop de animação
                    requestAnimationFrame(this.animate.bind(this));
                }

            }
        }
    }

    animateAutonomousBalloon() {

        let autonomousBalloon = this.app.scene.getObjectByName(
            this.selected_ballon === 1 ? "ballon2_group" : "ballon1_group"
        );

        this.balloonMixer = new THREE.AnimationMixer(autonomousBalloon);

        const times = [];
        const values = [];
        const speed = 66; 

        let totalDistance = 0;

        // Calcular a distância total entre os pontos
        for (let i = 1; i < this.route1.length; i++) {
            const prevPoint = this.route1[i - 1];
            const currPoint = this.route1[i];
            totalDistance += Math.sqrt(
                Math.pow(currPoint.x - prevPoint.x, 2) +
                Math.pow(currPoint.y - prevPoint.y, 2) +
                Math.pow(currPoint.z - prevPoint.z, 2)
            );
        }

        let currentTime = 0;

        this.route1.forEach((point, index) => {
            // Se não for o primeiro ponto, calcular o tempo necessário para a distância entre os pontos
            if (index > 0) {
                const prevPoint = this.route1[index - 1];
                const distance = Math.sqrt(
                    Math.pow(point.x - prevPoint.x, 2) +
                    Math.pow(point.y - prevPoint.y, 2) +
                    Math.pow(point.z - prevPoint.z, 2)
                );
                const timeForSegment = (distance / totalDistance) * (this.route1.length - 1) * speed;
                currentTime += timeForSegment;
            }
            times.push(currentTime);
            values.push(point.x, point.y, point.z);
        });

        const positionTrack = new THREE.VectorKeyframeTrack(
            ".position",
            times,
            values
        );

        const duration = currentTime; // A duração total é o tempo total calculado
        const clip = new THREE.AnimationClip("BalloonMovement", duration, [
            positionTrack,
        ]);

        const action = this.balloonMixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat);
        action.play();

        this.startAutonomousAnimationLoop();
    }

    startAutonomousAnimationLoop() {
        if (this.status === "paused") {
            return; 
        }
    
        if (this.balloonMixer) {
            this.balloonMixer.update(0.25);
        } else {
            console.error("No mixer available!");
        }
    
        requestAnimationFrame(this.startAutonomousAnimationLoop.bind(this));
    }
    


    addSpritesheetCoordinates(key, object) {
        const asciiValue = key.charCodeAt(0); // Convert the character to its ASCII value
        object.visible = true; // Make the object visible
    
        // Define the texture and UV mapping
        const rows = 16; // Number of rows in the texture grid
        const cols = 16; // Number of columns in the texture grid
        const charIndex = asciiValue - 32; // Offset ASCII to match grid index (assuming ' ' is the first character)
        const col = charIndex % cols; // Column index in the texture grid
        const row = Math.floor(charIndex / cols); // Row index in the texture grid
    
        // Set the UV mapping for the specific character
        const u0 = col / cols; // Left UV coordinate
        const v0 = 1 - (row + 1) / rows; // Top UV coordinate (inverted Y-axis for WebGL)
        const u1 = (col + 1) / cols; // Right UV coordinate
        const v1 = 1 - row / rows; // Bottom UV coordinate
    
        const geometry = object.geometry;
    
        if (!geometry.attributes.uv) {
            console.error("The object does not have UV coordinates.");
            return;
        }
    
        // Ensure UV coordinates are applied correctly to the quad geometry
        const uvArray = geometry.attributes.uv.array;
    
        // Bottom-left
        uvArray[0] = u0; uvArray[1] = v1;
        // Bottom-right
        uvArray[2] = u1; uvArray[3] = v1;
        // Top-left
        uvArray[4] = u0; uvArray[5] = v0;
        // Top-right
        uvArray[6] = u1; uvArray[7] = v0;
    
        geometry.attributes.uv.needsUpdate = true; // Ensure UV updates are applied
    
        // Apply the texture and set material transparency
        object.material.map = this.lettersTexture; // Set the texture as the material's map
        object.material.transparent = true; // Enable transparency
        object.material.needsUpdate = true; // Ensure the material updates
    
        // Add the character to the player's name
        this.playerName += key;
    }
    
    
    
    
    


    onKeyDown(event) {
        //To change the position of the ballon
        if (this.menu_number === 4) {
            if ((event.key === "W" || event.key === "w")) {
                // If not in the highest level, change the level
                if (this.level !== 4) {
                    this.level += 1;
                    this.forEachLevel = "up"
                    this.changeLevel = true
                }
            } else if ((event.key === "S" || event.key === "s")) {
                // If not in the lowest level, change the level
                if (this.level !== 0) {
                    this.level -= 1;
                    this.forEachLevel = "down"
                    this.changeLevel = true
                }
            }
            //To change cameras during the game
            if ((event.key === "Q" || event.key === "q")) {
                if (this.actual_camera_index === 0) {
                    this.actual_camera_index += 1
                    this.app.setActiveCamera("cam2");

                    const Display1 = this.app.scene.getObjectByName("OutdoorDisplay1");
                    Display1.visible = false; // Make it invisible
                    const Display2 = this.app.scene.getObjectByName("OutdoorDisplay2");
                    Display2.visible = true; // Make it invisible

                    this.changeVisibility(false,this.elementsPause); // Make it invisible
                    this.changeVisibility(true,this.elementsPause2); // Make it invisible

                    
                } else if (this.actual_camera_index === 1) {
                    this.actual_camera_index += 1
                    this.app.setActiveCamera("cam3");

                    const Display1 = this.app.scene.getObjectByName("OutdoorDisplay2");
                    Display1.visible = false; // Make it invisible
                    const Display2 = this.app.scene.getObjectByName("OutdoorDisplay3");
                    Display2.visible = true; // Make it invisible

                    this.changeVisibility(false,this.elementsPause2); // Make it invisible
                    this.changeVisibility(true,this.elementsPause3); // Make it invisible

                } else if (this.actual_camera_index === 2) {
                    this.actual_camera_index = 0
                    this.app.setActiveCamera("cam1");

                    const Display1 = this.app.scene.getObjectByName("OutdoorDisplay3");
                    Display1.visible = false; // Make it invisible
                    const Display2 = this.app.scene.getObjectByName("OutdoorDisplay1");
                    Display2.visible = true; // Make it invisible

                    this.changeVisibility(false,this.elementsPause3); // Make it invisible
                    this.changeVisibility(true,this.elementsPause); // Make it invisible
                }
            }
        } if (this.menu_number === 2) {
            // Check if the key is a letter, number, or underscore
            if (/^[a-z]$/.test(event.key)) {
                
                // Get the index for the next character in the name
                const name_index = this.playerName.length + 1;
                
                // Generate the object name
                const objectName = `fullName${name_index}`;
                
                // Get the object by its name
                const object = this.app.scene.getObjectByName(objectName);

                //Correspond coordinates in spritesheet
                this.addSpritesheetCoordinates(event.key, object)
            }else if (event.key === "Backspace") {
                if (this.playerName.length > 0) {
                    // Remove the last character from the player's name
                    this.playerName = this.playerName.slice(0, -1);
        
                    // Get the index of the last character
                    const name_index = this.playerName.length + 1;
        
                    // Generate the object name corresponding to the last character
                    const objectName = `fullName${name_index}`;
        
                    // Find the object in the scene
                    const object = this.app.scene.getObjectByName(objectName);

                    // Make the object invisible
                    object.visible = false;
    
                    // Optionally, reset the texture of the object
                    object.material.map = null;
                    object.material.needsUpdate = true;
                }
            }
            
        }


    }


    /**
     * Handles mouse clicks for picking
     * @param {MouseEvent} event
     */
    onMouseClick(event) {
        // Convert mouse coordinates to the normalized device coordinates [-1, 1]
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Perform picking
        this.pickObject();
    }

    // Function to converter a texture to black and white 
    convertTextureToGrayscale(texture) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = texture.image.width;
        const height = texture.image.height;
        canvas.width = width;
        canvas.height = height;

        // Draw texture in canvas
        ctx.drawImage(texture.image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // Convert to gray scale
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b; // Formule for gray

            // Apply the gray to the componentes
            pixels[i] = gray;
            pixels[i + 1] = gray;
            pixels[i + 2] = gray;
        }

        // Put data into canvas
        ctx.putImageData(imageData, 0, 0);

        // Create new texture based on gray
        const newTexture = new THREE.CanvasTexture(canvas);
        return newTexture;
    }

    // Function to change the color of the object
    setObjectColor(object, color, isGrayscale = false) {
        if (object.material) {
            // Keep the original texture
            if (!object.originalTexture && object.material.map) {
                object.originalTexture = object.material.map; // Here it keep the original one
            }
            if (!object.originalColor) {
                object.originalColor = object.material.color.clone(); // Here it keep the original one
            }

            // Management the textures if they exists
            if (object.material.map) {
                if (isGrayscale) {
                    const grayscaleTexture = this.convertTextureToGrayscale(object.material.map);
                    object.material.map = grayscaleTexture; // Change for the gray texture
                } else {
                    object.material.map = object.originalTexture; // Retorn to the original colors
                }
                object.material.needsUpdate = true; // Update the material
            }

            // Management materials, even when they don't have texture
            if (!isGrayscale) {
                // Return to the original color
                object.material.color.copy(object.originalColor);
            } else {
                // Define the color for the specific object
                object.material.color.set(color);
            }
        }
    }

    //Function to change the visibility of the button selected
    changeVisibility(value, name_elements) {
        name_elements.forEach(name => {
            const object = this.app.scene.getObjectByName(name); //Bring the object
            if (object) {
                object.visible = value; // Change visibility
            } else {
                console.warn(`Objeto com o nome "${name}" não foi encontrado na cena.`);
            }
        });
    }

    async activeFireworks(){
        while(this.active_fireworks === true){
            //Wait a little between launches
            await new Promise(resolve => setTimeout(resolve, 20));

            // Randomly create a new firework with a 5% probability on each update
            if (Math.random() < 0.05) {
                this.fireworks.push(new MyFirework(this.app)); // Add a new firework to the array
            }

            // Loop through all active fireworks
            for (let i = 0; i < this.fireworks.length; i++) {
                const firework = this.fireworks[i];
                firework.update(); // Update the firework's state (movement, explosion, fading, etc.)

                // If the firework is marked as "done" (animation complete)
                if (firework.done) {
                    this.fireworks.splice(i, 1); // Remove the firework from the array
                    i--; // Adjust the index to account for the removed firework
                }
            }
        }
    }

    createRunTimeElement(name) {
        // Remove old one
        const oldRunTime = this.app.scene.getObjectByName('runTimeText');
        if (oldRunTime) {
            this.app.scene.remove(oldRunTime);
        }
    
        // Create new
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 2048;
        canvas.height = 1024;
    
        // Style (no background fill for transparency)
        context.clearRect(0, 0, canvas.width, canvas.height); // Ensure the canvas is fully transparent
        context.font = '120px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(`${name} run time: ${this.run_time || 0}`, canvas.width / 2, canvas.height / 2);
    
        // Create Texture
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true, // Ensure transparency is enabled
        });
        const geometry = new THREE.PlaneGeometry(30, 15);
        const plane = new THREE.Mesh(geometry, material);
    
        // Positioning
        plane.position.set(-5, 55, 0);
        plane.scale.set(3, 3, 3);
        plane.name = 'runTimeText';
        this.app.scene.add(plane);
    }
    
    

    change_to_menu_5(){
        //Change camera for one, update target and position to the original ones
        this.actual_camera_index = 1
        this.app.cameras["cam1"].position.set(0, 10, 220);
        this.app.controls.target.copy({x:0,y:20,z:0});
        this.app.controls.object = this.app.cameras["cam1"];
        this.app.controls.update();

        //Stop animation of the second balloon
        this.status = "paused"
        

        //Change the elements visibility
        if (this.win){
            this.changeVisibility(true, ["win1","win2","win3","win4","win5","win6","win7"])
            this.changeVisibility(true, ["restart1","restart2","restart3","restart4","restart5","restart6","restart7"])
            this.changeVisibility(true, ["home1","home2","home3","home4"])
            this.changeVisibility(false, ["OutdoorDisplay1","OutdoorDisplay2","OutdoorDisplay3","pause1","pause2","pause3","pause4","pause5","pause6","pause7","pause8","pause9","pause10","pause11","pause12","pause13","pause14","pause15"])
            this.changeVisibility(false,["Lateral1Finish","Lateral2Finish","FinishPlane"])
            this.active_fireworks = true
            this.activeFireworks()
        }else{
            this.changeVisibility(true, ["lose1","lose2","lose3","lose4","lose5","lose6","lose7","lose8"])
            this.changeVisibility(true, ["home1","home2","home3","home4"])
            this.changeVisibility(true, ["restart1","restart2","restart3","restart4","restart5","restart6","restart7"])
            this.changeVisibility(false, ["OutdoorDisplay1","OutdoorDisplay2","OutdoorDisplay3","pause1","pause2","pause3","pause4","pause5","pause6","pause7","pause8","pause9","pause10","pause11","pause12","pause13","pause14","pause15"])
            this.changeVisibility(false,["Lateral1Finish","Lateral2Finish","FinishPlane"])
        }

        //Create the element with the run time
        this.createRunTimeElement(this.playerName)

        //Reset state of win
        this.win = null
        this.run_time = null


    }

    change_to_menu_2(){
        //Change some elements visibility
        this.changeVisibility(true, this.elementsName)
        this.changeVisibility(false, this.elementsChoose)

        //Create a group to have the elements off the new sentence side
        let side_group = new THREE.Group
        this.elementsSide.forEach((name) => {
            const sidePart = this.app.scene.getObjectByName(name);
            side_group.add(sidePart)
        });
        side_group.position.set(40, 35, 60 + 63)
        side_group.scale.set(0.6, 0.6, 0.6)
        side_group.rotation.set(0, 350, 0)
        side_group.name = "side_group"
        this.app.scene.add(side_group);

        //Color the both ballons
        //To see if the texture were already visited
        const list_visited = []

        //The second ballon need to return to the original color too
        if (this.selected_ballon === 1) {
            // Set ballon 2 to the original color
            this.objects_ballon_2.forEach((name) => {
                const balloonPart = this.app.scene.getObjectByName(name);
                if (balloonPart && !list_visited.includes(balloonPart.material.uuid)) {
                    this.setObjectColor(balloonPart, new THREE.Color(1, 1, 1), false);
                    list_visited.push(balloonPart.material.uuid); //Add the elements to the visited list
                }
            });
        } else {
            // Set ballon 2 to the original color
            this.objects_ballon_1.forEach((name) => {
                const balloonPart = this.app.scene.getObjectByName(name);
                if (balloonPart && !list_visited.includes(balloonPart.material.uuid)) {
                    this.setObjectColor(balloonPart, new THREE.Color(1, 1, 1), false);
                    list_visited.push(balloonPart.material.uuid); //Add the elements to the visited list
                }
            });
        }

        //After choose the balloon, create a group with the elements of it to scale to be good with the size of the road
        let ballon1_group = new THREE.Group
        this.objects_ballon_1.forEach((name) => {
            const balloonPart = this.app.scene.getObjectByName(name);
            ballon1_group.add(balloonPart)
        });
        let ballon2_group = new THREE.Group
        this.objects_ballon_2.forEach((name) => {
            const balloonPart = this.app.scene.getObjectByName(name);
            ballon2_group.add(balloonPart)
        });

        ballon1_group.scale.set(0.2, 0.2, 0.2)
        ballon1_group.position.set(0, -26.74, 49 + 63)
        ballon1_group.name = "ballon1_group"
        ballon2_group.scale.set(0.2, 0.2, 0.2)
        ballon2_group.position.set(0, -26.74, 49 + 63)
        ballon2_group.name = "ballon2_group"

        if (this.selected_ballon === 1) {
            ballon2_group.visible = false
        } else {
            ballon1_group.visible = false
        }

        //Add the groups to the scene
        this.app.scene.add(ballon1_group);
        this.app.scene.add(ballon2_group);

        this.changeVisibility(false, ["ballon1_group", "ballon2_group"])
            
    }

    change_to_menu_3(){
        //Change visibility of the elements to start the second scene
        this.changeVisibility(false, this.elementsSelect)
        this.changeVisibility(false, this.elementsChoose)
        this.changeVisibility(false, this.elementsName)
        this.changeVisibility(true, ["road1", "grass", "house1", "house2", "house3", "house4"])
        this.changeVisibility(true, this.elementsSide)
        this.changeVisibility(false, ["fullName1","fullName2","fullName3","fullName4","fullName5","fullName6","fullName7","fullName8","fullName9","fullName10","fullName11"])

        // See if both balloons have valid positions
        let targetGroup = null
        if (this.selected_ballon === 1) {
            targetGroup = this.app.scene.getObjectByName("ballon1_group");
            this.changeVisibility(true, ["ballon1_group"])
        } else {
            targetGroup = this.app.scene.getObjectByName("ballon2_group");
            this.changeVisibility(true, ["ballon2_group"])
        }

        // Update camera position
        this.app.cameras["cam1"].position.set(-60, -25, 30 + 63);

        // Change the target to be the balloon
        this.app.controls.target.copy(targetGroup.position);

        // Sincronize controls
        this.app.controls.object = this.app.cameras["cam1"];

        // Update controls
        this.app.controls.update();
    }

    change_to_menu_4(){
        //Hide the elements of the second menu
        this.changeVisibility(false, this.elementsSide)
        this.changeVisibility(true,["Lateral1Finish","Lateral2Finish","FinishPlane"])

        //Set the oponent ballon in the right side
        let balloon = null
        let ballon_selected = null
        if (this.selected_ballon === 1) {
            balloon = this.app.scene.getObjectByName("ballon2_group");
            ballon_selected = this.app.scene.getObjectByName("ballon1_group");
        } else {
            balloon = this.app.scene.getObjectByName("ballon1_group");
            ballon_selected = this.app.scene.getObjectByName("ballon2_group");
        }

        //To adjust the position of projection
        let position_projection_adjusts = null

        if (this.side === "r") {
            if (this.selected_ballon === 1){
                //Put the other balloon in the left side
                balloon.position.set(-12, -26.74, 30 + 63)
                this.old_balloon_position.x = -12
                this.old_balloon_position.y = -26.74
                this.old_balloon_position.z = 30 + 63

                //Adjust projection
                position_projection_adjusts = {x:-20, y:-4.9,z: -22}

            }else{
                //Put the other balloon in the left side
                balloon.position.set(-12, -26.74, 30 + 3)
                this.old_balloon_position.x = -12
                this.old_balloon_position.y = -26.74
                this.old_balloon_position.z = 30 + 63

                //Adjust projection
                position_projection_adjusts = {x:-7, y:-4.9,z: -22}
            }

            

            this.app.cameras["cam1"].position.set(-50, -25, 26.74 + 63);
            this.app.cameras["cam3"].position.set(-20, -26.74, 30 + 60.1);
            
        } else {
            if (this.selected_ballon === 1){
                balloon.position.set(-12, -26.74, 49 + 63)
                this.old_balloon_position.x = -12
                this.old_balloon_position.y = -26.74
                this.old_balloon_position.z = 49 + 63
            }else{
                balloon.position.set(-25, -26.74, 49 + 63)
                this.old_balloon_position.x = -25
                this.old_balloon_position.y = -26.74
                this.old_balloon_position.z = 49 + 63
            }
            

            //Update cameras positions
            this.app.cameras["cam1"].position.set(-50, -25, 46.74 + 63);
            this.app.cameras["cam3"].position.set(-23, -26.74, 49 + 60.1);

            //Adjust projection
            position_projection_adjusts = {x:-20, y:-4.9,z: 16}
        }

        //Create the projection in the wall
        const projectionGeometry = new THREE.PlaneGeometry(6, 6); // Adjust dimensions as needed
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x111111,
            transparent: true,
        });

        const projectionBallon = new THREE.Mesh(projectionGeometry, shadowMaterial);
        projectionBallon.name = "projection_ballon";

        // Position the shadow at the same location as the balloon but slightly lower
        projectionBallon.position.set(
            ballon_selected.position.x + position_projection_adjusts.x,
            ballon_selected.position.y + position_projection_adjusts.y, // Slightly below the balloon
            ballon_selected.position.z + position_projection_adjusts.z
        );

        // Rotate the shadow to lay flat on the ground
        projectionBallon.rotation.x = -Math.PI / 2;

        // Add the shadow to the scene
        this.app.scene.add(projectionBallon);



        //Put the other ballon visible too
        balloon.visible = true

        //Create a box to detect collisions
        this.box_active_balloon = new THREE.Box3().setFromObject(balloon);

        //Create obstacles and PowerUps
        this.myObstacle = new MyObstacle(this.app);
        this.myPowerUp = new MyPowerUp(this.app);

        //Set the time where it start
        this.startTime = new Date();

        //Display the information of the lap
        this.display_info = new MyOutdoorDisplay(this.app.scene)
        this.display_info.create(0, 0, 0, 0, "running","OutdoorDisplay1")
        this.OutdoorDisplay = this.app.scene.getObjectByName("OutdoorDisplay1");
        this.OutdoorDisplay.scale.set(3,3,3)
        this.OutdoorDisplay.rotation.set(-Math.PI/90,3* Math.PI/2,0)    
        this.OutdoorDisplay.position.set(45,7,173)
        
        this.display_info2 = new MyOutdoorDisplay(this.app.scene)
        this.display_info2.create(0, 0, 0, 0, "running","OutdoorDisplay2")
        this.OutdoorDisplay2 = this.app.scene.getObjectByName("OutdoorDisplay2");
        this.OutdoorDisplay2.visible = false; // Make it invisible
        this.OutdoorDisplay2.scale.set(3,3,3)
        this.OutdoorDisplay2.rotation.set(3* Math.PI/2,0,0)    
        this.OutdoorDisplay2.position.set(60,190,-65)

        this.display_info3 = new MyOutdoorDisplay(this.app.scene)
        this.display_info3.create(0, 0, 0, 0, "running","OutdoorDisplay3")
        this.OutdoorDisplay3 = this.app.scene.getObjectByName("OutdoorDisplay3");
        this.OutdoorDisplay3.visible = false; // Make it invisible
        this.OutdoorDisplay3.scale.set(3,3,3)
        this.OutdoorDisplay3.rotation.set(0,3* Math.PI/2,0)    
        this.OutdoorDisplay3.position.set(80,10,160)

        //Put visible the pause and create a group for pause
        this.changeVisibility(true, this.elementsPause)

        let pause_group = new THREE.Group();
        this.elementsPause.forEach((name) => {
            const pause_elem = this.app.scene.getObjectByName(name);
            if (pause_elem) {
                const cloned_elem = pause_elem; // Clone do elemento
                pause_group.add(cloned_elem);
            }
        });
        pause_group.position.set(70, 40, 30);
        pause_group.scale.set(0.5, 0.5, 0.5);
        pause_group.rotation.set(0, 3 * Math.PI / 2, 0);
        pause_group.name = "pause_group";
        this.app.scene.add(pause_group);

        let pause_group2 = new THREE.Group();
        this.elementsPause2.forEach((name) => {
            const pause_elem = this.app.scene.getObjectByName(name);
            if (pause_elem) {
                const cloned_elem = pause_elem; // Clone do elemento
                pause_group2.add(cloned_elem);
            }
        });
        pause_group2.position.set(-150, 75, -140);
        pause_group2.rotation.set(-Math.PI / 2, 0, 0);
        pause_group2.name = "pause_group2";
        this.app.scene.add(pause_group2);

        let pause_group3 = new THREE.Group();
        this.elementsPause3.forEach((name) => {
            const pause_elem = this.app.scene.getObjectByName(name);
            if (pause_elem) {
                const cloned_elem = pause_elem; // Clone do elemento
                pause_group3.add(cloned_elem);
            }
        });
        pause_group3.position.set(70, 30, 30);
        pause_group3.scale.set(0.45, 0.45, 0.45);
        pause_group3.rotation.set(0, 3 * Math.PI / 2, 0);
        pause_group3.name = "pause_group3";
        this.app.scene.add(pause_group3);

    }

    // Remove the group but not the elements inside the group
    ungroup(group) {
        if (!group || !this.app.scene) return;

        // Add children
        while (group.children.length > 0) {
            const child = group.children[0];
            this.app.scene.attach(child);
        }

        // Remove group
        this.app.scene.remove(group);
    }



    change_to_menu_1(){
        //Change visibility of the elements
        this.changeVisibility(true, this.elementsChoose)
        this.changeVisibility(false, ["road1", "grass", "house1", "house2", "house3", "house4"])

        //Remove some elements from the scene
        const outdoor = this.app.scene.getObjectByName("OutdoorDisplay1");
        this.app.scene.remove(outdoor);
        const outdoor2 = this.app.scene.getObjectByName("OutdoorDisplay2");
        this.app.scene.remove(outdoor2);
        const outdoor3 = this.app.scene.getObjectByName("OutdoorDisplay3");
        this.app.scene.remove(outdoor3);
        const projection_ballon = this.app.scene.getObjectByName("projection_ballon");
        this.app.scene.remove(projection_ballon);

        //Change camera for one, update target and position to the original ones
        this.actual_camera_index = 0
        this.app.cameras["cam1"].position.set(0, 35, 170);
        this.app.controls.target.copy({x:0,y:20,z:0});
        this.app.controls.object = this.app.cameras["cam1"];
        this.app.controls.update();
        this.app.cameras["cam2"].position.set(0, 290, -10);
        this.app.controls.target.copy({x:0,y:20,z:-10});
        this.app.controls.object = this.app.cameras["cam2"];
        this.app.controls.update();
        this.app.cameras["cam3"].position.set(0, 35, 170);
        this.app.controls.target.copy({x:0,y:20,z:0});
        this.app.controls.object = this.app.cameras["cam3"];
        this.app.controls.update();


        //Change ballons position
        let ballon1 = this.app.scene.getObjectByName("ballon1_group");
        let ballon2 = this.app.scene.getObjectByName("ballon2_group");

        ballon1.position.set(0,0,0)
        ballon2.position.set(0,0,0)
        ballon1.scale.set(1, 1, 1)
        ballon2.scale.set(1, 1, 1)

        //Remove the group
        this.ungroup(ballon1, this.app.scene);
        this.ungroup(ballon2, this.app.scene)
    }


    pickObject() {
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.app.getActiveCamera());

        // Determine the test objects
        const intersects = this.raycaster.intersectObjects(this.app.scene.children, true);

        // Filter to have only the visible objects
        const visibleIntersects = intersects.filter(intersect => intersect.object.visible);

        if (visibleIntersects.length > 0) {
            // The nearest object
            const intersectedObject = visibleIntersects[0].object;

            // Verify if the clicked object compose a balloon
            if (this.objects_ballon_1.includes(intersectedObject.name) && this.menu_number === 1) {
                this.selected_ballon = 1;

                // Set ballon 1 to the original color
                const list_visited = []
                this.objects_ballon_1.forEach((name) => {
                    const balloonPart = this.app.scene.getObjectByName(name);
                    if (balloonPart && !list_visited.includes(balloonPart.material.uuid)) {
                        this.setObjectColor(balloonPart, new THREE.Color(1, 1, 1), false);
                        list_visited.push(balloonPart.material.uuid); //Add the elements to the visited list
                    }
                });

                // Set ballon 2 to grays colors
                this.objects_ballon_2.forEach((name) => {
                    const balloonPart = this.app.scene.getObjectByName(name);
                    if (balloonPart && !list_visited.includes(balloonPart.material.uuid)) {
                        this.setObjectColor(balloonPart, new THREE.Color(0.1, 0.1, 0.1), true);
                        list_visited.push(balloonPart.material.uuid); //Add the elements to the visited list
                    }
                });


                //Change visibility of button select
                this.changeVisibility(true, this.elementsSelect)


            } else if (this.objects_ballon_2.includes(intersectedObject.name) && this.menu_number === 1) {
                this.selected_ballon = 2;

                //To see if the texture were already visited
                const list_visited = []
                // Set ballon 2 to the original color
                this.objects_ballon_2.forEach((name) => {
                    const balloonPart = this.app.scene.getObjectByName(name);
                    if (balloonPart && !list_visited.includes(balloonPart.material.uuid)) {
                        this.setObjectColor(balloonPart, new THREE.Color(1, 1, 1), false);
                        list_visited.push(balloonPart.material.uuid); //Add the elements to the visited list
                    }
                });

                // Set ballon 1 to gray colors
                this.objects_ballon_1.forEach((name) => {
                    const balloonPart = this.app.scene.getObjectByName(name);
                    if (balloonPart && !list_visited.includes(balloonPart.material.uuid)) {
                        this.setObjectColor(balloonPart, new THREE.Color(0.1, 0.1, 0.1), true);
                        list_visited.push(balloonPart.material.uuid); //Add the elements to the visited list
                    }
                });

                //Change visibility of button select
                this.changeVisibility(true, this.elementsSelect)
            } else if (this.elementsSelect.includes(intersectedObject.name) && this.menu_number === 1) {
                this.change_to_menu_2()
                //Change menu
                this.menu_number = 2

            } else if (this.elementsSelect.includes(intersectedObject.name) && this.menu_number === 2) {
                //Change menu to 3
                this.change_to_menu_3()
                this.menu_number = 3

            } else if ((intersectedObject.name === "arrow1" || intersectedObject.name === "arrow2") && this.menu_number === 3) {

                //Function to change the side of the ballon
                if (this.selected_ballon === 1) {
                    const balloon = this.app.scene.getObjectByName("ballon1_group");
                    if (intersectedObject.name === "arrow1") {
                        balloon.position.set(0, -26.74, 30 + 63)
                        this.side = "l"
                    } else {
                        balloon.position.set(0, -26.74, 49 + 63)
                        this.side = "r"
                    }
                } else {
                    const balloon = this.app.scene.getObjectByName("ballon2_group");
                    if (intersectedObject.name === "arrow1") {
                        balloon.position.set(0, -26.74, 30 + 63)
                        this.side = "l"
                    } else {
                        balloon.position.set(5, -26.74, 49 + 63)
                        this.side = "r"
                    }
                }
            } else if ((intersectedObject.name === "start1" || intersectedObject.name === "start2" || intersectedObject.name === "start3" || intersectedObject.name === "start4" || intersectedObject.name === "start5") && this.menu_number === 3) {
                //Change the menu for the game menu
                this.change_to_menu_4()
                this.menu_number = 4

                //Start the animation loop for the balloon
                this.animate()

                //Start the animation loop for the other ballon
                this.animateAutonomousBalloon()
            }else if ((intersectedObject.name === "pause1" || intersectedObject.name === "pause2" || intersectedObject.name === "pause3" || intersectedObject.name === "pause4" || intersectedObject.name === "pause5" || intersectedObject.name === "pause6" || intersectedObject.name === "pause7" || intersectedObject.name === "pause8" || intersectedObject.name === "pause9" || intersectedObject.name === "pause10" || intersectedObject.name === "pause11" || intersectedObject.name === "pause12" || intersectedObject.name === "pause13" || intersectedObject.name === "pause14" || intersectedObject.name === "pause15") && this.menu_number === 4) {
                if(this.status === "running"){
                    this.status = "paused"
                }else{
                    this.status = "running"
                    this.animate()
                    this.startAutonomousAnimationLoop()
                }
            } else if ((intersectedObject.name === "restart1" || intersectedObject.name === "restart2" || intersectedObject.name === "restart3" || intersectedObject.name === "restart4" || intersectedObject.name === "restart5" || intersectedObject.name === "restart6" || intersectedObject.name === "restart7") && this.menu_number === 5) {
                // Stop if some are running
                if (this.mixer) this.mixer.stopAllAction();
                if (this.balloonMixer) this.balloonMixer.stopAllAction();

                //Change visibilities
                this.changeVisibility(false,["restart1","restart2","restart3","restart4","restart5","restart6","restart7"])
                this.changeVisibility(false,["win1","win2","win3","win4","win5","win6","win7"])
                this.changeVisibility(false,["lose1","lose2","lose3","lose4","lose5","lose6","lose7","lose8"])
                this.changeVisibility(false,["home1","home2","home3","home4"])
                this.changeVisibility(false,["runTimeText"])

                //Remove some elements from the scene
                const outdoor = this.app.scene.getObjectByName("OutdoorDisplay1");
                this.app.scene.remove(outdoor);
                const outdoor2 = this.app.scene.getObjectByName("OutdoorDisplay2");
                this.app.scene.remove(outdoor2);
                const outdoor3 = this.app.scene.getObjectByName("OutdoorDisplay3");
                this.app.scene.remove(outdoor3);
                const projection_ballon = this.app.scene.getObjectByName("projection_ballon");
                this.app.scene.remove(projection_ballon);

                //Function to change the side of the ballon
                if (this.selected_ballon === 1) {
                    const balloon = this.app.scene.getObjectByName("ballon1_group");
                    if (this.side === "l") {
                        balloon.position.set(0, -26.74, 30 + 63)
                    } else {
                        balloon.position.set(0, -26.74, 49 + 63)
                    }
                } else {
                    const balloon = this.app.scene.getObjectByName("ballon2_group");
                    if (this.side === "l") {
                        balloon.position.set(0, -26.74, 30 + 63)
                    } else {
                        balloon.position.set(5, -26.74, 49 + 63)
                    }
                }

                //Reset camera
                this.actual_camera_index = 0
                    
                // resart the variables
                this.vouchers = 1;
                this.level = 0;
                this.out_road = false;
                this.status = "running"
                this.lap_balloon = 0
                this.lap_balloon_autonomous = 0
                this.win = null
                this.run_time = null
                this.startTime = 0
                this.active_fireworks = false
                this.fireworks = []
                this.actual_camera_index = 0
                this.checkPlane1 = false
                this.checkPlane2 = false
                this.checkPlane3 = false
                this.checkPlane1_autonomous = false
                this.changeLevel = false
                this.forEachLevel = null
                        

                //Eliminate the old obstacles and powerups
                this.myObstacle.clearObstacles();
                this.myPowerUp.clearPowerUps();

                //Return to menu 4 but not create the things because they already exist
                this.change_to_menu_4()
                this.menu_number = 4

                //Start the animation loop 
                this.animate()
                this.animateAutonomousBalloon()

            } else if ((intersectedObject.name === "home1" || intersectedObject.name === "home2" || intersectedObject.name === "home3" || intersectedObject.name === "home4") && this.menu_number === 5) {
                // Stop if some are running
                if (this.mixer) this.mixer.stopAllAction();
                if (this.balloonMixer) this.balloonMixer.stopAllAction();

                //Change visibilities
                this.changeVisibility(false,["restart1","restart2","restart3","restart4","restart5","restart6","restart7"])
                this.changeVisibility(false,["win1","win2","win3","win4","win5","win6","win7"])
                this.changeVisibility(false,["lose1","lose2","lose3","lose4","lose5","lose6","lose7","lose8"])
                this.changeVisibility(false,["home1","home2","home3","home4"])
                this.changeVisibility(false,["runTimeText"])
                    
                // resart the variables
                this.vouchers = 1;
                this.level = 0;
                this.out_road = false;
                this.status = "running"
                this.lap_balloon = 0
                this.lap_balloon_autonomous = 0
                this.win = null
                this.run_time = null
                this.startTime = 0
                this.active_fireworks = false
                this.changeLevel = false
                this.forEachLevel = null
                this.fireworks = []
                this.actual_camera_index = 0
                this.checkPlane1 = false
                this.checkPlane2 = false
                this.checkPlane3 = false
                this.checkPlane1_autonomous = false
                this.selected_ballon = null
                this.side = "r"
                this.playerName = []


                //Eliminate the old obstacles and powerups
                this.myObstacle.clearObstacles();
                this.myPowerUp.clearPowerUps();

                //Return to menu 4 but not create the things because they already exist
                this.change_to_menu_1()
                this.menu_number = 1
            }
            
        }
    }

    /**
     * Initializes the contents
     */
    init() {

    }

    /**
    

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    onAfterSceneLoadedAndBeforeRender(data) {

        //.......................Load the globals......................................
        // Configure shadows
        configureShadows(this.app.renderer);

        // COnfigure background color
        configureBackground(this.app.scene, data.options.background);

        // Add ambient light
        addAmbientLight(this.app.scene, data.options.ambient);

        // Add fog
        configureFog(this.app.scene, data.options.fog);

        // Add skybox
        addSkybox(this.app.scene, data.options.skybox);

        //...........................Load textures.....................................
        // Load all textures
        const textures = loadTextures(data);

        //....................Load Materials................
        // Load materials using the textures
        const materials = loadMaterials(data, textures, this.wireframe);

        //.....................Load Cameras.....................
        // Load cameras (the return is the position of the actual camera)

        if (this.loop === true) { //The cameras only are configurate the first time this function is activated
            this.camera_position_before = loadCameras(data, this.app, this.gui);
        }

        //Default material
        this.default_material = new THREE.MeshBasicMaterial({ color: 0xffffff })


        //..................Load Nodes....................
        // To keep all the nodes
        this.nodes_and_children = [];

        for (let key in data.nodes) {
            if (data.nodes[key].type === 'node') {
                const nodeDict = createNodeDict(data, key, materials)

                // Verify the type of children and add for then add to the father
                for (let child of data.nodes[key].children) {
                    if (child.type === 'spotlight') {
                        nodeDict.primitive = createSpotLight(child);
                        nodeDict.primitive_composed = true;

                    } else if (child.type === 'pointlight') {
                        nodeDict.primitive = createPointLight(child)
                        nodeDict.primitive_composed = true; //Flag when objects are composed not only by a primitive (mesh or group)
                    } else if (child.type === 'directionallight') {
                        nodeDict.primitive = createDirectionalLight(child)
                        nodeDict.primitive_composed = true; //Flag when objects are composed not only by a primitive (mesh or group)

                    } else if (child.type === 'primitive') {
                        //Load primitives
                        if (child.subtype === 'rectangle') {
                            nodeDict.primitive = createRectangle(child)
                        } else if (child.subtype === 'letter') {
                            nodeDict.primitive = createLetter(child)
                            nodeDict.primitive_composed = true;
                        } else if (child.subtype === 'nurbs') {
                            nodeDict.primitive = createNurbs(child)
                        } else if (child.subtype === 'cylinder') {
                            nodeDict.primitive = createCylinder(child)
                        } else if (child.subtype === 'sphere') {
                            nodeDict.primitive = createSphere(child)
                        } else if (child.subtype === 'box') {
                            nodeDict.primitive = createBox(child)
                        } else if (child.subtype === 'triangle') {
                            nodeDict.primitive = createTriangle(child)
                        } else if (child.subtype === 'road') {
                            nodeDict.primitive = createRoad(child)
                        } else if (child.subtype === 'polygon') {
                            nodeDict.primitive = createPolygon(child)
                            nodeDict.primitive_composed = true;
                        } else if (child.subtype === 'lathe') {
                            nodeDict.primitive = createLathe(child)
                        }

                        if (child.representations[0].visibility === false) {
                            nodeDict.visibility = false
                        }

                    } else {
                        nodeDict.children.push(child.id);
                    }
                }

                // Adiciona o dicionário à lista principal
                this.nodes_and_children.push(nodeDict);
            }
        }
        //................................................................................

        //For each  children, see if it have or not materials and, if not, put it like the father. If in the father the shadows had been activated, the child need to activate tha shadows too. It also is used to know the position of the loads fo then calculate the distante until the camera
        this.nodes_and_children = likeTheFather(this.nodes_and_children)

        //Traverse the list in reverse to create the groups correctly
        this.nodes_and_children = traverseNodes(this.nodes_and_children, this.app)
    }
    update() {

    }
}

export { MyContents };
