import { MyApp } from './MyApp.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyContents } from './MyContents.js';

//..................Create MyApp........................
// create the application object
let app = new MyApp()
// initializes the application
app.init()

//.................Create MyGUI.........................
// create the gui interface object
let gui = new MyGuiInterface(app)

// we call the gui interface init 
// after contents were created because
// interface elements may control contents items
gui.init();

//..................Create MyContents....................
// create the contents object
let contents = new MyContents(app,gui)
// initializes the contents
contents.init()

// hooks the contents object in the application object
app.setContents(contents);


//....................Render the scene....................
// main animation loop - calls every 50-60 ms.
app.render()
