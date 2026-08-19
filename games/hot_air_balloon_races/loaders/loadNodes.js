import * as THREE from 'three';

// Declaração global do material default
const default_material = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Function to create a base node dictionary
export function createNodeDict(data,key, materials) {

    // Creating the dict for the new node
    const nodeDict = {
        id: data.nodes[key].id,
        type: "node",
        children: [],
        primitive: null,
        group: new THREE.Group(),
        material: default_material,
        all_translates: new THREE.Vector3(0,0,0),
        all_rotates: new THREE.Vector3(0,0,0),
        all_scales: new THREE.Vector3(1,1,1),
        primitive_composed: false, //Flag when objects are composed not only by a primitive (mesh or group)
        castShadow : false,
        receiveShadow : false,
        visibility: true //To know when can we share show the objects
    };

    //If the node have shadows
    if (data.nodes[key].castshadows){
        nodeDict.castShadow = true
    }
    if (data.nodes[key].receiveshadows){
        nodeDict.receiveShadow = true
    }

    //To know the visibility
    if (data.nodes[key].visibility === false){
        nodeDict.visibility = false
    }

    //Try to pick the material
    try {
        if (data.nodes[key].materialIds[0]) {
            nodeDict.material = materials[data.nodes[key].materialIds[0]];
        }
    } catch (error) {
        console.error("Nao tem materiais", error);
    }

    //try to pick the transformations
    try {
        if (data.nodes[key].transformations[0]){
            for (let transformation of data.nodes[key].transformations){
                if (transformation.type ==="T"){
                    nodeDict.all_translates.x += transformation.translate[0]
                    nodeDict.all_translates.y += transformation.translate[1]
                    nodeDict.all_translates.z += transformation.translate[2]

                }else if (transformation.type ==="R"){
                    nodeDict.all_rotates.x += transformation.rotation[0] * (Math.PI / 180)
                    nodeDict.all_rotates.y += transformation.rotation[1] * (Math.PI / 180)
                    nodeDict.all_rotates.z += transformation.rotation[2] * (Math.PI / 180)

                }else if (transformation.type ==="S"){
                    nodeDict.all_scales.x *= transformation.scale[0]
                    nodeDict.all_scales.y *= transformation.scale[1]
                    nodeDict.all_scales.z *= transformation.scale[2]
                }
                
            }
        }
    } catch (error) {
        console.error("Nao tem escalas", error);
    }
    return nodeDict
}


//Function fot the the hierarchy 
export function likeTheFather(nodes_and_children) {

    for (let node of nodes_and_children){
        if (node["children"].length !== 0){
            for (let child_node of node["children"]){
                for (let node_2x of nodes_and_children){
                    if (node_2x["id"] === child_node){
                        if (node_2x["material"] === default_material){
                            node_2x["material"] = node["material"].clone()
                        }
                        if(node.receiveShadow){
                            node_2x.receiveShadow = true
                        }  
                        if(node.castShadow){
                            node_2x.castShadow = true
                        }

                        //For the lods, to know the position
                        node_2x["all_translates"].x += node["all_translates"].x
                        node_2x["all_translates"].y += node["all_translates"].y
                        node_2x["all_translates"].z += node["all_translates"].z

                        //For the lods, to know the position
                        node_2x["all_rotates"].x += node["all_rotates"].x
                        node_2x["all_rotates"].y += node["all_rotates"].y
                        node_2x["all_rotates"].z += node["all_rotates"].z

                        //For the lods, to know the position
                        node_2x["all_scales"].x *= node["all_scales"].x
                        node_2x["all_scales"].y *= node["all_scales"].y
                        node_2x["all_scales"].z *= node["all_scales"].z
                    }
                }      
            }
        }
    }
    console.log(nodes_and_children)
    return nodes_and_children
}

export function traverseNodes(nodes_and_children, app) {
    //See the type of node to see if is primitive
    for (let node of nodes_and_children.slice().reverse()) {
        if (node["primitive"] !== null){
            let mesh = undefined

            //See if the primitive have already material
            if(!node["primitive_composed"]){
                mesh = new THREE.Mesh(node["primitive"], node["material"]);
            }else{
                mesh = node["primitive"]
            }

            //To pass the shadows information from the dad
            if(node["castShadow"]){
                mesh.castShadow = true
            }
            if(node["receiveShadow"]){
                mesh.receiveShadow = true
            }

            //Add the sum of the geometric trnasformations
            mesh.position.set(...node.all_translates); 
            mesh.rotation.set(...node.all_rotates);  
            mesh.scale.set(...node.all_scales);  
            mesh.name = node["id"]
            app.scene.add(mesh); 

            //To know if we show the object or not
            mesh.visible = node["visibility"];
        }
    }
    return nodes_and_children
}