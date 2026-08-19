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
        translate: new THREE.Vector3(0,0,0),
        rotate: new THREE.Vector3(0,0,0),
        scale: new THREE.Vector3(0,0,0),
        primitive_composed: false, //Flag when objects are composed not only by a primitive (mesh or group)
        castShadow : false,
        receiveShadow : false
    };

    //If the node have shadows
    if (data.nodes[key].castshadows){
        nodeDict.castShadow = true
    }
    if (data.nodes[key].receiveshadows){
        nodeDict.receiveShadow = true
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
                    nodeDict.translate.x += transformation.translate[0]
                    nodeDict.translate.y += transformation.translate[1]
                    nodeDict.translate.z += transformation.translate[2]

                    nodeDict.all_translates.x += transformation.translate[0]
                    nodeDict.all_translates.y += transformation.translate[1]
                    nodeDict.all_translates.z += transformation.translate[2]

                }else if (transformation.type ==="R"){
                    nodeDict.rotate.x += transformation.rotation[0] * (Math.PI / 180)

                    nodeDict.rotate.y += transformation.rotation[1] * (Math.PI / 180)

                    nodeDict.rotate.z += transformation.rotation[2] * (Math.PI / 180)
                }else if (transformation.type ==="S"){
                    nodeDict.scale.x += transformation.scale[0]

                    nodeDict.scale.y += transformation.scale[1]

                    nodeDict.scale.z += transformation.scale[2]
                }
                
            }
        }
    } catch (error) {
        console.error("Nao tem escalas", error);
    }
    return nodeDict
}

export function createLodDict(data,key) {
    const nodeDict = {
        id: data.nodes[key].id,
        type: "lod",
        children: [],
        group: new THREE.Group(),
        material: default_material,
        all_translates: new THREE.Vector3(0,0,0),
        translate: new THREE.Vector3(0,0,0),
        rotate: new THREE.Vector3(0,0,0),
        scale: new THREE.Vector3(0,0,0),
        primitive_composed: false, //Flag when objects are composed not only by a primitive (mesh or group)
        castShadow : false,
        receiveShadow : false
    };
    //Only add the node. In the final, we decide with node draw, based on the distance
    nodeDict.lodNodes = data.nodes[key].lodNodes

    //All the alternatives will be consider children and then, with the place, we will chose 1 to mantain.
    for (let key in nodeDict.lodNodes){
        nodeDict.children.push(nodeDict.lodNodes[key]["id"])
    }

    //Order the possibilities, to compare pairs to know the intervals
    nodeDict.lodNodes.sort((a, b) => a.mindist - b.mindist);

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
                    }
                }      
            }
        }
    }
    return nodes_and_children
}

export function traverseNodes(nodes_and_children,current_camera_position) {
    for (let node of nodes_and_children.slice().reverse()) {
        if (node["primitive"] !== null){
            if(!node["primitive_composed"]){
                const mesh = new THREE.Mesh(node["primitive"], node["material"]);
                if(node["castShadow"]){
                    mesh.castShadow = true
                }
                if(node["receiveShadow"]){
                    mesh.receiveShadow = true
                }
                node["group"].add(mesh)
            }else{
                node["group"].add(node["primitive"])
            }
        }
        if (node["type"]!=="lod" && node["children"].length !== 0){
            for (let child_node of node["children"]){
                for (let node_2x of nodes_and_children){
                    if (node_2x["id"] === child_node){
                        node["group"].add(node_2x["group"].clone())
                    }
                }
            }
        }else if (node["type"]==="lod" ){ //If is a load, we need to check the distance and chose the right one
            // Calculate the distance to know which node need to be selected

            const point1 = current_camera_position
            const point2 = node["all_translates"]

            // Calculando a distância
            const distance = Math.sqrt(
                Math.pow(point2.x - point1.x, 2) +
                Math.pow(point2.y - point1.y, 2) +
                Math.pow(point2.z - point1.z, 2)
            );

            //Select the nood between the limits. If the distance is big, use the last element because is what have the bigger min distance
            let index_of_selected_node = node["lodNodes"].length-1
            for (let i = 1; i < node["lodNodes"].length; i++) {
                if (distance > node["lodNodes"][i-1].mindist && distance <= node["lodNodes"][i].mindist){
                    index_of_selected_node = i-1
                    break
                }
            }

            //Select the node that are in the distance
            let id_of_the_selected = node["lodNodes"][index_of_selected_node].id

            for (let node_2x of nodes_and_children){
                if (node_2x["id"] === id_of_the_selected){
                    node["group"].add(node_2x["group"].clone())
                }
            }
        }
        if (node.translate.x !== 0 || node.translate.y !== 0 || node.translate.z !== 0){
            node.group.position.set(...node.translate)
        }
        if (node.rotate.x !== 0 || node.rotate.y !== 0 || node.rotate.z !== 0){
            node.group.rotation.set(...node.rotate)
        }
        if (node.scale.x !== 0 || node.scale.y !== 0 || node.scale.z !== 0){
            node.group.scale.set(...node.scale)
        }
    }
    return nodes_and_children
}