import * as THREE from 'three';

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
};

export class Particle {
    constructor(maxX, maxY, maxZ) {
        this.x = getRandomInt(maxX);
        this.y = getRandomInt(maxY);
        this.z = getRandomInt(maxZ);
        this.size = 10;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acc = new THREE.Vector3(0, 0, 0);

        console.log(this.x, this.y, this.z, maxX)
    }

    applyForce(force) {

    }

    createParticle() {
        const position = new Float32Array([this.x, this.y, this.z])
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