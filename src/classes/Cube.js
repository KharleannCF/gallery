//This is a JS Class that have the cube in threeJs and the methods to move it with its physics
import * as THREE from 'three';
import * as CANNON from "cannon-es";


class Cube {
    constructor(geometry, materials, cubeBodyShape, mass=0, speed=0) {
        this.cubeMesh = new THREE.Mesh(
           geometry,
            [
                ...materials,
            ]
        );
        this.cubeBody = new CANNON.Body({ mass });
        this.cubeBody.addShape(cubeBodyShape);
        this.cubeBody.position.copy(this.cubeMesh.position)
        this.speed = speed;
    }

    setPosition(x, y, z) {
        this.cubeMesh.position.set(x, y, z);
        this.cubeBody.position.copy(this.cubeMesh.position);
    }

    getPosition() {
        return this.cubeMesh.position;
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

    move(delta) {
        this.cubeMesh.position.x += this.speed * delta;
        this.cubeBody.position.copy(this.cubeMesh.position);
    }

    detectCollision(object) {
        const cubeBoundingBox = new THREE.Box3().setFromObject(this.cubeMesh);
        const secondBoundingBox = new THREE.Box3().setFromObject(object);
        return cubeBoundingBox.intersectsBox(secondBoundingBox);
    }

    
}

export default Cube;
