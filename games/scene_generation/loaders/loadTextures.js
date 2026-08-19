import * as THREE from 'three';

// Create a texture loader for image textures
const textureLoader = new THREE.TextureLoader();

// options for textures and dat.gui
const options = {
    minFilters: {
        'NearestFilter': THREE.NearestFilter,
        'NearestMipMapLinearFilter': THREE.NearestMipMapLinearFilter,
        'NearestMipMapNearestFilter': THREE.NearestMipMapNearestFilter,
        'LinearFilter ': THREE.LinearFilter,
        'LinearMipMapLinearFilter (Default)': THREE.LinearMipMapLinearFilter,
        'LinearMipmapNearestFilter': THREE.LinearMipmapNearestFilter,
    },
    magFilters: {
        'NearestFilter': THREE.NearestFilter,
        'LinearFilter (Default)': THREE.LinearFilter,
    },
}      

export function loadMipmap(parentTexture, level, path){
    // load texture. On loaded call the function to create the mipmap for the specified level 
    new THREE.TextureLoader().load(path, 
        function(mipmapTexture)  // onLoad callback
        {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            ctx.scale(1, 1);
            
            // const fontSize = 48
            const img = mipmapTexture.image    
            canvas.width = img.width;
            canvas.height = img.height

            // first draw the image
            ctx.drawImage(img, 0, 0 )
                            
            // set the mipmap image in the parent texture in the appropriate level
            parentTexture.mipmaps[level] = canvas
        },
        undefined, // onProgress callback currently not supported
        function(err) {
            console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
        }
    )
}


//Function to load the textures
export function loadTextures(data) {

    // Object to store the loaded textures
    const textures = {};

    // Iterate over all texture entries in the data object
    for (const key in data.textures) {

        //Get the object
        const textureInfo = data.textures[key];

        if (textureInfo.isVideo) {
            // Create a video element for video textures
            const video = document.createElement('video');
            video.src = textureInfo.filepath;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;

            // Create a VideoTexture from the video element
            const videoTexture = new THREE.VideoTexture(video);

            // Set mipmap and filtering options for the video texture
            videoTexture.generateMipmaps = true
            videoTexture.minFilter = THREE.LinearMipmapLinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.needsUpdate = true

            // Add the video texture to the textures object
            textures[textureInfo.id] = videoTexture;

            // Play the video
            video.play();
        } else {
            // Load the texture using the TextureLoader
            let texture = textureLoader.load(textureInfo.filepath);

            if (textureInfo.mipmap0==""){
                // Set mipmap and filtering options for the image texture
                texture.generateMipmaps = true
                texture.minFilter = options.minFilters
                texture.magFilter = options.magFilters
                texture.needsUpdate = true
            }else{
                // texture mipmaps will be manually defined
                texture.generateMipmaps = false
            
                loadMipmap(texture, 0, textureInfo.mipmap0) 
                if (textureInfo.mipmap1!=""){
                    loadMipmap(texture, 1, textureInfo.mipmap1)

                    if (textureInfo.mipmap2!=""){
                        loadMipmap(texture, 2, textureInfo.mipmap2)

                        if (textureInfo.mipmap3!=""){
                            loadMipmap(texture, 3, textureInfo.mipmap3)

                            if (textureInfo.mipmap4!=""){
                                loadMipmap(texture, 4, textureInfo.mipmap4)

                                if (textureInfo.mipmap5!=""){
                                    loadMipmap(texture, 5, textureInfo.mipmap5)

                                    if (textureInfo.mipmap6!=""){
                                        loadMipmap(texture, 6, textureInfo.mipmap6)
                                    }
                                }
                            }
                        }
                    }
                }
                texture.needsUpdate = true
            }

            // Add the image texture to the textures object
            textures[textureInfo.id] = texture;
            console.log("textures")
            console.log(textures)
        }
    }

    // Return the dictionary of loaded textures
    return textures;
}
