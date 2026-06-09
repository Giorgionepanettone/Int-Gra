import * as CANNON from 'https://unpkg.com/cannon-es@0.20.0/dist/cannon-es.js';
import { Octree } from 'https://esm.sh/three@0.184.0/examples/jsm/math/Octree.js';

class Collision {
    constructor(scene){
        this.octree = new Octree().fromGraphScene(scene);
    }

}

