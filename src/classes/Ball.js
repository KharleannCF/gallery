import * as THREE from 'three';
import * as CANNON from "cannon-es";

//This is a JS class that have the ball in threeJs and the methods to move it with its physics

class Ball {
    constructor(geometry, material, ballBodyShape, mass=0, speed=0, position, direction) {
        this.ballMesh = new THREE.Mesh(geometry, material);
        this.material = material;
	    this.ballBody = new CANNON.Body({ mass, linearDamping:0.5 });
        this.ballBody.addShape(ballBodyShape);
        this.ballMesh.position.copy(position);
	    this.ballBody.position.copy(this.ballMesh.position);
        this.speed = speed;
        this.ballBody.velocity.copy(direction.multiplyScalar(this.speed));
        this.liveTime = 0

    }

    addCollitionListener() {
        this.ballBody.addEventListener("collide", e => {
            this.ballBody.velocity.copy(e.contact.getImpactVelocityAlongNormal().multiplyScalar(-1));
            this.ballBody.angularVelocity.set(0, 0, 0);
        });
    }   

    getMesh() {
        return this.ballMesh;
    }

    getBody() {
        return this.ballBody;
    }

    move(map) {
        if (this.liveTime > 5) return map.removeElement(this.getBody(), this.getMesh())
        this.ballMesh.position.copy(this.ballBody.position);
		this.ballMesh.quaternion.copy(this.ballBody.quaternion);
        this.liveTime += 0.01
    }
    
    getSpeed() {
        return this.speed;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getPosition() {
        return this.ballMesh.position;
    }

    setPosition(x, y, z) {
        this.ballMesh.position.set(x, y, z);
        this.ballBody.position.copy(this.ballMesh.position);
    }

    getMaterial() {
        return this.material
    }

}

export default Ball;

