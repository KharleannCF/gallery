import "./index.css";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import WorldMap from "./classes/Map";
import Player from "./classes/Player";
import Cube from "./classes/Cube";
import Ball from "./classes/Ball";
import Utils from "./classes/Utils";
import GeneralConstants from "./constants/general";
import GeneralBuildings from "./classes/GeneralBuildings";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Buttons from "./classes/Entities/Buttons";
let lastTime = performance.now();
const utils = new Utils();

let texturesMaterial = [];
Promise.all(utils.texturePromises)
	.then((res) => {
		// All textures have been loaded, start the loop or animation here
		utils.setTexturesMaterials(res);
		texturesMaterial = [...res];
	})
	.catch((error) => {
		console.error("Failed to load textures:", error);
	});

const constants = new GeneralConstants();

const map = new WorldMap(document);
const player = new Player(map);

const events = constants.CreateEvent();
events.aKey.addEventListener("holding", function (event) {
	player.getCameraControls().truck(-0.01 * event.deltaTime, 0, false);
});
events.dKey.addEventListener("holding", function (event) {
	player.getCameraControls().truck(0.01 * event.deltaTime, 0, false);
});
events.wKey.addEventListener("holding", function (event) {
	player.getCameraControls().forward(0.01 * event.deltaTime, false);
});
events.sKey.addEventListener("holding", function (event) {
	player.getCameraControls().forward(-0.01 * event.deltaTime, false);
});

//Rails
map.addElementObject(
	GeneralBuildings.createRails(
		{
			bottom: constants.materialBlue,
			top: constants.materialGreen,
			side: constants.materialRed,
			back: constants.materialPurple,
		},
		{
			position: new THREE.Vector3(-100, 0, 0),
			rotation: new THREE.Vector3(0, Math.PI, 0),
		},
		-0.5
	),
	"groupLeft"
);

map.addElementObject(
	GeneralBuildings.createRails(
		{
			bottom: constants.materialBlue,
			top: constants.materialGreen,
			side: constants.materialRed,
			back: constants.materialPurple,
		},
		{
			position: new THREE.Vector3(100, 0, 0),
			rotation: new THREE.Vector3(0, 0, 0),
		},
		0.5
	),
	"groupRight"
);
//Floor
map.addElementObject(GeneralBuildings.createFloor(constants.materialGrey));

player.getCameraControls().update();

window.addEventListener("mousedown", () => {
	player.eventShoot(map);
});

function onWindowResize() {
	player.getCamera().aspect = window.innerWidth / window.innerHeight;
	player.getCamera().updateProjectionMatrix();
	map.getRenderer().setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

// Test
const spotLight = new THREE.SpotLight(0xff0000);
const spotLight2 = new THREE.SpotLight(0x0000ff);
const spotLight3 = new THREE.SpotLight(0x00ff00);
const spotLight4 = new THREE.SpotLight(0xffffff);
spotLight.position.set(-10, 20, 0);
spotLight2.position.set(10, 20, 0);
spotLight3.position.set(0, 20, 0);
spotLight4.position.set(-40, 15, 0);
spotLight.lookAt(0, 0, 0);
spotLight2.lookAt(0, 0, 0);
spotLight3.lookAt(0, 0, 0);
spotLight4.lookAt(0, 10, 0);
//map.getScene().add(spotLight);
//map.getScene().add(spotLight2);
//map.getScene().add(spotLight3);
map.getScene().add( spotLight4 );

const squareButton = new Buttons(
	() => {
		console.log("----");
	},
	new THREE.Vector3(0, -0.5, -10),
	new THREE.Vector3(0, 0, 0),
	new THREE.Vector3(1, 1, 1),
	"rails"
);

function animate() {
	const now = performance.now();

	if (
		!map.buttons.find((button) => {
			return button.name == "rails";
		})
	) {
		squareButton.getBody() &&
			map.addElement(squareButton.getBody(), squareButton.getMesh());
		map.buttons.push(squareButton);
	}

	const delta = (now - lastTime) / 1000;
	map.getWorldBody().step(1 / 60, delta);
	utils.animateRailsCube(
		map,
		map.getElementByName("groupRight"),
		map.getElementByName("groupLeft"),
		delta
	);

	map.buttons.forEach((button) => {
		button.update(delta);
	});

	constants.timeToNextCube -= delta;

	if (constants.timeToNextCube <= 0 && texturesMaterial.length > 0) {
		map.cubes.push(utils.generateCubeFromRail(map));
		constants.timeToNextCube = constants.spawnDelay;
	}

	player.moveCamera(delta, map.getScene());
	map.ballsMovement();
	lastTime = now;

	requestAnimationFrame(animate);
	map.getRenderer().render(map.getScene(), player.getCamera());
}
animate();
