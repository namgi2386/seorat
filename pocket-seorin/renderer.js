import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const W = window.innerWidth;
const H = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(W, H);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);

scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(1, 2, 3);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-2, 1, -1);
scene.add(fillLight);

const GLB_NAMES = [
  'seorin_agree.glb',
  'seorin_boxing.glb',
  'seorin_running.glb',
  'seorin_skill.glb',
  'seorin_walking.glb',
];

const MAX_REPEATS = 3;
const characters = new Array(GLB_NAMES.length).fill(null);
let current = 0;
let repeats = 0;

const baseUrl = window.electronAPI.assetsBaseUrl;
const loader = new GLTFLoader();

function onFinished() {
  repeats++;
  if (repeats >= MAX_REPEATS) {
    repeats = 0;
    let next;
    do { next = Math.floor(Math.random() * characters.length); }
    while (next === current && characters.length > 1);
    switchTo(next);
  } else {
    characters[current].action?.reset().play();
  }
}

Promise.all(
  GLB_NAMES.map((name, i) =>
    new Promise(resolve =>
      loader.load(`${baseUrl}/${name}`, gltf => {
        const model = gltf.scene;
        const mixer = new THREE.AnimationMixer(model);
        const clip = gltf.animations[0];
        let action = null;

        if (clip) {
          action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          mixer.addEventListener('finished', onFinished);
        }

        model.visible = false;
        scene.add(model);
        characters[i] = { model, mixer, action };
        resolve();
      })
    )
  )
).then(() => {
  setupCamera();
  switchTo(Math.floor(Math.random() * characters.length));
  animate();
});

function setupCamera() {
  const ref = characters[0].model;
  ref.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(ref);
  if (box.isEmpty()) return;

  const size = box.getSize(new THREE.Vector3());
  const offset = new THREE.Vector3(
    -(box.min.x + size.x / 2),
    -box.min.y,
    -(box.min.z + size.z / 2)
  );
  characters.forEach(({ model }) => model.position.add(offset));

  // camera positioned so character fills ~78% of window height
  const fovRad = (camera.fov * Math.PI) / 180;
  const dist = (size.y / 2) / (0.78 * Math.tan(fovRad / 2));
  camera.position.set(0, size.y / 2, dist);
  camera.lookAt(0, size.y / 2, 0);
}

function switchTo(index) {
  characters[current].model.visible = false;
  characters[current].action?.stop();
  current = index;
  characters[current].model.visible = true;
  characters[current].action?.reset().play();
}

// Drag
const canvas = renderer.domElement;
let dragging = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  dragging = true;
  lastX = e.screenX;
  lastY = e.screenY;
});
window.addEventListener('mousemove', e => {
  if (!dragging) return;
  window.electronAPI.moveWindow(e.screenX - lastX, e.screenY - lastY);
  lastX = e.screenX;
  lastY = e.screenY;
});
window.addEventListener('mouseup', () => { dragging = false; });

canvas.addEventListener('contextmenu', e => {
  e.preventDefault();
  window.electronAPI.showContextMenu();
});

// Render loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  characters[current]?.mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}
