import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js?module';

function createPointerLockControls(object, canvas) {
    const controls = new PointerLockControls(object, canvas);
    
    controls.tick = (delta) => {
        controls.update(delta);
    }
    return controls;
}

export { createPointerLockControls };