//This is a JS Class that have the cube in threeJs and the methods to move it with its physics
import * as THREE from 'three';
import * as CANNON from "cannon-es";


class Cube {
    constructor(geometry, materials, cubeBodyShape, mass=0, speed=0, position= new THREE.Vector3(0, 0, 0)) {
        this.cubeMesh = new THREE.Mesh(
           geometry,
            [
                ...materials,
            ]
        );
        this.cubeBody = new CANNON.Body({ mass, velocity: new CANNON.Vec3(speed, 0, 0), type: CANNON.Body.KINEMATIC });
        this.cubeBody.addShape(cubeBodyShape);
        this.cubeMesh.position.copy(position);
	    this.cubeBody.position.copy(this.cubeMesh.position);
        this.speed = speed;        
    }

    setPosition(x, y, z) {
        this.cubeBody.position = new CANNON.Vec3(x, y, z);
        this.cubeMesh.position.copy(this.cubeBody.position);
    }

    getPosition() {
        return this.cubeMesh.position;
    }

    getPositionBody() {
        return this.cubeBody.position;
    }

    getBody() {
        return this.cubeBody;
    }
    
    getMesh() {
        return this.cubeMesh;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getSpeed() {
        return this.speed;
    }

    move() {
        this.cubeMesh.position.copy(this.cubeBody.position);
		this.cubeMesh.quaternion.copy(this.cubeBody.quaternion);
    }

    detectCollision(object) {
        const cubeBoundingBox = new THREE.Box3().setFromObject(this.cubeMesh);
        const secondBoundingBox = new THREE.Box3().setFromObject(object);
        return cubeBoundingBox.intersectsBox(secondBoundingBox);
    }

  

}

export default Cube;
