
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { threeToCannon, ShapeType } from 'three-to-cannon';
class Buttons{
    constructor(callback, position, rotation, scale, name){
        this.callback = callback;
        this.active = false;
        const loader = new GLTFLoader();
        loader.load('/Models/Button.gltf', (gltf) => {
            const mesh = gltf.scene;

            this.animations = gltf.animations
            mesh.position.copy(position);
            mesh.rotation.copy(rotation);
            mesh.scale.copy(scale);
            const result = threeToCannon(gltf.scene, {type: ShapeType.MESH});
            const body = new CANNON.Body({ mass:0, type: CANNON.Body.KINEMATIC });
            body.addShape(result.shape);
            body.position.copy(mesh.position);
            mesh.name = name

            this.mixer = new THREE.AnimationMixer(gltf.scene);        
            body.addEventListener("collide", (event) => {

                if(!this.active){
                    const animation = this.mixer.clipAction(gltf.animations[0]).setLoop(THREE.LoopOnce).setDuration(90)
                    animation.clampWhenFinished = true;
                    animation.play();
                    this.active = true;
                }
            })
            this.mesh = mesh
            this.body = body
        })
         
        
    }
    
    setPosition(x,y,z){
        this.body.position = new CANNON.Vec3(x,y,z);
        this.mesh.position.copy(this.body.position);
    }
    
    getPosition(){
        return this.mesh.position;
    }

    getBody() {
        return this.body;
    }
    
    getMesh() {
        return this.mesh;
    }
    update(delta){
        if(this.mixer){
            this.mixer.update(delta);
        }
    }

    detectCollision(object) {
        console.log(object);
        const meshBoundingBox = new THREE.Box3().setFromObject(this.mesh);
        const secondBoundingBox = new THREE.Box3().setFromObject(object);
        const value = meshBoundingBox.intersectsBox(secondBoundingBox);
        if (value) {
            this.callback();
        }
    }

}

export default Buttons;