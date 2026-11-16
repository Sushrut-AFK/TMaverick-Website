'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Group, Material, Mesh, MeshStandardMaterial, Vector3, WebGLRenderer } from 'three';
import { RotateCcw } from 'lucide-react';

export interface ExplodedCarHandle { setProgress: (progress: number) => void }
type Part = { object: Mesh; origin: Vector3; offset: Vector3; focus: number[]; material: MeshStandardMaterial; color: number };

// Replace the licensed demo GLB with Avira. Preserve each part's
// extras.explode (metres, Y up) and extras.focus (department indices).
export const ExplodedCar = forwardRef<ExplodedCarHandle, { active: number }>(function ExplodedCar({ active }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const output = useRef<HTMLOutputElement>(null);
  const progress = useRef(0);
  const manual = useRef(false);
  const activeRef = useRef(active);
  const draw = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [manualMode, setManualMode] = useState(false);
  function syncControl(value: number) {
    if (slider.current) slider.current.value = String(Math.round(value * 100));
    if (output.current) output.current.value = `${Math.round(value * 100)}%`;
  }
  useImperativeHandle(ref, () => ({ setProgress(value) {
    progress.current = Math.min(1, Math.max(0, value));
    if (!manual.current) draw.current?.();
  } }), []);
  useEffect(() => { activeRef.current = active; draw.current?.(); }, [active]);
  useEffect(() => {
    const container = host.current!;
    let disposed = false;
    let renderer: WebGLRenderer | undefined;
    let frame = 0;
    let model: Group | undefined;
    let cleanupScene: (() => void) | undefined;
    const abort = new AbortController();
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = async () => {
      observer.disconnect();
      try {
        const [THREE, { GLTFLoader }] = await Promise.all([import('three'), import('three/addons/loaders/GLTFLoader.js')]);
        if (disposed) return;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-3, 3, 2, -2, 0.1, 40);
        camera.position.set(3.4, 2.1, 4.8); camera.lookAt(0, 0.58, 0);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.5;
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.addEventListener('webglcontextlost', () => { if (!disposed) setStatus('error'); }, { signal: abort.signal });
        container.appendChild(renderer.domElement);
        scene.add(new THREE.HemisphereLight(0xe6f7ff, 0x536369, 3));
        const key = new THREE.DirectionalLight(0xffffff, 4); key.position.set(3, 6, 4); scene.add(key);
        const rim = new THREE.DirectionalLight(0x8dddee, 3); rim.position.set(-4, 3, -2); scene.add(rim);
        const base = new THREE.GridHelper(8, 24, 0x27383b, 0x182629); base.position.y = -0.2; scene.add(base);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({ color: 0x0c1517, transparent: true, opacity: 0.3 }));
        floor.rotation.x = -Math.PI / 2; floor.position.y = -0.21; scene.add(floor);
        const response = await fetch('/models/formula-student/demo.glb', { signal: abort.signal });
        if (!response.ok) throw new Error('Could not load demo model');
        const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), '/models/formula-student/');
        model = gltf.scene;
        if (disposed) { disposeModel(); return; }
        scene.add(model);
        const parts: Part[] = [];
        model.traverse(object => {
          if (!(object instanceof THREE.Mesh)) return;
          const material = (object.material as MeshStandardMaterial).clone();
          object.material = material;
          parts.push({ object, origin: object.position.clone(), offset: new THREE.Vector3(...(object.userData.explode || [0, 0, 0])), focus: object.userData.focus || [], material, color: material.color.getHex() });
        });
        let tilt = 0;
        const render = () => {
          frame = 0;
          if (disposed || !model || !renderer) return;
          const value = manual.current ? Number(slider.current?.value || 0) / 100 : motion.matches ? 0 : progress.current;
          if (!manual.current) syncControl(value);
          const eased = value * value * (3 - 2 * value);
          parts.forEach(part => {
            part.object.position.copy(part.origin).addScaledVector(part.offset, eased);
            const selected = part.focus.includes(activeRef.current);
            part.material.color.setHex(part.color);
            part.material.emissive.set(selected ? 0x08788d : 0x000000);
            part.material.emissiveIntensity = selected ? 0.28 : 0;
          });
          model.rotation.y = (motion.matches ? 0 : -0.12 + value * 0.24) + tilt;
          renderer.render(scene, camera);
          container.dataset.explode = value.toFixed(3);
        };
        const invalidate = () => { if (!frame && !disposed) frame = requestAnimationFrame(render); };
        draw.current = invalidate;
        const resize = new ResizeObserver(() => {
          if (!renderer || disposed) return;
          const { width, height } = container.getBoundingClientRect();
          const aspect = width / Math.max(height, 1);
          const halfHeight = aspect < 1.2 ? 2.1 : 1.8;
          camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect; camera.top = halfHeight + 0.25; camera.bottom = -halfHeight + 0.25; camera.updateProjectionMatrix();
          renderer.setSize(width, height); invalidate();
        });
        resize.observe(container);
        container.addEventListener('pointermove', event => {
          if (event.pointerType !== 'mouse' || motion.matches) return;
          const bounds = container.getBoundingClientRect(); tilt = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.13; invalidate();
        }, { signal: abort.signal });
        container.addEventListener('pointerleave', () => { tilt = 0; invalidate(); }, { signal: abort.signal });
        motion.addEventListener('change', invalidate);
        cleanupScene = () => { resize.disconnect(); motion.removeEventListener('change', invalidate); base.geometry.dispose(); (base.material as Material).dispose(); floor.geometry.dispose(); floor.material.dispose(); };
        container.dataset.ready = 'true';
        setStatus('ready'); invalidate();
      } catch (error) {
        if (!disposed && !(error instanceof DOMException && error.name === 'AbortError')) setStatus('error');
      }
    };
    function disposeModel() {
      model?.traverse(object => {
        const mesh = object as Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach(material => material.dispose());
      });
    }
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) void start(); }, { rootMargin: '500px' });
    observer.observe(container);
    return () => { disposed = true; abort.abort(); observer.disconnect(); cancelAnimationFrame(frame); draw.current = null; cleanupScene?.(); disposeModel(); renderer?.dispose(); renderer?.domElement.remove(); };
  }, []);
  return <div className="exploded-demo">
    <div className="demo-heading"><span className="demo-badge">TEMPORARY FSAE MODEL</span><span>NOT AVIRA 2.0</span></div>
    <div ref={host} className="exploded-canvas" role="img" aria-label="Interactive exploded view of an open-source Formula Student demo car, not Avira 2.0" data-explode="0">
      {status !== 'ready' && <div className="model-status" role="status">{status === 'error' ? <>3D preview unavailable.<span>You can still explore every department below.</span></> : <>Preparing the machine<span>Loading the open-source 3D assembly…</span></>}</div>}
      <span className="model-corner model-corner-tl" aria-hidden="true" /><span className="model-corner model-corner-br" aria-hidden="true" />
    </div>
    <div className="assembly-controls"><label htmlFor="assembly-separation">ASSEMBLED</label><input ref={slider} id="assembly-separation" type="range" min="0" max="100" defaultValue="0" aria-label="Car assembly separation" disabled={status !== 'ready'} onChange={event => { manual.current = true; setManualMode(true); if (output.current) output.current.value = `${event.target.value}%`; draw.current?.(); }} /><span>EXPLODED</span><output ref={output} htmlFor="assembly-separation">0%</output></div>
    <div className="demo-footer"><a href="https://github.com/simscape/Formula-Student-Vehicle-Simscape" target="_blank" rel="noopener noreferrer">MathWorks model · BSD licence ↗</a><button disabled={!manualMode} onClick={() => { manual.current = false; setManualMode(false); syncControl(progress.current); draw.current?.(); }}><RotateCcw size={12} />{manualMode ? 'Follow scroll' : 'Scroll to explore'}</button></div>
  </div>;
});
