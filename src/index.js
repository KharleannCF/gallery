import "./index.css";
import * as THREE from "three";
import CameraControls from "camera-controls";
import * as CANNON from "cannon-es";

const GROUP_SCALE = 10;
const CUBE_DIMENSIONS = { x: 1, y: 1, z: 0.5 };
const CUBE_LAYER = 2;
const BOX_SHAPE = new CANNON.Box(
	new CANNON.Vec3(0.5, 0.5, 0.25).scale(GROUP_SCALE)
);

const textures = [
	"https://pbs.twimg.com/media/Fja2aX-XkAAhGnL?format=jpg&name=large",
	"https://pbs.twimg.com/media/FPh6uYoXIAQmsTF?format=jpg&name=large",
	"https://pbs.twimg.com/media/FKJ9uL0X0AcD8Zy?format=jpg&name=900x900",
	"https://scontent-iad3-2.xx.fbcdn.net/v/t39.30808-6/322953892_1368609863675764_8550388422795312537_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=0debeb&_nc_ohc=j8kOssq5KVgAX-SZNdq&_nc_ht=scontent-iad3-2.xx&oh=00_AfCs36vXETi3lNljV1W1ifgYnKkxrkAD1zDpPdrjNgtqGg&oe=63F36B03",
	"https://scontent-iad3-2.xx.fbcdn.net/v/t39.30808-6/314498925_188335383748634_1438016474951599445_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=cy_p2ujckJQAX_MGvjz&_nc_ht=scontent-iad3-2.xx&oh=00_AfDRYUYr2p5bR41qgjZ_2yIiU6wcj1cVNqlgUyy8Sxec-g&oe=63F3ABA3",
	"https://scontent-iad3-2.xx.fbcdn.net/v/t39.30808-6/311366279_183454410903398_226244603113068831_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=pG9y_1F661UAX-oviFp&_nc_ht=scontent-iad3-2.xx&oh=00_AfAu4B1OWJ4bn5RUnqj7h9ArOekWBOMX5lTJF4nDP58j8A&oe=63F4A328",
	// ... add more texture paths here
];

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
	const cube = new THREE.Mesh(
		new THREE.BoxGeometry(
			CUBE_DIMENSIONS.x,
			CUBE_DIMENSIONS.y,
			CUBE_DIMENSIONS.z
		),
		[
			materials[materialIndex],
			materials[materialIndex],
			materials[materialIndex],
			materials[materialIndex],
			textureMaterial,
			textureMaterial,
		]
	);
	cube.scale.set(GROUP_SCALE, GROUP_SCALE, GROUP_SCALE)
	const rail = Math.round(Math.random()) * GROUP_SCALE;
	const sign = Math.random() > 0.5 ? -1 : 1;
	scene.add(cube);
	cube.position.set(
		initialPosition,
		GROUP_SCALE,
		0.5 * GROUP_SCALE + rail * sign
	);
	cube.layers.set(CUBE_LAYER);
	const boxBody = new CANNON.Body({ mass: 0 });
	boxBody.addShape(BOX_SHAPE);
	boxBody.position.copy(cube.position);
	world.addBody(boxBody);
	cubes.push(boxBody);
	return { cube, boxBody };
}
function detectCollisionCubes(firstObject, secondObject) {
	const firstBB = new THREE.Box3().setFromObject(firstObject);
	const secondBB = new THREE.Box3().setFromObject(secondObject);
	return firstBB.intersectsBox(secondBB);
}

CameraControls.install({ THREE: THREE });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.layers.enable(2);

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.NaiveBroadphase();
const balls = [];
const ballMeshes = [];
const cubes = [];
const direction = new THREE.Vector3(0, 0, 0);
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const materials = [
	new THREE.MeshBasicMaterial({ color: 0x005555 }),
	new THREE.MeshBasicMaterial({ color: 0x550055 }),
	new THREE.MeshBasicMaterial({ color: 0x555500 }),
	new THREE.MeshBasicMaterial({ color: 0x883355 }),
];

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const toAnimate = [];
camera.position.set(new THREE.Vector3(0, 2.5, -5));

CameraControls.install({ THREE: THREE });
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.setLookAt(0, 1.9, -20, 0, 1.9, -19.99, false);
cameraControls.maxDistance = 0.1;
cameraControls.minDistance = 0;
cameraControls.truckSpeed = 2.0;

const onKeyDown = (event) => {
	switch (event.keyCode) {
		case 38: // up
		case 87: // w
			moveForward = true;
			break;
		case 37: // left
		case 65: // a
			moveLeft = true;
			break;
		case 40: // down
		case 83: // s
			moveBackward = true;
			break;
		case 39: // right
		case 68: // d
			moveRight = true;
			break;
	}
};

const onKeyUp = (event) => {
	switch (event.keyCode) {
		case 38: // up
		case 87: // w
			moveForward = false;
			break;
		case 37: // left
		case 65: // a
			moveLeft = false;
			break;
		case 40: // down
		case 83: // s
			moveBackward = false;
			break;
		case 39: // right
		case 68: // d
			moveRight = false;
			break;
	}
};

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
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

scene.add(groupLeft);
scene.add(groupRight);

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

world.addBody(groupLeftBody);
world.addBody(groupRightBody);

groupLeft.position.copy(groupLeftBody.position);
groupLeft.quaternion.copy(groupLeftBody.quaternion);
groupRight.position.copy(groupRightBody.position);
groupRight.quaternion.copy(groupRightBody.quaternion);

const floorGeometry = new THREE.PlaneBufferGeometry(300, 300, 100, 100);
floorGeometry.rotateX(-Math.PI / 2);
const floor = new THREE.Mesh(floorGeometry, materialGrey);
floor.position.set(0, -0.5, 0);
scene.add(floor);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({ mass: 0 });
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
floorBody.position.set(0, -0.5, 0);
world.addBody(floorBody);

cameraControls.update();

window.addEventListener("mousedown", () => {
	const ballRadius = 0.5;
	const ballGeometry = new THREE.SphereGeometry(ballRadius, 16, 16);
	const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
	const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
	ballMesh.position.copy(camera.position);
	scene.add(ballMesh);

	const cameraDirection = new THREE.Vector3();
	camera.getWorldDirection(cameraDirection);

	const ballShape = new CANNON.Sphere(ballRadius);
	const ballBody = new CANNON.Body({ mass: 1 });
	ballBody.addShape(ballShape);
	ballBody.position.copy(camera.position);
	const ballSpeed = 75;
	const ballVelocity = cameraDirection.multiplyScalar(ballSpeed);
	ballBody.velocity.copy(ballVelocity);
	world.addBody(ballBody);

	balls.push(ballBody);
	ballMeshes.push(ballMesh);

	if (balls.length > 10) {
		world.removeBody(balls.shift());
		scene.remove(ballMeshes.shift());
	}

	// check for collisions with boxes
	const contactMaterial = new CANNON.ContactMaterial(ballMaterial, {
		friction: 0.3,
		restitution: 0.7,
	});
	world.addContactMaterial(contactMaterial);

	ballBody.addEventListener("collide", (event) => {
		const ball = event.contact.bi;
		const cube = event.contact.bj;
		// check if the collided body is a ball
		if (cubes.includes(cube)) {
			// set the ball's velocity to zero so it falls under gravity
			ball.velocity.set(ball.velocity.x/-10, ball.velocity.y/-10, ball.velocity.z/-10);
			ball.angularVelocity.set(0, 0, 0);
		}
	});
});

let lastTime = performance.now();

let timeToNextCube = 0;
const spawnDelay = 3;
const speed = 25;
function animate() {
	const now = performance.now();
	const delta = (now - lastTime) / 1000;

	for (let i = 0; i < balls.length; i++) {
		ballMeshes[i].position.copy(balls[i].position);
		ballMeshes[i].quaternion.copy(balls[i].quaternion);
	}

	world.step(1 / 60, delta);

	for (let i = toAnimate.length - 1; i >= 0; i--) {
		const elem = toAnimate[i];
		const collisionDetected =
			elem.speed > 0 &&
			detectCollisionCubes(
				elem.cube.cube,
				groupRight.getObjectByName("collision")
			);

		if (
			collisionDetected ||
			detectCollisionCubes(
				elem.cube.cube,
				groupLeft.getObjectByName("collision")
			)
		) {
			scene.remove(elem.cube.cube);
			world.removeBody(elem.cube.boxBody);
			cubes.splice(cubes.indexOf(elem.cube.boxBody), 1);
			toAnimate.splice(i, 1);
		} else {
			elem.cube.cube.position.x += elem.speed * delta;
			elem.cube.boxBody.position.copy(elem.cube.cube.position);
		}
	}
	direction.z = Number(moveForward) - Number(moveBackward);
	direction.x = Number(moveRight) - Number(moveLeft);

	if (moveForward || moveBackward) {
		cameraControls.forward(10 * delta * direction.z, true);
	}
	if (moveLeft || moveRight) {
		cameraControls.truck(10 * delta * direction.x, 0, true);
	}

	if (cameraControls.update(delta)) {
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
	}

	lastTime = now;

	timeToNextCube -= delta;
	if (timeToNextCube <= 0 && texturesMaterial.length > 0) {
		if (Math.random() <= 0.5) {
			toAnimate.push({
				cube: generateCube(-90, scene),
				speed: speed,
			});
		} else {
			toAnimate.push({
				cube: generateCube(90, scene),
				speed: -speed,
			});
		}
		timeToNextCube = spawnDelay;
	}

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
