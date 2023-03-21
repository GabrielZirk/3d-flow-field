import * as THREE from 'three';
import { simplex4D } from '@leodeslf/simplex-noise';

export class particleSystem {
    constructor(flowFieldX, flowFieldY, flowFieldZ, gridStep) {
        this.maxX = flowFieldX;
        this.maxY = flowFieldY;
        this.maxZ = flowFieldZ;
        this.gridwidth = gridStep;
        this.velVectors = new Array((this.maxX / this.gridwidth) * (this.maxY / this.gridwidth) * (this.maxZ / this.gridwidth));
        this.inc = 0.1;
        this.clock = new THREE.Clock();
        this.timeScale = 0.2;

    }

    createFlowField() {
        let vertices = new Float32Array(
            ((this.maxX / this.gridwidth) * (this.maxY / this.gridwidth) * (this.maxZ / this.gridwidth)) * 3);

        // let counter = 0;
        let xoff = 0;
        loop1:
        for (let x = 0; x < this.maxX / this.gridwidth; x++) {
            let yoff = 0;
            loop2:
            for (let y = 0; y < this.maxY / this.gridwidth; y++) {
                let zoff = 0;
                loop3:
                for (let z = 0; z < this.maxZ / this.gridwidth; z++) {

                    let index = x + this.maxX / this.gridwidth * (y + this.maxY / this.gridwidth * z);

                    let i3 = index * 3;
                    let xPos = x * this.gridwidth + this.gridwidth / 2;
                    let yPos = y * this.gridwidth + this.gridwidth / 2;
                    let zPos = z * this.gridwidth + this.gridwidth / 2;

                    vertices[i3 + 0] = xPos;
                    vertices[i3 + 1] = yPos;
                    vertices[i3 + 2] = zPos;

                    let angle =  THREE.MathUtils.mapLinear(simplex4D(xoff, yoff, zoff, this.clock.getElapsedTime() * this.timeScale), 0, 1, 1, Math.PI * 2) * 1;
                    let vec = new THREE.Vector3().setFromSphericalCoords(1, angle, angle)

                    this.velVectors[index] = vec;

                    zoff += this.inc;
                }
                yoff += this.inc;
            }
            xoff += this.inc;
        }
        // console.log(this.velVectors);
        return vertices
    }

    update() {
        let xoff = 0;
        loop1:
        for (let x = 0; x < this.maxX / this.gridwidth; x++) {
            let yoff = 0;
            loop2:
            for (let y = 0; y < this.maxY / this.gridwidth; y++) {
                let zoff = 0;
                loop3:
                for (let z = 0; z < this.maxZ / this.gridwidth; z++) {

                    let index = x + this.maxX / this.gridwidth * (y + this.maxY / this.gridwidth * z);
                    let angle =  THREE.MathUtils.mapLinear(simplex4D(xoff, yoff, zoff, this.clock.getElapsedTime() * this.timeScale), 0, 1, 1, Math.PI * 2) * 1;
                    let vec = new THREE.Vector3().setFromSphericalCoords(1, angle, angle)
                    this.velVectors[index] = vec;
                    zoff += this.inc;
                }
                yoff += this.inc;
            }
            xoff += this.inc;
        }
    }
}