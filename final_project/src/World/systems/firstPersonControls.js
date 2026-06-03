import { FirstPersonControls } from 'https://esm.sh/three@0.184.0/examples/jsm/controls/FirstPersonControls.js?module';

function createFirstPersonControls(object, canvas) {
    const controls = new FirstPersonControls(object, canvas);
    controls.movementSpeed = 10;
    controls.tick = (delta) => {
        controls.update(delta);
    }
    return controls;
}

export { createFirstPersonControls };