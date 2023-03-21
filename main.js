import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import * as PS from './particlesystem.js';
import * as P from './particles.js';

/**
 * GUI
 */
const gui = new dat.GUI({ width: 340 });

/**
 * Canvas
 */
const canvas = document.getElementById("3d-flow-field");

/**
 * Parameters
 */
const params = {
    width: window.innerWidth,
    height: window.innerHeight,
    flowFieldX: 100,
    flowFieldY: 100,
    flowFieldZ: 100,
    boxSegments: 1,
    gridwidth: 10,
    drawVectors: true,
    drawVertices: true
};

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});

// Handle different pixeldensities
renderer.setSize(params.width, params.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    75,
    params.width / params.height,
    0.1,
    1000);
camera.position.set(params.flowFieldX / 2, params.flowFieldY, params.flowFieldZ * 1.5);

/**
 * Scene
 */
export const scene = new THREE.Scene();
scene.add(camera);

/**
 * Controls 
 * */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(params.flowFieldX / 2, params.flowFieldY / 2, params.flowFieldZ / 2);

/**
 * Handle window resizing
 */
window.addEventListener('resize', () => {
    // Update sizes
    params.width = window.innerWidth
    params.height = window.innerHeight

    // Update camera
    camera.aspect = params.width / params.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(params.width, params.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * Geometry
 */
const boxGeometry = new THREE.BoxGeometry(
    params.flowFieldX,
    params.flowFieldY,
    params.flowFieldZ,
    params.boxSegments,
    params.boxSegments,
    params.boxSegments);

boxGeometry.translate(
    params.flowFieldX / 2,
    params.flowFieldY / 2,
    params.flowFieldZ / 2
);

const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0xf58442,
    wireframe: true
});

const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const particleSystem = new PS.particleSystem(
    params.flowFieldX, 
    params.flowFieldY, 
    params.flowFieldZ, 
    params.gridwidth);
    
const vertices = particleSystem.createFlowField();

if(params.drawVertices) {
const dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
const dotMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: false,
});
const dots = new THREE.Points(dotGeometry, dotMaterial);

scene.add(dots);
}

const p = new P.Particle(
    params.flowFieldX,
    params.flowFieldY,
    params.flowFieldZ
).createParticle();

scene.add(p);

const lines = [];
if (params.drawVectors) {

for (let v = 0; v < particleSystem.velVectors.length; v++){
    let p1 = new THREE.Vector3(vertices[v * 3 + 1], vertices[v * 3 + 2], vertices[v * 3 + 3]);
    let p2 = p1.clone().add(particleSystem.velVectors[v])
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    lines.push(line);
    scene.add(line);
}
}

function updateLines() {
    for (let i = 0; i < lines.length; i++) {
        const positionsOld = [...lines[i].geometry.attributes.position.array];

        const positions = lines[i].geometry.attributes.position.array;
        positions[3] = particleSystem.velVectors[i].x + positions[0];
        positions[4] = particleSystem.velVectors[i].y + positions[1];
        positions[5] = particleSystem.velVectors[i].z + positions[2];
        lines[i].geometry.attributes.position.needsUpdate = true; 
    }
}



function animate() {

    // Update controls
    controls.update();

    // Update particlesytem vectors
    particleSystem.update();

    if (params.drawVectors) {
    updateLines()
    }
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();