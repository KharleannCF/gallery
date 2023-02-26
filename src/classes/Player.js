import * as THREE from "three";
import * as CANNON from "cannon-es";
import { KeyboardKeyHold } from "hold-event";
import JoystickController from "joystick-controller";
import CameraControls from "camera-controls";
import Ball from "./Ball";

class Player {
	constructor(map) {
		CameraControls.install({ THREE: THREE });
		this.joystick = new JoystickController(
			{ x: "15%", y: "30%", containerClass: "container" },
			(data) => {
				return data;
			}
		);
		
		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
        this.map = map
		this.camera.layers.enable(2);
		this.camera.position.set(new THREE.Vector3(0, 2.5, -5));
		this.cameraControls = new CameraControls(
			this.camera,
			this.map.getRenderer().domElement
		);
		this.cameraControls.setLookAt(0, 1.9, -20, 0, 1.9, -19.99, false);
		this.cameraControls.maxDistance = 0.1;
		this.cameraControls.minDistance = 0;
		this.cameraControls.truckSpeed = 2.0;
		
	}

    getCameraControls(){
        return this.cameraControls;
    }
    getCamera(){
        return this.camera;
    }

    moveCamera(delta, scene) {
        if (this.joystick.x < -50) {
            this.cameraControls.truck(-0.01 * delta*1000, 0, false);
        }
        if (this.joystick.x > 50) {
            this.cameraControls.truck(0.01 * delta*1000, 0, false);
        }
        if (this.joystick.y > 50) {
            this.cameraControls.forward(0.01 * delta*1000, false);
        }
        if (this.joystick.y < -50) {
            this.cameraControls.forward(-0.01 * delta*1000, false);
        }
    
        if (this.cameraControls.update(delta)) {
            this.camera.updateProjectionMatrix();
            this.map.getRenderer().render(this.map.getScene(), this.camera);
        }
    }

    shoot(){
        const ballRadius = 0.5;
        const ballGeometry = new THREE.SphereGeometry(ballRadius, 16, 16);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
        const ballShape = new CANNON.Sphere(ballRadius);
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        const mass = 1;
        const ballSpeed = 75;
        return new Ball(ballGeometry, ballMaterial, ballShape, mass, ballSpeed, this.camera.position, cameraDirection);
    }
}


export default Player;