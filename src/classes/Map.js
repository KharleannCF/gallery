import * as THREE from "three";
import * as CANNON from "cannon-es";

class WorldMap {
	constructor(document) {
		this.worldBody = new CANNON.World();
		this.worldBody.gravity.set(0, -9.81, 0);
		this.worldBody.broadphase = new CANNON.NaiveBroadphase();
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		this.scene = new THREE.Scene();
		this.cubes = [];
		this.balls = [];
		this.toAnimate = [];
		this.buttons = [];
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

	getElementByName(name){
		return this.scene.getObjectByName(name);
	}

	addLight(light) {
		this.scene.add(light);
	}

	addElement(elementBody, elementMesh, name="") {
		this.worldBody.addBody(elementBody);
		this.scene.add(elementMesh);
	}

	addElementObject(element, name=""){
		this.worldBody.addBody(element.body);
		element.mesh.name = name;
		this.scene.add(element.mesh);
	}

	removeElement(elementBody, elementMesh) {
		this.worldBody.removeBody(elementBody);
		this.scene.remove(elementMesh);
	}

	ballsMovement() {
		for (let i = 0; i < this.balls.length; i++) {
			this.balls[i].move(this)
		}
	}
}

export default WorldMap;
//module.exports = WorldMap;