import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js?module';

function createFirstPersonControls(object, canvas) {
    const controls = new FirstPersonControls(object, canvas);
    controls.movementSpeed = 10;
    controls.tick = (delta) => {
        controls.update(delta);
    }
    return controls;
}

export { createFirstPersonControls };