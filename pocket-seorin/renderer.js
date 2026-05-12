import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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

// 0:agree  1:boxing  2:running  3:skill  4:walking(기본)
const GLB_NAMES = [
  "seorin_agree.glb",
  "seorin_boxing.glb",
  "seorin_running.glb",
  "seorin_skill.glb",
  "seorin_walking.glb",
];
const WALK_INDEX = 4;
const RUN_INDEX = 2;
const STOP_INDICES = [0, 1, 3]; // 멈추고 정면 바라보는 애니메이션
const WALK_SPEED = 1.3;
const RUN_SPEED = 2.2;
const SPECIAL_MIN = 3000; // ms
const SPECIAL_MAX = 8000; // ms

const characters = new Array(GLB_NAMES.length).fill(null);
let current = WALK_INDEX;

const { screenW, initX, initY } = window.electronAPI;
let winX = initX;
let winY = initY;
let walkDir = 1;

// 'walk' | 'run' | 'stop'
let mode = "walk";

let dragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let specialTimeout = null;

const loader = new GLTFLoader();
const baseUrl = window.electronAPI.assetsBaseUrl;

Promise.all(
  GLB_NAMES.map(
    (name, i) =>
      new Promise((resolve) =>
        loader.load(`${baseUrl}/${name}`, (gltf) => {
          const model = gltf.scene;
          const mixer = new THREE.AnimationMixer(model);
          const clip = gltf.animations[0];
          let action = null;

          if (clip) {
            action = mixer.clipAction(clip);
            mixer.addEventListener("finished", () => {
              if (characters[current]?.mixer === mixer) onSpecialFinished();
            });
          }

          model.visible = false;
          scene.add(model);
          characters[i] = { model, mixer, action };
          resolve();
        }),
      ),
  ),
).then(() => {
  setupCamera();
  startWalking();
  scheduleSpecial();
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
    -(box.min.z + size.z / 2),
  );
  characters.forEach(({ model }) => model.position.add(offset));

  const fovRad = (camera.fov * Math.PI) / 180;
  const dist = size.y / 2 / (0.78 * Math.tan(fovRad / 2));
  camera.position.set(0, size.y / 2, dist);
  camera.lookAt(0, size.y / 2, 0);
}

function switchTo(index, loop) {
  characters[current].model.visible = false;
  characters[current].action?.stop();
  current = index;
  const { model, action } = characters[current];
  model.visible = true;
  if (action) {
    action.setLoop(
      loop ? THREE.LoopRepeat : THREE.LoopOnce,
      loop ? Infinity : 1,
    );
    action.clampWhenFinished = !loop;
    action.reset().play();
  }
}

// 이동 방향으로 회전 (걷기·달리기)
function setFacing(dir) {
  const angle = dir === 1 ? Math.PI / 2 : -Math.PI / 2;
  characters.forEach(({ model }) => {
    model.rotation.y = angle;
  });
}

// 정면 (동의·복싱·스킬)
function setForward() {
  characters.forEach(({ model }) => {
    model.rotation.y = 0;
  });
}

function startWalking() {
  mode = "walk";
  setFacing(walkDir);
  switchTo(WALK_INDEX, true);
}

function onSpecialFinished() {
  startWalking();
  scheduleSpecial();
}

function scheduleSpecial() {
  clearTimeout(specialTimeout);
  const delay = SPECIAL_MIN + Math.random() * (SPECIAL_MAX - SPECIAL_MIN);
  specialTimeout = setTimeout(startSpecial, delay);
}

function startSpecial() {
  if (dragging) {
    scheduleSpecial();
    return;
  }

  // running vs stop 랜덤 선택 (running 25%, stop 75%)
  const allIndices = [RUN_INDEX, ...STOP_INDICES];
  const idx = allIndices[Math.floor(Math.random() * allIndices.length)];

  if (idx === RUN_INDEX) {
    mode = "run";
    setFacing(walkDir);
    switchTo(RUN_INDEX, false);
  } else {
    mode = "stop";
    setForward();
    switchTo(idx, false);
  }
}

// 드래그
const canvas = renderer.domElement;

canvas.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  dragging = true;
  lastMouseX = e.screenX;
  lastMouseY = e.screenY;
});
window.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  winX += e.screenX - lastMouseX;
  winY += e.screenY - lastMouseY;
  lastMouseX = e.screenX;
  lastMouseY = e.screenY;
  window.electronAPI.setWindowPos(winX, winY);
});
window.addEventListener("mouseup", () => {
  dragging = false;
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  window.electronAPI.showContextMenu();
});

// 렌더 루프
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if ((mode === "walk" || mode === "run") && !dragging) {
    const speed = mode === "run" ? RUN_SPEED : WALK_SPEED;
    winX += walkDir * speed;

    if (winX + W >= screenW) {
      winX = screenW - W;
      walkDir = -1;
      setFacing(walkDir);
    } else if (winX <= 0) {
      winX = 0;
      walkDir = 1;
      setFacing(walkDir);
    }

    window.electronAPI.setWindowPos(winX, winY);
  }

  characters[current]?.mixer.update(delta);
  renderer.render(scene, camera);
}
