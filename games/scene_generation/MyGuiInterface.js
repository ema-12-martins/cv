import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui = new GUI();

        //Variables to change the cameras
        this.list_of_cameras = []
        this.list_of_lights = []
        this.indesxs_list_of_lights = []
        this.current_camera = ""
        this.wireframe = false
        this.axis = false
    }

    //Clean all the lights
    clean_Lights(){
        this.list_of_lights=[]
        this.updateGui(); //Update the interface
    }

    //To know it is true or not
    setIndexsList_of_lights(index){
        this.indesxs_list_of_lights.push(index)
    }

    // Getter for list_of_cameras
    getList_of_cameras() {
        return this.list_of_cameras;
    }

    // Setter for list_of_cameras
    addList_of_cameras(camera) {
        if (typeof camera === "string") { // Verifica se é um array
            this.list_of_cameras.push(camera);
            this.updateGui(); //Update the interface
        } else {
            throw new Error("list_of_cameras needs to be a string.");
        }
    }

    // Setter for list_of_lights
    addList_of_lights(light) {
        this.list_of_lights.push(light);
        this.updateGui(); //Update the interface
    }

    // Getter for current_camera
    getCurrent_camera() {
        return this.current_camera;
    }

    // Setter for current_camera
    setCurrent_camera(camera) {
        if (typeof camera === "string") { // Verify if is a string
            this.current_camera = camera;
            this.updateGui(); //Update the interface
        } else {
            throw new Error("current_camera needs to be a string.");
        }
    }

    //To update when it receive data
    updateGui() {
        // Destroy the gui
        this.datgui.destroy();

        // New gui updated
        this.datgui = new GUI();
        this.init();
    }

    // Getter state of wireframe
    getWireframe() {
        return this.wireframe;
    }

    // Getter state of wireframe
    getAxis() {
        return this.axis;
    }

    /**
     * Initialize the gui interface
     */
    init() {
        //.......................For cameras.............................
        const dropdownOptions = this.list_of_cameras.length > 0 ? this.list_of_cameras : []; //Define the options = cameras
        const selectedOption = { current: this.current_camera || "loading" }; // Define the selected option

        // Add dropdown to dat.GUI with the options of the cameras
        this.datgui.add(selectedOption, 'current', dropdownOptions)
            .name('Choose Camera')
            .onChange(value => {
                this.app.setActiveCamera(value); // Change the active camera at App
            });

        //.......................For wireframe...............................
        // Add a checkbox to enable the wireframe to dat.GUI
        const wireframeOption = { enableWireframe: this.wireframe }; //Actual state of wireframe

        // Adiciona o botão de Wireframe
        this.datgui.add(wireframeOption, 'enableWireframe')
            .name('Wireframe')
            .onChange(value => {
                this.wireframe = value; // Change the value of the wireframe
            });

        //.........................Add axis...........................
        // Add a checkbox to enable taxis to dat.GUI
        const axisOption = { enableAxis: this.axis }; //Actual state axis

        // Adiciona o botão de Axes
        this.datgui.add(axisOption, 'enableAxis')
            .name('Axis')
            .onChange(value => {
                this.axis = value; // Change the value of taxis
            });

        //.................Try to modify the visibility of the lighs............

        // Para cada luz, cria um controle individual na GUI
        this.list_of_lights.forEach((light, index) => {
            light.visible = this.indesxs_list_of_lights[index]
            const lightOption = { visible: this.indesxs_list_of_lights[index] }; // Estado inicial da luz
            this.datgui.add(lightOption, 'visible')
                .name(`Light ${index + 1}`) // Nome do controle na GUI
                .onChange(value => {
                    light.visible = value; // Altera a visibilidade da luz
                    this.indesxs_list_of_lights[index] = value //In case of update, know the last update
                });
        });
    }
}

export { MyGuiInterface };