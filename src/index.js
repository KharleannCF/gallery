import "./index.css";
import * as THREE from "three";
import CameraControls from "camera-controls";
import * as CANNON from "cannon-es";
import { KeyboardKeyHold } from "hold-event";
import JoystickController from "joystick-controller";
import WorldMap from "./classes/Map";
import Player from "./classes/Player";
import Cube from "./classes/Cube";
import Ball from "./classes/Ball";

let lastTime = performance.now();

const textures = [
	"https://pbs.twimg.com/media/Fja2aX-XkAAhGnL?format=jpg&name=large",
	"https://pbs.twimg.com/media/FPh6uYoXIAQmsTF?format=jpg&name=large",
	"https://pbs.twimg.com/media/FKJ9uL0X0AcD8Zy?format=jpg&name=900x900",
	"https://pbs.twimg.com/media/FNYntH0XoAA6mNv?format=jpg&name=large",
	"https://pbs.twimg.com/media/FMf9zC6XoAUvRkt?format=jpg&name=large",
	"https://pbs.twimg.com/media/FL6l-YBWQAIAaLJ?format=jpg&name=large",
	"https://pbs.twimg.com/media/FKeEHQ3XoAQfPav?format=jpg&name=large",

	// ... add more texture paths here
];

const GROUP_SCALE = 10;
const CUBE_DIMENSIONS = { x: 1, y: 1, z: 0.5 };
const CUBE_LAYER = 2;
const BOX_SHAPE = new CANNON.Box(
	new CANNON.Vec3(0.5, 0.5, 0.25).scale(GROUP_SCALE)
);

const textureLoader = new THREE.TextureLoader();
const texturePromises = textures.map((texturePath) =>
	textureLoader.loadAsync(texturePath)
);
let texturesMaterial = [];
Promise.all(texturePromises)
	.then((res) => {
		// All textures have been loaded, start the loop or animation here
		texturesMaterial = [...res];
	})
	.catch((error) => {
		console.error("Failed to load textures:", error);
	});

function generateCube(initialPosition, scene) {
	const materialIndex = Math.floor(Math.random() * materials.length);
	const textureIndex = Math.floor(Math.random() * texturesMaterial.length);
	const textureMaterial = new THREE.MeshBasicMaterial({
		map: texturesMaterial[textureIndex],
	});
	const geometry = new THREE.BoxGeometry(
		CUBE_DIMENSIONS.x,
		CUBE_DIMENSIONS.y,
		CUBE_DIMENSIONS.z
	);
	const materialsArr = [
		materials[materialIndex],
		materials[materialIndex],
		materials[materialIndex],
		materials[materialIndex],
		textureMaterial,
		textureMaterial,
	];
	const cube = new Cube(geometry, materialsArr, BOX_SHAPE, 0, 25);
	const rail = Math.round(Math.random()) * GROUP_SCALE;
	const sign = Math.random() > 0.5 ? -1 : 1;
	cube.setPosition(
		initialPosition,
		GROUP_SCALE,
		0.5 * GROUP_SCALE + rail * sign
	);
	cube.getMesh().layers.set(CUBE_LAYER);
	cube.getMesh().scale.set(GROUP_SCALE, GROUP_SCALE, GROUP_SCALE);
	map.addElement(cube.getBody(), cube.getMesh());
	return cube;
}
function detectCollisionCubes(firstObject, secondObject) {
	const firstBB = new THREE.Box3().setFromObject(firstObject);
	const secondBB = new THREE.Box3().setFromObject(secondObject);
	return firstBB.intersectsBox(secondBB);
}

const materials = [
	new THREE.MeshBasicMaterial({ color: 0x005555 }),
	new THREE.MeshBasicMaterial({ color: 0x550055 }),
	new THREE.MeshBasicMaterial({ color: 0x555500 }),
	new THREE.MeshBasicMaterial({ color: 0x883355 }),
];

const KEYCODE = {
	W: 87,
	A: 65,
	S: 83,
	D: 68,
	ARROW_LEFT: 37,
	ARROW_UP: 38,
	ARROW_RIGHT: 39,
	ARROW_DOWN: 40,
};

const map = new WorldMap(document);
const player = new Player(map);

const wKey = new KeyboardKeyHold(KEYCODE.W, 16.666);
const aKey = new KeyboardKeyHold(KEYCODE.A, 16.666);
const sKey = new KeyboardKeyHold(KEYCODE.S, 16.666);
const dKey = new KeyboardKeyHold(KEYCODE.D, 16.666);
aKey.addEventListener("holding", function (event) {
	player.getCameraControls().truck(-0.01 * event.deltaTime, 0, false);
});
dKey.addEventListener("holding", function (event) {
	player.getCameraControls().truck(0.01 * event.deltaTime, 0, false);
});
wKey.addEventListener("holding", function (event) {
	player.getCameraControls().forward(0.01 * event.deltaTime, false);
});
sKey.addEventListener("holding", function (event) {
	player.getCameraControls().forward(-0.01 * event.deltaTime, false);
});

const groupLeft = new THREE.Group();
const groupRight = new THREE.Group();
const bottomTableG = new THREE.BoxGeometry(5, 1, 4.5);
const topTableG = new THREE.BoxGeometry(5, 0.5, 4.5);
const sideTableG = new THREE.BoxGeometry(5, 1, 0.5);
const backTableG = new THREE.BoxGeometry(0.1, 2.5, 4.5);

const materialGreen = new THREE.MeshBasicMaterial({ color: 0x005500 });
const materialBlue = new THREE.MeshBasicMaterial({ color: 0x000055 });
const materialRed = new THREE.MeshBasicMaterial({ color: 0x550000 });
const materialPurple = new THREE.MeshBasicMaterial({ color: 0x550055 });
const materialGrey = new THREE.MeshBasicMaterial({ color: 0x555555 });

const bottomBox = new THREE.Mesh(bottomTableG, materialBlue);
const topBox = new THREE.Mesh(topTableG, materialGreen);
const sideBox = new THREE.Mesh(sideTableG, materialRed);
const backBox = new THREE.Mesh(backTableG, materialPurple);

bottomBox.position.set(0, 0, 0);
topBox.position.set(0, 1.75, 0);
sideBox.position.set(0, 1, 2);
backBox.position.set(2.55, 0.75, 0);
backBox.name = "collision";

for (let i = 1; i < 5; i++) {
	const clone = new THREE.Mesh(sideTableG, materialRed);
	clone.position.set(0, 1, 2 - i * 1);
	groupLeft.add(clone);
	groupRight.add(clone.clone());
}

groupLeft.add(bottomBox);
groupLeft.add(topBox);
groupLeft.add(sideBox);
groupLeft.add(backBox);
groupRight.add(bottomBox.clone());
groupRight.add(topBox.clone());
groupRight.add(sideBox.clone());
groupRight.add(backBox.clone());

groupLeft.rotation.set(0, Math.PI, 0);
groupLeft.scale.set(GROUP_SCALE, GROUP_SCALE, GROUP_SCALE);
groupRight.scale.set(GROUP_SCALE, GROUP_SCALE, GROUP_SCALE);

const groupLeftBody = new CANNON.Body({
	mass: 0, // Set mass to 0 for static objects
	shape: new CANNON.Box(new CANNON.Vec3(2.5, 3.75, 2.5).scale(GROUP_SCALE)), // Set shape to match groupLeft size
});
const groupRightBody = new CANNON.Body({
	mass: 0, // Set mass to 0 for static objects
	shape: new CANNON.Box(new CANNON.Vec3(2.5, 3.75, 2.5).scale(GROUP_SCALE)), // Set shape to match groupRight size
});

groupLeftBody.position.set(-100, 0, 0);
groupRightBody.position.set(100, 0, 0);
groupLeftBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI);

map.addElement(groupLeftBody, groupLeft);
map.addElement(groupRightBody, groupRight);

groupLeft.position.copy(groupLeftBody.position);
groupLeft.quaternion.copy(groupLeftBody.quaternion);
groupRight.position.copy(groupRightBody.position);
groupRight.quaternion.copy(groupRightBody.quaternion);

const floorGeometry = new THREE.PlaneBufferGeometry(300, 300, 100, 100);
floorGeometry.rotateX(-Math.PI / 2);
const floor = new THREE.Mesh(floorGeometry, materialGrey);
floor.position.set(0, -0.5, 0);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({ mass: 0 });
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
floorBody.position.set(0, -0.5, 0);

map.addElement(floorBody, floor);
player.getCameraControls().update();

window.addEventListener("mousedown", () => {
	const ball = player.shoot();
	map.addElement(ball.getBody(), ball.getMesh());
	map.balls.push(ball);
	const contactMaterial = new CANNON.ContactMaterial(ball.getMaterial(), {
		friction: 0.3,
		restitution: 0.7,
	});
	map.getWorldBody().addContactMaterial(contactMaterial);
	if (map.balls.length > 10) {
		const firstBall = map.balls.shift();
		map.getWorldBody().removeBody(firstBall.getBody());
		map.getScene().remove(firstBall.getMesh());
	}

	ball.getBody().addEventListener("collide", (event) => {
		const ball = event.contact.bi;
		const cube = event.contact.bj;
		// check if the collided body is a ball
		if (map.cubes.includes(cube)) {
			// set the ball's velocity to zero so it falls under gravity
			ball.velocity.set(
				ball.velocity.x / -10,
				ball.velocity.y / -10,
				ball.velocity.z / -10
			);
			ball.angularVelocity.set(0, 0, 0);
		}
	});
});

let timeToNextCube = 0;
const spawnDelay = 3;
const speed = 25;

function onWindowResize() {
	player.getCamera().aspect = window.innerWidth / window.innerHeight;
	player.getCamera().updateProjectionMatrix();
	map.getRenderer().setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

function animate() {
	const now = performance.now();
	const delta = (now - lastTime) / 1000;

	map.getWorldBody().step(1 / 60, delta);

	for (let i = map.cubes.length - 1; i >= 0; i--) {
		const elem = map.cubes[i];
		const collisionDetected =
			elem.speed > 0 &&
			detectCollisionCubes(
				elem.getMesh(),
				groupRight.getObjectByName("collision")
			);

		if (
			collisionDetected ||
			detectCollisionCubes(
				elem.getMesh(),
				groupLeft.getObjectByName("collision")
			)
		) {
			map.getScene().remove(elem.getMesh());
			map.getWorldBody().removeBody(elem.getBody());
			map.cubes.splice(i, 1);
		} else {
			elem.move(delta);
		}
	}

	timeToNextCube -= delta;
	if (timeToNextCube <= 0 && texturesMaterial.length > 0) {
		if (Math.random() <= 0.5) {
			map.cubes.push(generateCube(-90, map.getScene()));
		} else {
			map.cubes.push(generateCube(90, map.getScene()));
		}
		timeToNextCube = spawnDelay;
	}

	player.moveCamera(delta, map.getScene());
	map.ballsMovement();
	lastTime = now;

	requestAnimationFrame(animate);
	map.getRenderer().render(map.getScene(), player.getCamera());
}
animate();
