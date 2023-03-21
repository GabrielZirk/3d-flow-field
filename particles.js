import * as THREE from 'three';

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
};

export class Particle {
    constructor(maxX, maxY, maxZ) {
        this.position = new THREE.Vector3(getRandomInt(maxX), getRandomInt(maxY), getRandomInt(maxZ));        
        this.size = 10;
        this.velocity = new THREE.Vector3(1, 1, 1);
        this.acc = new THREE.Vector3(0, 0, 0);
    }

    applyForce(force) {

    }

    createParticle() {
        const position = new Float32Array([this.position.x, this.position.y, this.position.z])
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff0000,
            sizeAttenuation: true,
            size: 10,
        })
        const particle = new THREE.Points(particleGeometry, particleMaterial);
        return particle
    }
}