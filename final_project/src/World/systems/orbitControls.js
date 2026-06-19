import { OrbitControls } from 'three/addons/controls/OrbitControls.js?module';

function createOrbitControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    controls.tick = () => {
        controls.update();
    }
    return controls;
}

export { createOrbitControls };