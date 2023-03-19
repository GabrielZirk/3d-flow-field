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
    flowFieldX: 50,
    flowFieldY: 50,
    flowFieldZ: 50,
    boxSegments: 1,
    gridwidth: 10,
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
camera.position.set(params.flowFieldX / 2, 50.0, 100);

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.add(camera);

/**
 * Controls 
 * */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

const dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
const dotMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: false,
});
const dots = new THREE.Points(dotGeometry, dotMaterial);

scene.add(dots);

const p = new P.Particle(
    params.flowFieldX,
    params.flowFieldY,
    params.flowFieldZ
).createParticle();

scene.add(p);
function animate() {

    // Update controls
    controls.update();


    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();