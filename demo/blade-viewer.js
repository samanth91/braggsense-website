/**
 * 4-blade rotor viewer from Blade.step (blade.glb)
 * 32 clickable optical-fibre sensors (4 blades × 8 fibres)
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const FIBRE_PATHS = {
  C1: {
    points: [[17.4, 14.0, 150], [23.4, 12.5, 350], [11.6, 10.5, 600], [6.3, 7.8, 820]],
    color: 0xe53935,
  },
  C2: {
    points: [[20.4, -13.8, 150], [17.5, -12.9, 350], [9.9, -10.5, 600], [4.7, -7.7, 820]],
    color: 0xfb8c00,
  },
  C3: {
    points: [[-48.4, 4.0, 150], [-44.9, 5.0, 350], [-35.8, 4.0, 600], [-25.7, 3.0, 820]],
    color: 0x43a047,
  },
  C4: {
    points: [[113.0, 3.5, 150], [103.7, 4.0, 350], [84.0, 3.5, 600], [60.5, 2.5, 820]],
    color: 0x1e88e5,
  },
  C5: {
    points: [[-48.4, -4.0, 150], [-44.9, -5.0, 350], [-35.8, -4.0, 600], [-25.7, -3.0, 820]],
    color: 0x00acc1,
  },
  C6: {
    points: [[113.0, -3.5, 150], [103.7, -4.0, 350], [84.0, -3.5, 600], [60.5, -2.5, 820]],
    color: 0x5e35b1,
  },
  C7: {
    points: [[5.0, 4.0, 150], [4.5, 3.5, 350], [4.0, 3.0, 600], [3.0, 2.2, 820]],
    color: 0xd81b60,
  },
  C8: {
    points: [[5.0, -4.0, 150], [4.5, -3.5, 350], [4.0, -3.0, 600], [3.0, -2.2, 820]],
    color: 0x8e24aa,
  },
};

const FIBRE_NAMES = {
  C1: 'Suction Spar Cap',
  C2: 'Pressure Spar Cap',
  C3: 'Leading Edge (SS)',
  C4: 'Trailing Edge (SS)',
  C5: 'Leading Edge (PS)',
  C6: 'Trailing Edge (PS)',
  C7: 'Shear Web Side A',
  C8: 'Shear Web Side B',
};

const BLADE_TINTS = [0xc5d0e0, 0xb8d4c8, 0xd4c8b8, 0xc8b8d4];
const NUM_BLADES = 4;

class BladeViewer {
  constructor(container) {
    this.container = container;
    this.sensorMeshes = new Map(); // "B1-C1" -> mesh
    this.fibreGroups = new Map();
    this.bladeGroups = [];
    this.activeId = null; // "B1-C1"
    this.activeBlade = 1;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.template = null;
    this._init();
  }

  _init() {
    const w = this.container.clientWidth || 480;
    const h = this.container.clientHeight || 340;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeef3f9);

    this.camera = new THREE.PerspectiveCamera(42, w / h, 1, 8000);
    this.camera.position.set(0, 0, 2200);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 0, 0);
    this.controls.minDistance = 400;
    this.controls.maxDistance = 4500;

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(400, 600, 300);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xa8c4ff, 0.4);
    fill.position.set(-400, -100, 200);
    this.scene.add(fill);

    // Hub
    const hub = new THREE.Mesh(
      new THREE.SphereGeometry(55, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x2f6fed, metalness: 0.4, roughness: 0.35 })
    );
    this.scene.add(hub);

    // Nacelle hint
    const nacelle = new THREE.Mesh(
      new THREE.CylinderGeometry(40, 48, 160, 16),
      new THREE.MeshStandardMaterial({ color: 0x6b7a90, metalness: 0.3, roughness: 0.5 })
    );
    nacelle.rotation.z = Math.PI / 2;
    nacelle.position.x = -100;
    this.scene.add(nacelle);

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'blade3d-tooltip';
    this.tooltip.style.display = 'none';
    this.container.appendChild(this.tooltip);

    this.loadingEl = document.createElement('div');
    this.loadingEl.className = 'blade3d-loading';
    this.loadingEl.textContent = 'Loading 4-blade rotor from Blade.step…';
    this.container.appendChild(this.loadingEl);

    this.renderer.domElement.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    this.renderer.domElement.addEventListener('pointermove', (e) => this._onPointerMove(e));
    this.renderer.domElement.style.cursor = 'grab';
    window.addEventListener('resize', () => this._onResize());

    this._loadModel();
    this._animate();
  }

  async _loadModel() {
    const loader = new GLTFLoader();
    try {
      const gltf = await loader.loadAsync('blade.glb');
      this.template = gltf.scene;

      // Build 4 blades arranged as a rotor in the YZ plane (hub axis = +X into nacelle)
      // Original mesh: span along +Z (0→1000), root near Z=0
      for (let b = 0; b < NUM_BLADES; b++) {
        const bladeNum = b + 1;
        const group = new THREE.Group();
        group.name = `Blade${bladeNum}`;
        group.userData.blade = bladeNum;

        const mesh = this.template.clone(true);
        // Style
        mesh.traverse((obj) => {
          if (obj.isMesh) {
            obj.material = new THREE.MeshStandardMaterial({
              color: BLADE_TINTS[b],
              metalness: 0.22,
              roughness: 0.55,
              side: THREE.DoubleSide,
            });
          }
        });

        // Root at origin: original root ~ Z=0; tip +Z
        // Orient span outward in YZ plane, rotate around X (hub axis) by 90° * b
        const holder = new THREE.Group();
        holder.add(mesh);
        // rotate so blade span (+Z) goes to +Y first, then spin around X
        holder.rotation.x = (b * Math.PI) / 2;
        // small root offset from hub
        mesh.position.set(0, 0, 70);

        group.add(holder);
        this.scene.add(group);
        this.bladeGroups.push(group);

        // Sensors in local blade space (before holder rotation) – attach to holder
        this._placeSensorsOnBlade(holder, bladeNum);
      }

      this.camera.position.set(1800, 700, 900);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
      this.loadingEl.remove();
    } catch (err) {
      console.error(err);
      this.loadingEl.textContent = 'Failed to load blade.glb';
      this.loadingEl.classList.add('error');
    }
  }

  _placeSensorsOnBlade(parent, bladeNum) {
    Object.entries(FIBRE_PATHS).forEach(([fibreId, fibre]) => {
      const key = `B${bladeNum}-${fibreId}`;
      const fibreGroup = new THREE.Group();
      fibreGroup.name = key;
      fibreGroup.userData.sensorId = key;
      fibreGroup.userData.blade = bladeNum;
      fibreGroup.userData.fibre = fibreId;

      const pts = fibre.points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
      const curve = new THREE.CatmullRomCurve3(pts);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)),
        new THREE.LineBasicMaterial({ color: fibre.color, transparent: true, opacity: 0.8 })
      );
      fibreGroup.add(line);

      const beadGeo = new THREE.SphereGeometry(2.4, 10, 10);
      fibre.points.forEach((p) => {
        const bead = new THREE.Mesh(
          beadGeo,
          new THREE.MeshStandardMaterial({
            color: fibre.color,
            emissive: fibre.color,
            emissiveIntensity: 0.2,
          })
        );
        bead.position.set(...p);
        bead.userData.sensorId = key;
        bead.userData.isSensor = true;
        fibreGroup.add(bead);
      });

      const mainPos = fibre.points[2];
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(8.5, 16, 16),
        new THREE.MeshStandardMaterial({
          color: fibre.color,
          emissive: fibre.color,
          emissiveIntensity: 0.35,
          metalness: 0.15,
          roughness: 0.35,
        })
      );
      marker.position.set(...mainPos);
      marker.userData.sensorId = key;
      marker.userData.isSensor = true;
      marker.userData.isMain = true;
      fibreGroup.add(marker);

      const label = this._makeLabelSprite(`B${bladeNum}-${fibreId}`, fibre.color);
      label.position.set(mainPos[0], mainPos[1] + 20, mainPos[2]);
      label.userData.sensorId = key;
      label.userData.isSensor = true;
      // Only show labels on active blade to reduce clutter
      label.visible = bladeNum === 1;
      label.userData.isLabel = true;
      fibreGroup.add(label);

      parent.add(fibreGroup);
      this.sensorMeshes.set(key, marker);
      this.fibreGroups.set(key, fibreGroup);
    });
  }

  _makeLabelSprite(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 56;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    const r = 12;
    const w = 140;
    const h = 36;
    const x = 10;
    const y = 10;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 80, 28);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
    );
    sprite.scale.set(48, 17, 1);
    return sprite;
  }

  _pick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const targets = [];
    this.sensorMeshes.forEach((mesh, key) => {
      targets.push(mesh);
      const fg = this.fibreGroups.get(key);
      if (fg) {
        fg.traverse((o) => {
          if (o.isMesh && o.userData.isSensor) targets.push(o);
        });
      }
    });

    const hits = this.raycaster.intersectObjects(targets, false);
    return hits.length ? hits[0].object.userData.sensorId : null;
  }

  _onPointerDown(event) {
    if (event.button !== 0) return;
    const id = this._pick(event);
    if (id) {
      this.controls.enabled = false;
      event.stopPropagation();
      this.setActive(id);
      if (typeof window.onSensorPicked === 'function') {
        window.onSensorPicked(id);
      }
      const reenable = () => {
        this.controls.enabled = true;
        window.removeEventListener('pointerup', reenable);
      };
      window.addEventListener('pointerup', reenable);
    }
  }

  _onPointerMove(event) {
    const id = this._pick(event);
    this.renderer.domElement.style.cursor = id ? 'pointer' : 'grab';
    if (id) {
      const [b, c] = id.split('-');
      this.tooltip.style.display = 'block';
      this.tooltip.textContent = `${id} · ${FIBRE_NAMES[c] || c}`;
      const rect = this.container.getBoundingClientRect();
      this.tooltip.style.left = event.clientX - rect.left + 12 + 'px';
      this.tooltip.style.top = event.clientY - rect.top + 12 + 'px';
    } else {
      this.tooltip.style.display = 'none';
    }
  }

  setActiveBlade(bladeNum) {
    this.activeBlade = bladeNum;
    // Dim non-active blades slightly; show labels only on active
    this.bladeGroups.forEach((g) => {
      const active = g.userData.blade === bladeNum;
      g.traverse((obj) => {
        if (obj.isMesh && obj.material && !obj.userData.isSensor) {
          obj.material.opacity = active ? 1 : 0.45;
          obj.material.transparent = !active;
        }
        if (obj.userData.isLabel) {
          obj.visible = active;
        }
      });
    });
  }

  setActive(id) {
    // id: "B1-C1" or null
    this.activeId = id;
    if (id) {
      const blade = Number(id.split('-')[0].replace('B', ''));
      this.setActiveBlade(blade);
    }

    this.sensorMeshes.forEach((mesh, sid) => {
      const active = sid === id;
      mesh.scale.setScalar(active ? 1.4 : 1);
      if (mesh.material) {
        mesh.material.emissiveIntensity = active ? 0.9 : 0.3;
      }
      const fg = this.fibreGroups.get(sid);
      if (fg) {
        fg.traverse((o) => {
          if (o.isLine && o.material) {
            o.material.opacity = active ? 1 : 0.45;
          }
        });
      }
    });
  }

  _onResize() {
    const w = this.container.clientWidth || 480;
    const h = this.container.clientHeight || 340;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    if (this.activeId) {
      const mesh = this.sensorMeshes.get(this.activeId);
      if (mesh) {
        const s = 1.3 + Math.sin(performance.now() * 0.005) * 0.12;
        mesh.scale.setScalar(s);
      }
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

function bootViewer() {
  const el = document.getElementById('bladeStage');
  if (!el) return;
  window.bladeViewer = new BladeViewer(el);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootViewer);
} else {
  bootViewer();
}
