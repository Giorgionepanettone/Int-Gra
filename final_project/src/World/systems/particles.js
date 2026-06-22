import { DynamicDrawUsage, Float32BufferAttribute, BufferGeometry, AdditiveBlending, Points, ShaderMaterial } from 'three'

const vs = `
varying vec4 vColor;
varying mat2 rotMatrix;

uniform float point_multiplier;

attribute float life_expectancy;

attribute vec3 initial_position;
attribute float initial_rotation;
attribute vec3 initial_velocity;
attribute float initial_size;

attribute float rotational_velocity;
attribute float size_velocity;
attribute vec3 acceleration;

attribute float elapsed_time;

vec4 white = vec4(1,1,1,1);

vec4 red = vec4(1,0,0,1);

vec4 black = vec4(0,0,0,1);

void main() {

    float age = elapsed_time / life_expectancy;

    vec3 current_position = initial_position + initial_velocity * elapsed_time + 0.5 * acceleration * elapsed_time * elapsed_time;
    float current_rotation = initial_rotation + rotational_velocity * elapsed_time;

    vec4 model_view_position = modelViewMatrix * vec4(current_position, 1.0);

    gl_Position = projectionMatrix * model_view_position;

    float current_size = initial_size + initial_size * size_velocity * elapsed_time;
    gl_PointSize = current_size * point_multiplier / gl_Position.w;

    float c = cos(current_rotation);
    float s = sin(current_rotation);
    rotMatrix = mat2(c, s, -s, c);

    vColor = mix(white ,red, age);
}`;

const fs = `
uniform sampler2D custom_texture;

varying vec4 vColor;
varying mat2 rotMatrix;

void main() {
    
    vec2 coords = (gl_PointCoord - 0.5) * rotMatrix + 0.5;
    gl_FragColor.rgb *= 2.0;
    gl_FragColor = texture2D(custom_texture, coords) * vColor;
}
`;

class Particles {
    constructor(texture, maxParticles, spawnRate, getAttributes){
        this.maxParticles = maxParticles;
        this.spawnRate = spawnRate;
        this.texture = texture;
        this.getAttributes = getAttributes;

        this.aliveCount = 0;
        this.particlesToSpawnCounter = 0;
        const viewHeight = window.innerHeight * window.devicePixelRatio;
        this.uniforms = {
            custom_texture: {
                value: texture
            },
            point_multiplier:{
                value : (viewHeight) / (2.0 * Math.tan(0.4363325 ))
            }
        };

        this.shaderMaterial = new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vs,
            fragmentShader: fs,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            blending: AdditiveBlending
        });

        this.geometry = new BufferGeometry();

        const lifeExpectancy = [];
        const initialPosition = [];
        const initialRotation = [];
        const initialVelocity = [];
        const initialSize = [];
        const rotationalVelocity = [];
        const sizeVelocity = [];
        const acceleration = [];
        const elapsedTime = [];

        for(let i = 0; i < this.maxParticles; i++){
            lifeExpectancy.push(0);

            initialPosition.push(0);
            initialPosition.push(0);
            initialPosition.push(0);
            
            initialRotation.push(0);
            
            initialVelocity.push(0);
            initialVelocity.push(0);
            initialVelocity.push(0);

            initialSize.push(0);
            
            rotationalVelocity.push(0);
            
            sizeVelocity.push(0);
            
            acceleration.push(0);
            acceleration.push(0);
            acceleration.push(0);

            elapsedTime.push(0);
        }


        this.geometry.setAttribute('life_expectancy', new Float32BufferAttribute(lifeExpectancy, 1).setUsage(DynamicDrawUsage));
        this.geometry.setAttribute('initial_position', new Float32BufferAttribute(initialPosition, 3).setUsage(DynamicDrawUsage));
        this.geometry.setAttribute('initial_rotation', new Float32BufferAttribute(initialRotation, 1).setUsage(DynamicDrawUsage));
        this.geometry.setAttribute('initial_velocity', new Float32BufferAttribute(initialVelocity, 3).setUsage(DynamicDrawUsage));
        this.geometry.setAttribute('initial_size', new Float32BufferAttribute(initialSize, 1).setUsage(DynamicDrawUsage));
        this.geometry.setAttribute('rotational_velocity', new Float32BufferAttribute(rotationalVelocity, 1).setUsage(DynamicDrawUsage));
        this.geometry.setAttribute('size_velocity', new Float32BufferAttribute(sizeVelocity, 1).setUsage(DynamicDrawUsage));
        this.geometry.setAttribute('acceleration', new Float32BufferAttribute(acceleration, 3).setUsage(DynamicDrawUsage));
        this.geometry.setAttribute('elapsed_time', new Float32BufferAttribute(elapsedTime, 1).setUsage(DynamicDrawUsage));

        this.geometry.setDrawRange(0, this.aliveCount);
        
        this.points = new Points( this.geometry, this.shaderMaterial);
        this.points.frustumCulled = false;

        //scene.add(points);
    }


    overwriteDeadParticles(delta){
        const elapsedTimeAttribute = this.geometry.getAttribute("elapsed_time");
        const lifeExpectancyAttribute = this.geometry.getAttribute("life_expectancy");

        let i = 0;
        while(i < this.aliveCount){
            elapsedTimeAttribute.array[i] += delta;
            if(elapsedTimeAttribute.array[i] > lifeExpectancyAttribute.array[i]){
                this.overwriteParticle(i, this.aliveCount - 1);
                this.aliveCount--;
            }

            else{
                i++;
            }
        }
    }

    overwriteParticle(deadIndex, lastAliveIndex){
        for(const [name, attribute] of Object.entries(this.geometry.attributes)){
            const itemSize = attribute.itemSize;
            for(let i = 0; i < itemSize; i++){
                attribute.array[deadIndex * itemSize + i] = attribute.array[lastAliveIndex * attribute.itemSize + i];
            }
        }
    }

    addParticles(delta){ //this is REALLY ugly right now
        this.particlesToSpawnCounter += delta * this.spawnRate;
        const numberOfParticlesToAdd = Math.floor(this.particlesToSpawnCounter);
        this.particlesToSpawnCounter -= numberOfParticlesToAdd;

        const lastAliveIndex = this.aliveCount;
        for(let i = lastAliveIndex; i < numberOfParticlesToAdd + lastAliveIndex; i++){

            if(this.aliveCount == this.maxParticles) break;

            const {
                life,
                initPos,
                initRot,
                initVel,
                initSize,
                rotVel,
                sizeVel,
                acc
            } = this.getAttributes();
            this.geometry.attributes.life_expectancy.array[i*this.geometry.attributes.life_expectancy.itemSize] = life;

            this.geometry.attributes.initial_position.array[i*this.geometry.attributes.initial_position.itemSize] = initPos.x;
            this.geometry.attributes.initial_position.array[i*this.geometry.attributes.initial_position.itemSize+1] = initPos.y;
            this.geometry.attributes.initial_position.array[i*this.geometry.attributes.initial_position.itemSize+2] = initPos.z;   

            this.geometry.attributes.initial_rotation.array[i*this.geometry.attributes.initial_rotation.itemSize] = initRot;
            
            this.geometry.attributes.initial_velocity.array[i*this.geometry.attributes.initial_velocity.itemSize] = initVel.x;
            this.geometry.attributes.initial_velocity.array[i*this.geometry.attributes.initial_velocity.itemSize+1] = initVel.y;
            this.geometry.attributes.initial_velocity.array[i*this.geometry.attributes.initial_velocity.itemSize+2] = initVel.z;

            this.geometry.attributes.initial_size.array[i*this.geometry.attributes.initial_size.itemSize] = initSize;
            
            this.geometry.attributes.rotational_velocity.array[i*this.geometry.attributes.rotational_velocity.itemSize] = rotVel;
            
            this.geometry.attributes.size_velocity.array[i*this.geometry.attributes.size_velocity.itemSize] = sizeVel;
            
            this.geometry.attributes.acceleration.array[i*this.geometry.attributes.acceleration.itemSize] = acc.x;
            this.geometry.attributes.acceleration.array[i*this.geometry.attributes.acceleration.itemSize+1] = acc.y;
            this.geometry.attributes.acceleration.array[i*this.geometry.attributes.acceleration.itemSize+2] = acc.z;

            
            this.geometry.attributes.elapsed_time.array[i*this.geometry.attributes.elapsed_time.itemSize] = 0;

            this.aliveCount++;
        }

        for(const [name, attribute] of Object.entries(this.geometry.attributes)){
            attribute.needsUpdate = true;
        }

        

    }

    setSpawnrate(spawnRate){
        this.spawnRate = spawnRate;
    }

    tick(delta){
        this.overwriteDeadParticles(delta);
        this.addParticles(delta);
        this.geometry.setDrawRange(0, this.aliveCount);
    }

}

export{ Particles }