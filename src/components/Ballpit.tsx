// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// // 1. Define the Interface so TypeScript knows these props exist
// interface BallpitProps {
//   count?: number;
//   colors?: number[];
//   followCursor?: boolean;
//   gravity?: number;
//   friction?: number;
//   wallBounce?: number;
// }

// const Ballpit = ({ 
//   count = 50, 
//   colors = [0xff4500, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff], 
//   followCursor = true,
//   gravity = 0.05,     // Added this
//   friction = 0.99,    // Added this
//   wallBounce = 0.95   // Added this
// }: BallpitProps) => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Dimensions
//     const width = containerRef.current.clientWidth;
//     const height = containerRef.current.clientHeight;

//     // Scene setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     containerRef.current.appendChild(renderer.domElement);

//     // Lights
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//     scene.add(ambientLight);
//     const pointLight = new THREE.PointLight(0xffffff, 1.5);
//     pointLight.position.set(10, 10, 10);
//     scene.add(pointLight);

//     // Spheres
//     const geometry = new THREE.SphereGeometry(0.6, 32, 32);
//     const spheres: any[] = [];

//     for (let i = 0; i < count; i++) {
//       const material = new THREE.MeshStandardMaterial({ 
//         color: colors[i % colors.length],
//         roughness: 0.2,
//         metalness: 0.1
//       });
//       const sphere = new THREE.Mesh(geometry, material);
      
//       // Random starting positions
//       sphere.position.set(
//         (Math.random() - 0.5) * 15,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 5
//       );
      
//       // Add velocity property to sphere object
//       sphere.userData.velocity = new THREE.Vector3(
//         (Math.random() - 0.5) * 0.2,
//         (Math.random() - 0.5) * 0.2,
//         (Math.random() - 0.5) * 0.2
//       );

//       scene.add(sphere);
//       spheres.push(sphere);
//     }

//     camera.position.z = 15;

//     // Animation Loop
//     let animationFrameId: number;
//     const animate = () => {
//       animationFrameId = requestAnimationFrame(animate);

//       spheres.forEach(s => {
//         const vel = s.userData.velocity;

//         // Apply Gravity (pulls down on the Y axis)
//         vel.y -= gravity * 0.1;

//         // Apply Friction (slows things down over time)
//         vel.multiplyScalar(friction);

//         // Update Position
//         s.position.add(vel);

//         // --- Wall Collisions (Bouncing) ---
//         // Bounce X (Left/Right)
//         if (Math.abs(s.position.x) > 12) {
//           s.position.x = Math.sign(s.position.x) * 12;
//           vel.x *= -wallBounce;
//         }
//         // Bounce Y (Floor/Ceiling)
//         if (Math.abs(s.position.y) > 7) {
//           s.position.y = Math.sign(s.position.y) * 7;
//           vel.y *= -wallBounce;
//         }
//         // Bounce Z (Front/Back)
//         if (Math.abs(s.position.z) > 5) {
//           s.position.z = Math.sign(s.position.z) * 5;
//           vel.z *= -wallBounce;
//         }
//       });

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Resize Handler
//     const handleResize = () => {
//       if (!containerRef.current) return;
//       const w = containerRef.current.clientWidth;
//       const h = containerRef.current.clientHeight;
//       renderer.setSize(w, h);
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//     };
//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       cancelAnimationFrame(animationFrameId);
//       if (containerRef.current && renderer.domElement) {
//         containerRef.current.removeChild(renderer.domElement);
//       }
//       geometry.dispose();
//       spheres.forEach(s => s.material.dispose());
//     };
//   }, [count, gravity, friction, wallBounce, colors]);

//   return <div ref={containerRef} className="w-full h-full" style={{ minHeight: '100vh' }} />;
// };

// export default Ballpit;

// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- Physics Engine ---
class BallPhysics {
  constructor(config) {
    this.config = config;
    this.positions = new Float32Array(config.count * 3);
    this.velocities = new Float32Array(config.count * 3);
    this.sizes = new Float32Array(config.count);
    this.center = new THREE.Vector3();
    this.init();
  }

  init() {
    for (let i = 0; i < this.config.count; i++) {
      const b = i * 3;
      this.sizes[i] = i === 0 ? this.config.size0 : THREE.MathUtils.randFloat(this.config.minSize, this.config.maxSize);
      this.positions[b] = THREE.MathUtils.randFloatSpread(10);
      this.positions[b + 1] = THREE.MathUtils.randFloatSpread(10);
      this.positions[b + 2] = THREE.MathUtils.randFloatSpread(5);
    }
  }

  update(delta) {
    const { count, gravity, friction, wallBounce, maxX, maxY, maxZ } = this.config;
    
    for (let i = 0; i < count; i++) {
      const b = i * 3;
      // Handle the "Follow Cursor" ball
      if (i === 0 && this.config.followCursor) {
        this.positions[b] += (this.center.x - this.positions[b]) * 0.12;
        this.positions[b+1] += (this.center.y - this.positions[b+1]) * 0.12;
        this.positions[b+2] += (this.center.z - this.positions[b+2]) * 0.12;
      } else {
        // Basic Physics
        this.velocities[b + 1] -= gravity;
        this.velocities[b] *= friction;
        this.velocities[b + 1] *= friction;
        this.velocities[b + 2] *= friction;
        
        this.positions[b] += this.velocities[b];
        this.positions[b + 1] += this.velocities[b + 1];
        this.positions[b + 2] += this.velocities[b + 2];
      }

      // Boundaries (Bouncing)
      const r = this.sizes[i];
      if (Math.abs(this.positions[b]) + r > maxX) {
        this.positions[b] = Math.sign(this.positions[b]) * (maxX - r);
        this.velocities[b] *= -wallBounce;
      }
      if (this.positions[b + 1] - r < -maxY) {
        this.positions[b + 1] = -maxY + r;
        this.velocities[b + 1] *= -wallBounce;
      }
      if (this.positions[b + 1] + r > maxY) {
        this.positions[b + 1] = maxY - r;
        this.velocities[b + 1] *= -wallBounce;
      }
      if (Math.abs(this.positions[b + 2]) + r > maxZ) {
        this.positions[b + 2] = Math.sign(this.positions[b + 2]) * (maxZ - r);
        this.velocities[b + 2] *= -wallBounce;
      }
    }

    // Ball-to-Ball Collisions
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const b1 = i * 3; const b2 = j * 3;
        const dx = this.positions[b1] - this.positions[b2];
        const dy = this.positions[b1 + 1] - this.positions[b2 + 1];
        const dz = this.positions[b1 + 2] - this.positions[b2 + 2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const minDrop = this.sizes[i] + this.sizes[j];
        
        if (dist < minDrop) {
          const overlap = (minDrop - dist) * 0.5;
          const nx = dx / dist; const ny = dy / dist; const nz = dz / dist;
          
          // Push balls apart
          if (i !== 0 || !this.config.followCursor) {
            this.positions[b1] += nx * overlap;
            this.positions[b1+1] += ny * overlap;
            this.velocities[b1] += nx * 0.01;
          }
          this.positions[b2] -= nx * overlap;
          this.positions[b2+1] -= ny * overlap;
          this.velocities[b2] -= nx * 0.01;
        }
      }
    }
  }
}

// --- Component ---
const Ballpit = ({ 
  count = 100, 
  gravity = 0.01, 
  friction = 0.9975, 
  followCursor = false,
  colors = [0x00f2ff, 0x7000ff, 0xff0055, 0x00ff44]
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const config = {
      count, gravity, friction, followCursor,
      wallBounce: 0.8, maxX: 5, maxY: 5, maxZ: 2,
      minSize: 0.4, maxSize: 0.9, size0: 1.2
    };

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 22;

    const physics = new BallPhysics(config);

    // Using MeshPhysicalMaterial with built-in Subsurface properties
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.2, // Makes them look waxy
      thickness: 0.5,    // Light depth
      clearcoat: 1.0,    // Shiny outer shell
      clearcoatRoughness: 0.1
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const colorObj = new THREE.Color();
    for (let i = 0; i < count; i++) {
      colorObj.setHex(colors[i % colors.length]);
      mesh.setColorAt(i, colorObj);
    }
    scene.add(mesh);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const spotLight = new THREE.DirectionalLight(0xffffff, 1.5);
    spotLight.position.set(5, 10, 10);
    scene.add(spotLight);

    const dummy = new THREE.Object3D();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const resize = () => {
      const parent = canvasRef.current.parentElement;
      if (!parent) return;
      const w = parent.clientWidth; const h = parent.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Adjust physics boundaries based on aspect ratio
      config.maxX = (camera.aspect * 18) / 2;
      config.maxY = 11 / 2;
    };
    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);
      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersect);
      physics.center.copy(intersect);
    };
    window.addEventListener('pointermove', onPointerMove);

    let animationId;
    const animate = () => {
      physics.update(0.016);
      for (let i = 0; i < count; i++) {
        const b = i * 3;
        dummy.position.set(physics.positions[b], physics.positions[b+1], physics.positions[b+2]);
        dummy.scale.setScalar(physics.sizes[i]);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [count, gravity, friction, followCursor]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Ballpit;