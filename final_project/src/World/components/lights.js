import { DirectionalLight, HemisphereLight, AmbientLight} from 'https://esm.sh/three@0.184.0';

function createLights() {
    // Create a directional light
    const directLight = new DirectionalLight('white', 1);
    directLight.position.set(100,100,100)
    /* const ambientLight = new HemisphereLight(
    'white', // bright sky color
    'darkslategrey', // dim ground color
    7, // intensity
    ); */

    const ambientLight = new AmbientLight(0x404040);
    //directLight.position.set(0,0,-2);
    return {directLight, ambientLight};
}

export { createLights };