import { Object3D, PointLight, DirectionalLight, AmbientLight} from 'three';

function createLights(scene, houseModel) {
    const bulbLight = new PointLight( 0xFFFFF7, 70, 100, 1.7 );

    bulbLight.position.copy( houseModel.getObjectByName("Ceiling_light001").position );
    bulbLight.position.y -= 3;

    const secondBulbLight = bulbLight.clone();
    secondBulbLight.position.copy( houseModel.getObjectByName("Ceiling_light002").position );
    secondBulbLight.position.y -= 3;

    const thirdBulbLight = bulbLight.clone();
    thirdBulbLight.position.copy( houseModel.getObjectByName("Lamp_B").position );
    thirdBulbLight.position.y -= 1;

    
    scene.add( bulbLight, secondBulbLight, thirdBulbLight );


    const ambientLight = new AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(250,300,1000);
    const lightTarget = new Object3D();
    lightTarget.position.set(0,0,0);
    directionalLight.target = lightTarget;
    scene.add(directionalLight)

}

export { createLights };