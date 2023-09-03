import { KeyboardKeyHold } from "hold-event";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class GeneralConstants {
	constructor() {
		this.GROUP_SCALE = 10;
		this.KEYCODE = {
			W: 87,
			A: 65,
			S: 83,
			D: 68,
			ARROW_LEFT: 37,
			ARROW_UP: 38,
			ARROW_RIGHT: 39,
			ARROW_DOWN: 40,
		};
		this.speed = 25;
		this.spawnDelay = 2;
		this.timeToNextCube = 0;
		this.materialGreen = new THREE.MeshLambertMaterial({ color: 0x005500 });
		this.materialBlue = new THREE.MeshLambertMaterial({ color: 0x000055 });
		this.materialRed = new THREE.MeshLambertMaterial({ color: 0x550000 });
		this.materialPurple = new THREE.MeshLambertMaterial({
			color: 0x550055,
		});
		this.materialGrey = new THREE.MeshLambertMaterial({ color: 0x555555 });
		this.buttonsMeshes = {};
		this.loader = new GLTFLoader();
		
	}

	CreateEvent() {
		return {
			wKey: new KeyboardKeyHold(this.KEYCODE.W, 16.666),
			aKey: new KeyboardKeyHold(this.KEYCODE.A, 16.666),
			sKey: new KeyboardKeyHold(this.KEYCODE.S, 16.666),
			dKey: new KeyboardKeyHold(this.KEYCODE.D, 16.666),
		};
	}

	async loadModel(path) {
		return await this.loader.load(path, (gltf) => {
			return  gltf.scene;
		});
	}
}

export default GeneralConstants;
