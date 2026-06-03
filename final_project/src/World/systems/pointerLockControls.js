import { PointerLockControls } from 'https://esm.sh/three@0.184.0/examples/jsm/controls/PointerLockControls.js?module';

function createPointerLockControls(object, canvas) {
    const controls = new PointerLockControls(object, canvas);
    
    controls.tick = (delta) => {
        controls.update(delta);
    }
    return controls;
}

export { createPointerLockControls };