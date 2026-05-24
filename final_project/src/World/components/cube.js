import { BoxGeometry, Mesh, MeshStandardMaterial, MathUtils } from 'https://esm.sh/three@0.184.0';


function createCube() {
  // create a geometry
  const geometry = new BoxGeometry(2, 2, 2);

  // create a default (white) Basic material
  const material = new MeshStandardMaterial({ color: "green" });
  // create a Mesh containing the geometry and material
  const cube = new Mesh(geometry, material);
  //cube.rotation.set(-0.5, -0.1, 0.8);


  const radius = 1.5;
  var t = 0.0;
  const radiansPerSecond = MathUtils.degToRad(300);
  var metersPerSecond = 16;
  cube.tick = (delta) => {
    t += delta;
    console.log(Math.floor((Math.round(t) / 2)))
    cube.position.x = radius * Math.cos(4*t) ;
    cube.position.y = radius * Math.sin(4*t) ;
    if(Math.floor((Math.round(t) / 3)) & 1){
      cube.position.z += metersPerSecond * delta;
    }
    else{
      cube.position.z -= metersPerSecond * delta;
    }
    
    //cube.rotation.x += radiansPerSecond * delta;
    //cube.rotation.y += radiansPerSecond * delta;
    //cube.rotation.z += radiansPerSecond * delta;
  };

  return cube;
}

export { createCube };