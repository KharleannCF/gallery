import * as THREE from "three";
import * as CANNON from "cannon-es";
import Cube from "./Cube";

class Utils {
	constructor() {
		this.textures = [
			"https://pbs.twimg.com/media/Fja2aX-XkAAhGnL?format=jpg&name=large",
			"https://pbs.twimg.com/media/FPh6uYoXIAQmsTF?format=jpg&name=large",
			"https://pbs.twimg.com/media/FKJ9uL0X0AcD8Zy?format=jpg&name=900x900",
			"https://pbs.twimg.com/media/FNYntH0XoAA6mNv?format=jpg&name=large",
			"https://pbs.twimg.com/media/FMf9zC6XoAUvRkt?format=jpg&name=large",
			"https://pbs.twimg.com/media/FL6l-YBWQAIAaLJ?format=jpg&name=large",
			"https://pbs.twimg.com/media/FKeEHQ3XoAQfPav?format=jpg&name=large",

			// ... add more texture paths here
		];
		this.textureLoader = new THREE.TextureLoader();
		this.texturePromises = this.textures.map((texturePath) =>
			this.textureLoader.loadAsync(texturePath)
		);
		this.textureMaterials = [];
		this.materials = [
			new THREE.MeshLambertMaterial({ color: 0x005555 }),
			new THREE.MeshLambertMaterial({ color: 0x550055 }),
			new THREE.MeshLambertMaterial({ color: 0x555500 }),
			new THREE.MeshLambertMaterial({ color: 0x883355 }),
			new THREE.MeshLambertMaterial({ color: 0x555555 }),
		];
	}

	getTextures() {
		return this.texturePromises;
	}

	setTexturesMaterials(textures) {
		this.textureMaterials = [...textures];
	}

	getTexturesMaterials() {
		return this.textureMaterials;
	}

	generateCubeFromRail(map) {
		const CUBE_DIMENSIONS = { x: 10, y: 10, z: 5 };
		const CUBE_LAYER = 2;
		const BOX_SHAPE = new CANNON.Box(new CANNON.Vec3(10/2, 10/2, 5/2));
		const position = Math.random() < 0.5 ? 90 : -90;
		const materialIndex = Math.floor(Math.random() * this.materials.length);

		const textureIndex = Math.floor(
			Math.random() * this.getTexturesMaterials().length
		);

		const textureMaterial = new THREE.MeshLambertMaterial({
			map: this.getTexturesMaterials()[textureIndex],
		});

		const geometry = new THREE.BoxGeometry(
			CUBE_DIMENSIONS.x,
			CUBE_DIMENSIONS.y,
			CUBE_DIMENSIONS.z
		);
		const materialsArr = [
			this.materials[materialIndex],
			this.materials[materialIndex],
			this.materials[materialIndex],
			this.materials[materialIndex],
			textureMaterial,
			textureMaterial,
		];

		const rail = Math.round(Math.random()) * 10;
		const sign = position > 0 ? -1 : 1;
		const cube = new Cube(geometry, materialsArr, BOX_SHAPE, 0, 25 * sign);
		cube.setPosition(position, 10, (0.5 * 10 + rail) * sign);
		cube.getMesh().layers.set(CUBE_LAYER);
		map.addElement(cube.getBody(), cube.getMesh());
		return cube;
	}

	generatCubeInSpace(map) {
		const CUBE_DIMENSIONS = { x: 10, y: 10, z: 5 };
		const CUBE_LAYER = 2;
		const BOX_SHAPE = new CANNON.Box(new CANNON.Vec3(10/2, 10/2, 5/2));
		const materialIndex = Math.floor(Math.random() * this.materials.length);
		const textureIndex = Math.floor(
			Math.random() * this.getTexturesMaterials().length
		);
		
		const textureMaterial = new THREE.MeshBasicMaterial({
			map: this.getTexturesMaterials()[textureIndex],
		});

		const geometry = new THREE.BoxGeometry(
			CUBE_DIMENSIONS.x,
			CUBE_DIMENSIONS.y,
			CUBE_DIMENSIONS.z
		);

		const materialsArr = [
			this.materials[materialIndex],
			this.materials[materialIndex],
			this.materials[materialIndex],
			this.materials[materialIndex],
			textureMaterial,
			textureMaterial,
		];

		const cube = new Cube(
			geometry,
			materialsArr,
			BOX_SHAPE,
			0,
			25,
		);
		cube.getMesh().layers.set(CUBE_LAYER);
		map.addElement(cube.getBody(), cube.getMesh());
		cube.setPosition(4, 10, 5);
		return cube;
	}

	animateRailsCube(map, groupRight, groupLeft) {
		for (let i = map.cubes.length - 1; i >= 0; i--) {
			const elem = map.cubes[i];
			const collisionDetected = elem.detectCollision(
				elem.speed > 0
					? groupRight.getObjectByName("collision")
					: groupLeft.getObjectByName("collision")
			);
			if (collisionDetected) {
				map.removeElement(elem.getBody(), elem.getMesh());
				map.cubes.splice(i, 1);
			} else {
				elem.move();
			}
		}
	}
}

export default Utils;
