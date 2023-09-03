import GeneralConstants from "../constants/general";
import * as THREE from "three";
import * as CANNON from "cannon-es";

class GeneralBuildings {
	static createRails(materials, transformations, bodyXAdded) {
		const group = new THREE.Group();
		const bottomG = new THREE.BoxGeometry(50, 10, 45);
		const topG = new THREE.BoxGeometry(50, 5, 45);
		const sideG = new THREE.BoxGeometry(50, 10, 5);
		const backG = new THREE.BoxGeometry(1, 25, 45);

		const bottomBox = new THREE.Mesh(bottomG, materials.bottom);
		const topBox = new THREE.Mesh(topG, materials.top);
		const sideBox = new THREE.Mesh(sideG, materials.side);
		const backBox = new THREE.Mesh(backG, materials.back);

		bottomBox.position.set(0, 0, 0);
		topBox.position.set(0, 17.5, 0);
		sideBox.position.set(0, 10, 20);
		backBox.position.set(25.5, 7.5, 0);
		backBox.name = "collision";

		for (let i = 1; i < 5; i++) {
			const clone = new THREE.Mesh(sideG, materials.side);
			clone.position.set(0, 10, 20 - i * 10);
			group.add(clone);
		}

		group.add(bottomBox);
		group.add(topBox);
		group.add(sideBox);
		group.add(backBox);

		group.rotation.set(
			transformations.rotation.x,
			transformations.rotation.y,
			transformations.rotation.z
		);
		group.position.set(
			transformations.position.x,
			transformations.position.y,
			transformations.position.z
		);

		const body = new CANNON.Body({
			shape: new CANNON.Box(new CANNON.Vec3(25 + 0.5, 17.5 + 2.5, 22.5)),
			type: CANNON.Body.KINEMATIC,
		});

		body.position.copy(
			new CANNON.Vec3(
				group.position.x + bodyXAdded,
				group.position.y,
				group.position.z
			)
		);

		return { mesh: group, body };
	}

	static createFloor(material) {
		const floorGeometry = new THREE.PlaneBufferGeometry(300, 300, 100, 100);
		floorGeometry.rotateX(-Math.PI / 2);
		const floor = new THREE.Mesh(floorGeometry, material);
		floor.position.set(0, -0.5, 0);

		const floorShape = new CANNON.Plane();
		const floorBody = new CANNON.Body({ mass: 0 , type: CANNON.Body.KINEMATIC});
		floorBody.addShape(floorShape);
		floorBody.quaternion.setFromAxisAngle(
			new CANNON.Vec3(1, 0, 0),
			-Math.PI / 2
		);
		floorBody.position.set(0, -0.5, 0);

        return {mesh: floor, body: floorBody}
	}
}

export default GeneralBuildings;
