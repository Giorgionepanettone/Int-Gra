import { BoxGeometry, Mesh, MeshStandardMaterial, MathUtils, TextureLoader } from 'three';

function createMaterial(){
  const textureLoader = new TextureLoader();

  const texture = textureLoader.load(
    './assets/textures/uv_grid_opengl.jpg',
  );

  const material = new MeshStandardMaterial({map : texture});
  //material.normalMap = texture;
  return material
}

function createCube() {
  // create a geometry
  const geometry = new BoxGeometry(2, 2, 2);

  // create a default (white) Basic material
  const material = createMaterial();
  // create a Mesh containing the geometry and material
  const cube = new Mesh(geometry, material);
  //cube.rotation.set(-0.5, -0.1, 0.8);


  const radius = 0.2;
  var t = 0.0;
  const radiansPerSecond = MathUtils.degToRad(15);
  var metersPerSecond = 5;
  cube.tick = (delta) => {
    t += delta;
    //console.log(Math.floor((Math.round(t) / 2)))
    cube.position.x = radius * Math.cos(t) ;
    cube.position.y = radius * Math.sin(t) ;
    if(Math.floor((Math.round(t) / 3)) & 1){
      //cube.position.z += metersPerSecond * delta;
    }
    else{
      //cube.position.z -= metersPerSecond * delta;
    }
    
    //cube.rotation.x += radiansPerSecond * delta * 0.1;
    cube.rotation.y += radiansPerSecond * delta;
    //cube.rotation.z += radiansPerSecond * delta;
  };

  return cube;
}

export { createCube };