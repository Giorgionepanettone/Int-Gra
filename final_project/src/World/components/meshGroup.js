import {
  SphereGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
} from 'https://esm.sh/three@0.184.0';

function createMeshGroup() {
    const group = new Group();
    
    const radiansPerSecond = MathUtils.degToRad(30); 
    group.tick = (delta) =>{
        group.rotation.z += radiansPerSecond * delta;
        //group.rotation.y += radiansPerSecond * delta;

    };

    const geometry = new SphereGeometry(0.25, 9, 9);
    const material = new MeshStandardMaterial({
        color : "green",
        flatShading : true,
    });
    const protoSphere = new Mesh(geometry, material);
    group.add(protoSphere);

    for(let i = 0; i < 1; i+=0.001){
        const sphere = protoSphere.clone();
        
        sphere.position.x = Math.cos(2 * Math.PI * i);
        sphere.position.y = Math.sin(2 * Math.PI * i);
        sphere.position.z = -i*5
        sphere.scale.multiplyScalar(i);
        group.add(sphere);
    }
    return group;
}

export { createMeshGroup };