/* ============================================
   Three.js 3D Background Manager
   ============================================ */

class ThreeBackground {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x050508, 1);

    this.camera.position.z = 5;
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };
    this.particles = null;
    this.currentPreset = null;
    this.clock = new THREE.Clock();
    this.fog = null;

    this.presets = {
      landing: {
        count: 1200,
        color: 0xff2d55,
        color2: 0x9b59ff,
        size: 0.035,
        spread: 15,
        speed: 0.3,
        fogColor: 0x050508,
        fogDensity: 0.06,
      },
      about: {
        count: 1000,
        color: 0x00d4ff,
        color2: 0x9b59ff,
        size: 0.03,
        spread: 18,
        speed: 0.15,
        fogColor: 0x050510,
        fogDensity: 0.04,
      },
      skills: {
        count: 1500,
        color: 0x9b59ff,
        color2: 0x00d4ff,
        size: 0.025,
        spread: 12,
        speed: 0.5,
        fogColor: 0x08051a,
        fogDensity: 0.05,
      },
      projects: {
        count: 1100,
        color: 0x9b59ff,
        color2: 0x2d1b69,
        size: 0.03,
        spread: 16,
        speed: 0.2,
        fogColor: 0x050508,
        fogDensity: 0.07,
      },
      experience: {
        count: 1000,
        color: 0xffd700,
        color2: 0xff8c00,
        size: 0.03,
        spread: 14,
        speed: 0.25,
        fogColor: 0x0a0804,
        fogDensity: 0.05,
      },
      contact: {
        count: 1200,
        color: 0xdc143c,
        color2: 0x9b59ff,
        size: 0.03,
        spread: 15,
        speed: 0.35,
        fogColor: 0x080508,
        fogDensity: 0.05,
      }
    };

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  setPreset(name) {
    const p = this.presets[name];
    if (!p || this.currentPreset === name) return;
    this.currentPreset = name;

    // Remove old particles
    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      this.particles.material.dispose();
    }

    // Fog
    this.scene.fog = new THREE.FogExp2(p.fogColor, p.fogDensity);

    // Create particles
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(p.count * 3);
    const colors = new Float32Array(p.count * 3);
    const sizes = new Float32Array(p.count);

    const c1 = new THREE.Color(p.color);
    const c2 = new THREE.Color(p.color2);

    for (let i = 0; i < p.count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * p.spread;
      positions[i3 + 1] = (Math.random() - 0.5) * p.spread;
      positions[i3 + 2] = (Math.random() - 0.5) * p.spread;

      const t = Math.random();
      const col = c1.clone().lerp(c2, t);
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = Math.random() * p.size + p.size * 0.3;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: p.size,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
    this._speed = p.speed;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Smooth mouse follow
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    // Camera look
    this.camera.position.x = this.mouse.x * 0.5;
    this.camera.position.y = this.mouse.y * 0.3;
    this.camera.lookAt(0, 0, 0);

    // Rotate particles
    if (this.particles) {
      this.particles.rotation.y = elapsed * this._speed * 0.1;
      this.particles.rotation.x = Math.sin(elapsed * 0.1) * 0.1;

      // Subtle breathing
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsed + positions[i] * 0.5) * 0.001;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.ThreeBackground = ThreeBackground;
