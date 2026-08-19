import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
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

import { createNodeDict,createLodDict, likeTheFather,traverseNodes } from './loaders/loadNodes.js';

import { createBox,createCylinder,createNurbs,createPointLight,createPolygon,createRectangle,createSpotLight,createTriangle,createSphere,createDirectionalLight } from './loaders/loadPrimitives.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app,gui) {
        this.app = app;
        this.gui = gui;
        this.axis = false;

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/SGI_TP2_JSON_T07_G03_v02.json");	

        //Flag to controll sleep time, no not make animate all time
        this.canAnimate = true;
        
        //To know if the position changed, we have the position of the camera
        this.camera_position_before = new THREE.Vector3 (0,0,0)

        //To know if is to have the objects in wireframe or not
        this.wireframe = false

        //To know if is to have the objects in axis or not
        this.axis = false

        //If it is the first time, needs to enter de loop
        this.loop = true

    }

    remove_all_from_scene() {
        // Remove all objects from the scene
        while (this.app.scene.children.length > 0) {
            const object = this.app.scene.children[0];
            this.app.scene.remove(object);
    
            //Remove all materials
            if (object.geometry) object.geometry.dispose();

            //Remove the materials
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            
            // Remove all textures
            if (object.material && object.material.map && object.material.map instanceof THREE.Texture) {
                object.material.map.dispose();
            }
        }

        this.onAfterSceneLoadedAndBeforeRender(this.reader.data)
    }

    //Camera that sees if the wareframe changed or the lods, to update the scene
    animate() {
        if (!this.canAnimate) return;
    
        //Get the current camera position
        const posicao_atual_camara = this.app.getActiveCamera().position;
        
        // Verify is the position of the camera changed
        if ((this.camera_position_before.x !== posicao_atual_camara.x && this.camera_position_before.y !== posicao_atual_camara.y && this.camera_position_before.z !== posicao_atual_camara.z) || this.gui.getWireframe()!==this.wireframe || this.gui.getAxis()!==this.axis) {
            //Update wireframe and axis
            this.wireframe=this.gui.getWireframe()
            this.axis = this.gui.getAxis()

            //Update the actual camera
            this.camera_position_before = new THREE.Vector3(...posicao_atual_camara)

            // Remove all the objects of the scene to be possible to understand if change something with the position, bases on the lods distance
            this.remove_all_from_scene()

        }
    
    
        //Execute this function once per second
        setTimeout(() => {
            this.animate()
        }, 2000);
    }


    /**
     * initializes the contents
     */
    init() {
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        //Load axis if true
        if (this.axis === true){
            // create and attach the axis to the scene
            this.axis_obj = new MyAxis(this)
            this.axis_obj.scale.set(10,10,10)
            this.app.scene.add(this.axis_obj)
            
        }
        
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
        const materials = loadMaterials(data, textures,this.wireframe);
    
        //.....................Load Cameras.....................
        // Load cameras (the return is the position of the actual camera)

        if (this.loop===true){ //The cameras only are configurate the first time this function is activated
            this.camera_position_before = loadCameras(data, this.app, this.gui);
        }
        


    // Para os nós
    this.nodes_and_children = [];
    this.default_material = new THREE.MeshBasicMaterial({ color: 0xffffff })


    //..................Load Nodes....................
    // To keep all the nodes
    this.nodes_and_children = [];

    for (let key in data.nodes) {
        if (data.nodes[key].type === 'lod') {
            this.nodes_and_children.push(createLodDict(data,key))
            
        } else if (data.nodes[key].type === 'node') {
            const nodeDict = createNodeDict(data,key,materials)

            // Verify the type of children and add for then add to the father
            for (let child of data.nodes[key].children){
                if (child.type === 'spotlight') {
                    nodeDict.primitive = createSpotLight(child);
                    nodeDict.primitive_composed = true;

                }else if (child.type === 'pointlight') {
                    nodeDict.primitive = createPointLight(child)
                    nodeDict.primitive_composed = true; //Flag when objects are composed not only by a primitive (mesh or group)
                }else if (child.type === 'directionallight') {
                    nodeDict.primitive = createDirectionalLight(child)
                    nodeDict.primitive_composed = true; //Flag when objects are composed not only by a primitive (mesh or group)
                    
                }else if (child.type === 'primitive') { 
                    //Load primitives
                    if (child.subtype ==='rectangle'){
                        nodeDict.primitive = createRectangle(child)
                    }else if (child.subtype === 'nurbs'){
                        nodeDict.primitive = createNurbs(child)
                    } else if (child.subtype === 'cylinder') {
                        nodeDict.primitive = createCylinder(child)
                    } else if (child.subtype === 'sphere') {
                        nodeDict.primitive = createSphere(child)
                        
                    } else if (child.subtype === 'box') {
                        nodeDict.primitive = createBox(child)
                          
                    } else if (child.subtype === 'triangle') {
                        nodeDict.primitive = createTriangle(child)
                        
                    } else if (child.subtype === 'polygon') {
                        nodeDict.primitive = createPolygon(child)
                        nodeDict.primitive_composed = true;
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
    this.nodes_and_children = traverseNodes(this.nodes_and_children, this.app.getActiveCamera().position)
      
    //Now, we only need to add to the scene the first object because it is the route, so it will have all the elements inside their group
    this.app.scene.add(this.nodes_and_children[0]["group"])

    //.................Pass all the lights for the interface to change them.............
    //Clean the old cameras
    this.gui.clean_Lights()

    if (this.loop===true){
        this.app.scene.traverse((object) => {
            if (object.isLight) {
                this.gui.setIndexsList_of_lights(object.visible); //Add to the list
            }
        });
    }

    // Tranverse all objects to get the lights
    this.app.scene.traverse((object) => {
        if (object.isLight) {
            this.gui.addList_of_lights(object); //Add to the list
        }
    });

    if (this.loop===true){
        this.animate()
        this.loop=false //To not enter and enter ...
    }
    
    }
    update() {
        
    }
}

export { MyContents };
