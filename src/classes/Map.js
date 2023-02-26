import * as THREE from "three";
import * as CANNON from "cannon-es";

class WorldMap {
	constructor(document) {
		this.worldBody = new CANNON.World();
		this.worldBody.gravity.set(0, -9.82, 0);
		this.worldBody.broadphase = new CANNON.NaiveBroadphase();
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		this.scene = new THREE.Scene();
		this.cubes = [];
		this.balls = [];
		this.toAnimate = [];
	}

	getWorldBody() {
		return this.worldBody;
	}

	getRenderer() {
		return this.renderer;
	}

	getScene() {
		return this.scene;
	}

	addElement(elementBody, elementMesh) {
		this.worldBody.addBody(elementBody);
		this.scene.add(elementMesh);
	}

	ballsMovement() {
		for (let i = 0; i < this.balls.length; i++) {
			this.balls[i].move()
		}
	}
}

export default WorldMap;
//module.exports = WorldMap;