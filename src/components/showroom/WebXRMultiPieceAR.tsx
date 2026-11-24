"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { X, RotateCcw, RotateCw, Minus, Plus, Lock, Unlock, Trash2, Box } from 'lucide-react';
import type { FurniturePieceSpec, PlacedPiece } from './ShowroomRoomPlanner';
import type { StudioThemeColors } from './Real3DRoomScene';

// Live WebXR "immersive-ar" session (Android Chrome + ARCore):
// every furniture piece is its own object anchored to the hardware-detected floor,
// so each one can be placed, dragged, rotated, resized and height-calibrated independently.

interface ARPiece {
  instanceId: string;
  specId: string;
  name: string;
  url: string;
  widthCm: number;
  depthCm: number;
  heightCm: number;
  rotationDeg: number;
  scale: number;
  floorOffsetCm: number;
  locked: boolean;
}

interface WebXRMultiPieceARProps {
  availablePieces: FurniturePieceSpec[];
  placedPieces: PlacedPiece[];
  studioTheme: StudioThemeColors;
  onClose: () => void;
}

export async function isWebXRARSupported(): Promise<boolean> {
  try {
    const xr = typeof navigator !== 'undefined' ? (navigator as any).xr : null;
    if (!xr || typeof xr.isSessionSupported !== 'function') return false;
    return !!(await xr.isSessionSupported('immersive-ar'));
  } catch {
    return false;
  }
}

export function useWebXRARSupport(): boolean {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    let alive = true;
    isWebXRARSupported().then((ok) => {
      if (alive) setSupported(ok);
    });
    return () => {
      alive = false;
    };
  }, []);
  return supported;
}

const normDeg = (d: number) => Math.round(((d % 360) + 360) % 360);

export default function WebXRMultiPieceAR({
  availablePieces,
  placedPieces,
  studioTheme,
  onClose,
}: WebXRMultiPieceARProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const reticleRef = useRef<THREE.Group | null>(null);
  const loaderRef = useRef<GLTFLoader | null>(null);
  const sessionRef = useRef<any>(null);
  const hitSourceRef = useRef<any>(null);
  const transientSourceRef = useRef<any>(null);
  const groupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const bodiesRef = useRef<Map<string, THREE.Group>>(new Map());
  const ringsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const piecesRef = useRef<ARPiece[]>([]);
  const activeIdRef = useRef<string | null>(null);
  const pendingSpecRef = useRef<FurniturePieceSpec | null>(null);
  const pickPendingRef = useRef(false);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef(new THREE.Vector3());
  const multiTouchRef = useRef(false);
  const gestureRef = useRef<{
    id: string;
    dist: number;
    angle: number;
    scale: number;
    rot: number;
    liveScale: number;
    liveRot: number;
  } | null>(null);
  const floorFoundRef = useRef(false);
  const mountedRef = useRef(true);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [sessionActive, setSessionActive] = useState(false);
  const [floorFound, setFloorFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pieces, setPieces] = useState<ARPiece[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  piecesRef.current = pieces;
  activeIdRef.current = activeId;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((prev) => (prev === msg ? null : prev)), 2200);
  };

  const selectPiece = (id: string | null) => {
    activeIdRef.current = id;
    setActiveId(id);
  };

  const updatePiece = (id: string, patch: Partial<ARPiece>) => {
    setPieces((prev) => prev.map((p) => (p.instanceId === id ? { ...p, ...patch } : p)));
  };

  const applyTransform = (piece: ARPiece) => {
    const g = groupsRef.current.get(piece.instanceId);
    const body = bodiesRef.current.get(piece.instanceId);
    if (!g) return;
    g.rotation.y = THREE.MathUtils.degToRad(piece.rotationDeg);
    g.scale.setScalar(piece.scale);
    // Floor offset is expressed in real centimeters regardless of the piece scale
    if (body) body.position.y = piece.floorOffsetCm / 100 / piece.scale;
  };

  const addPieceToScene = (piece: ARPiece, pos: THREE.Vector3) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const pw = piece.widthCm / 100;
    const pd = piece.depthCm / 100;
    const ph = piece.heightCm / 100;
    const radius = Math.max(pw, pd) * 0.55;

    const root = new THREE.Group();
    root.position.copy(pos);
    const body = new THREE.Group();
    root.add(body);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(radius * 0.92, 32),
      new THREE.MeshBasicMaterial({ color: 0x1a1512, transparent: true, opacity: 0.26, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.003;
    root.add(shadow);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(radius * 1.0, radius * 1.08, 48),
      new THREE.MeshBasicMaterial({ color: 0xb5893a, side: THREE.DoubleSide, transparent: true, opacity: 0.95 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.006;
    ring.visible = false;
    root.add(ring);

    const placeholder = new THREE.Mesh(
      new THREE.BoxGeometry(pw, ph * 0.6, pd),
      new THREE.MeshStandardMaterial({ color: 0xd8cbb8, transparent: true, opacity: 0.45 })
    );
    placeholder.position.y = ph * 0.3;
    body.add(placeholder);

    loaderRef.current?.load(
      piece.url,
      (gltf) => {
        const obj = gltf.scene || new THREE.Group();
        const box = new THREE.Box3().setFromObject(obj);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        if (size.x > 0.01 && size.y > 0.01 && size.z > 0.01) {
          // Pin the lowest vertex exactly to the floor (y = 0) and center on X/Z
          obj.position.set(-center.x, -box.min.y, -center.z);
          const wrap = new THREE.Group();
          wrap.add(obj);
          wrap.scale.set(pw / size.x, ph / size.y, pd / size.z);
          body.remove(placeholder);
          body.add(wrap);
        }
      },
      undefined,
      () => {}
    );

    scene.add(root);
    groupsRef.current.set(piece.instanceId, root);
    bodiesRef.current.set(piece.instanceId, body);
    ringsRef.current.set(piece.instanceId, ring);
    applyTransform(piece);
  };

  const getReticlePos = () => {
    const ret = reticleRef.current;
    if (!ret || !ret.visible) return null;
    return new THREE.Vector3().setFromMatrixPosition(ret.matrix);
  };

  const getYawFacingCamera = (pos: THREE.Vector3) => {
    const renderer = rendererRef.current;
    if (!renderer) return 0;
    const camPos = new THREE.Vector3().setFromMatrixPosition(renderer.xr.getCamera().matrixWorld);
    return Math.atan2(camPos.x - pos.x, camPos.z - pos.z);
  };

  const spawnPiece = (spec: FurniturePieceSpec) => {
    const pos = getReticlePos();
    if (!pos) {
      pendingSpecRef.current = spec;
      showToast('Telefonu yere doğru tutun, yeşil halka görünce yerleşecek');
      return;
    }
    const yaw = getYawFacingCamera(pos);
    const pre = placedPieces.find((p) => p.id === spec.id);
    const piece: ARPiece = {
      instanceId: `${spec.id}-ar-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      specId: spec.id,
      name: spec.shortName,
      url: spec.url,
      widthCm: pre?.widthCm ?? spec.widthCm,
      depthCm: pre?.depthCm ?? spec.depthCm,
      heightCm: pre?.heightCm ?? spec.heightCm,
      rotationDeg: normDeg(THREE.MathUtils.radToDeg(yaw)),
      scale: pre?.scale ?? 1,
      floorOffsetCm: pre?.floorOffsetCm ?? 0,
      locked: false,
    };
    addPieceToScene(piece, pos);
    piecesRef.current = [...piecesRef.current, piece];
    setPieces((prev) => [...prev, piece]);
    selectPiece(piece.instanceId);
    showToast(`✓ ${piece.name} zemine oturdu: sürükle, iki parmakla çevir`);
  };

  const placeArrangedLayout = () => {
    const center = getReticlePos();
    if (!center) {
      showToast('Önce telefonu yere tutun, yeşil halka görünsün');
      return;
    }
    if (placedPieces.length === 0) return;
    const yaw = getYawFacingCamera(center);
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    let sumX = 0;
    let sumZ = 0;
    placedPieces.forEach((p) => {
      sumX += p.xCm + p.widthCm / 2;
      sumZ += p.yCm + p.depthCm / 2;
    });
    const cX = sumX / placedPieces.length;
    const cZ = sumZ / placedPieces.length;

    const created: ARPiece[] = placedPieces.map((item, idx) => {
      const dx = (item.xCm + item.widthCm / 2 - cX) / 100;
      const dz = (item.yCm + item.depthCm / 2 - cZ) / 100;
      const pos = new THREE.Vector3(center.x + dx * cos + dz * sin, center.y, center.z - dx * sin + dz * cos);
      const rotRad = yaw - THREE.MathUtils.degToRad(item.rotation);
      const piece: ARPiece = {
        instanceId: `${item.id}-ar-${Date.now()}-${idx}`,
        specId: item.id,
        name: item.shortName,
        url: item.url,
        widthCm: item.widthCm,
        depthCm: item.depthCm,
        heightCm: item.heightCm,
        rotationDeg: normDeg(THREE.MathUtils.radToDeg(rotRad)),
        scale: item.scale ?? 1,
        floorOffsetCm: item.floorOffsetCm ?? 0,
        locked: false,
      };
      addPieceToScene(piece, pos);
      return piece;
    });
    piecesRef.current = [...piecesRef.current, ...created];
    setPieces((prev) => [...prev, ...created]);
    selectPiece(created[0]?.instanceId || null);
    showToast(`✓ ${created.length} parça kuruldu, her birine dokunup ayrı ayrı oynatabilirsiniz`);
  };

  const removeActive = () => {
    const id = activeIdRef.current;
    if (!id) return;
    const g = groupsRef.current.get(id);
    if (g) sceneRef.current?.remove(g);
    groupsRef.current.delete(id);
    bodiesRef.current.delete(id);
    ringsRef.current.delete(id);
    const remaining = piecesRef.current.filter((p) => p.instanceId !== id);
    piecesRef.current = remaining;
    setPieces(remaining);
    selectPiece(remaining[remaining.length - 1]?.instanceId || null);
  };

  // Finger floor point (from WebXR transient-input hit test under the user's finger)
  const handleFingerFloorPoint = (pt: THREE.Vector3) => {
    if (pickPendingRef.current) {
      pickPendingRef.current = false;
      let bestId: string | null = null;
      let bestScore = Infinity;
      for (const [id, g] of Array.from(groupsRef.current.entries())) {
        const pc = piecesRef.current.find((x) => x.instanceId === id);
        if (!pc) continue;
        const radius = (Math.max(pc.widthCm, pc.depthCm) / 200) * pc.scale + 0.12;
        const score = Math.hypot(g.position.x - pt.x, g.position.z - pt.z) / radius;
        if (score < 1 && score < bestScore) {
          bestScore = score;
          bestId = id;
        }
      }

      if (bestId) {
        selectPiece(bestId);
        const g = groupsRef.current.get(bestId)!;
        const pc = piecesRef.current.find((x) => x.instanceId === bestId);
        dragOffsetRef.current.set(g.position.x - pt.x, 0, g.position.z - pt.z);
        draggingRef.current = !pc?.locked;
        if (pc?.locked) showToast(`🔒 ${pc.name} sabit. Kilidi açıp taşıyabilirsiniz`);
      } else {
        const id = activeIdRef.current;
        const g = id ? groupsRef.current.get(id) : undefined;
        const pc = piecesRef.current.find((x) => x.instanceId === id);
        if (g && pc && !pc.locked) {
          dragOffsetRef.current.set(0, 0, 0);
          g.position.set(pt.x, pt.y, pt.z);
          draggingRef.current = true;
        }
      }
      return;
    }

    if (draggingRef.current) {
      const id = activeIdRef.current;
      const g = id ? groupsRef.current.get(id) : undefined;
      if (g) {
        g.position.set(pt.x + dragOffsetRef.current.x, pt.y, pt.z + dragOffsetRef.current.z);
      }
    }
  };

  const onSelectStart = () => {
    if (multiTouchRef.current) return;
    if (transientSourceRef.current) pickPendingRef.current = true;
  };

  const onSelectEnd = () => {
    draggingRef.current = false;
    pickPendingRef.current = false;
  };

  // Fallback for browsers without transient-input hit testing: tap moves the active piece to the green reticle
  const onSelect = () => {
    if (transientSourceRef.current || multiTouchRef.current) return;
    const id = activeIdRef.current;
    const g = id ? groupsRef.current.get(id) : undefined;
    const pc = piecesRef.current.find((x) => x.instanceId === id);
    const pos = getReticlePos();
    if (g && pc && !pc.locked && pos) {
      g.position.copy(pos);
      showToast(`✓ ${pc.name} yeşil halkanın olduğu yere taşındı`);
    }
  };

  const onXRFrame = (_t: number, frame: any) => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;
    const refSpace = renderer.xr.getReferenceSpace();

    if (frame && refSpace) {
      const hs = hitSourceRef.current;
      const ret = reticleRef.current;
      if (hs && ret) {
        const results = frame.getHitTestResults(hs);
        if (results.length > 0) {
          const pose = results[0].getPose(refSpace);
          if (pose) {
            ret.visible = true;
            ret.matrix.fromArray(pose.transform.matrix);
            if (!floorFoundRef.current) {
              floorFoundRef.current = true;
              setFloorFound(true);
            }
          }
        } else {
          ret.visible = false;
        }
      }

      const ts = transientSourceRef.current;
      if (ts && (pickPendingRef.current || draggingRef.current) && !multiTouchRef.current) {
        const tResults = frame.getHitTestResultsForTransientInput(ts);
        if (tResults.length > 0 && tResults[0].results.length > 0) {
          const pose = tResults[0].results[0].getPose(refSpace);
          if (pose) {
            const p = pose.transform.position;
            handleFingerFloorPoint(new THREE.Vector3(p.x, p.y, p.z));
          }
        }
      }
    }

    if (pendingSpecRef.current && reticleRef.current?.visible) {
      const spec = pendingSpecRef.current;
      pendingSpecRef.current = null;
      spawnPiece(spec);
    }

    renderer.render(scene, camera);
  };

  const onSessionEnd = () => {
    try {
      hitSourceRef.current?.cancel?.();
      transientSourceRef.current?.cancel?.();
    } catch {}
    hitSourceRef.current = null;
    transientSourceRef.current = null;
    sessionRef.current = null;
    rendererRef.current?.setAnimationLoop(null);
    if (mountedRef.current) {
      setSessionActive(false);
      onCloseRef.current();
    }
  };

  const startSession = async () => {
    const renderer = rendererRef.current;
    if (!renderer || sessionRef.current) return;
    const xr = (navigator as any).xr;
    if (!xr) {
      setError('Bu tarayıcı canlı AR desteklemiyor.');
      return;
    }
    try {
      const session = await xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'local-floor'],
        domOverlay: overlayRef.current ? { root: overlayRef.current } : undefined,
      });
      sessionRef.current = session;
      renderer.xr.setReferenceSpaceType('local');
      await renderer.xr.setSession(session);

      const viewerSpace = await session.requestReferenceSpace('viewer');
      hitSourceRef.current = await session.requestHitTestSource({ space: viewerSpace });
      if (typeof session.requestHitTestSourceForTransientInput === 'function') {
        try {
          transientSourceRef.current = await session.requestHitTestSourceForTransientInput({
            profile: 'generic-touchscreen',
          });
        } catch {
          transientSourceRef.current = null;
        }
      }

      session.addEventListener('selectstart', onSelectStart);
      session.addEventListener('selectend', onSelectEnd);
      session.addEventListener('select', onSelect);
      session.addEventListener('end', onSessionEnd);

      setError(null);
      setSessionActive(true);
      renderer.setAnimationLoop(onXRFrame);
    } catch {
      sessionRef.current = null;
      setError('Canlı AR başlatılamadı. Aşağıdaki butona dokunup tekrar deneyin (telefonda “Google Play Hizmetleri – AR” yüklü olmalı).');
    }
  };

  const exitSession = () => {
    const s = sessionRef.current;
    if (s) {
      s.end().catch(() => onCloseRef.current());
    } else {
      onCloseRef.current();
    }
  };

  // Three.js renderer + scene (created once)
  useEffect(() => {
    mountedRef.current = true;
    setPortalReady(true);
    const host = canvasHostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    host.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfffaf0, 0x8a7a68, 1.45));
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(1.5, 4, 2);
    scene.add(dir);
    sceneRef.current = scene;
    cameraRef.current = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 40);

    const reticle = new THREE.Group();
    const outer = new THREE.Mesh(
      new THREE.RingGeometry(0.11, 0.135, 40),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
    );
    outer.rotation.x = -Math.PI / 2;
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(0.025, 20),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
    );
    dot.rotation.x = -Math.PI / 2;
    reticle.add(outer, dot);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
    reticleRef.current = reticle;

    loaderRef.current = new GLTFLoader();

    // Try to start immediately (still inside the user's tap activation window)
    startSession();

    return () => {
      mountedRef.current = false;
      const s = sessionRef.current;
      sessionRef.current = null;
      if (s) s.end().catch(() => {});
      renderer.setAnimationLoop(null);
      renderer.dispose();
      host.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep UI buttons from also triggering XR "select" (tap-on-floor) events
  useEffect(() => {
    const root = overlayRef.current;
    if (!root) return;
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest && target.closest('[data-xr-ui]')) e.preventDefault();
    };
    root.addEventListener('beforexrselect', handler);
    return () => root.removeEventListener('beforexrselect', handler);
  }, [portalReady]);

  // Sync React piece state -> 3D objects (rotation, size, floor height, selection ring)
  useEffect(() => {
    pieces.forEach((p) => {
      applyTransform(p);
      const ring = ringsRef.current.get(p.instanceId);
      if (ring) {
        ring.visible = p.instanceId === activeId || p.locked;
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.color.setHex(p.locked ? 0x10b981 : 0xb5893a);
        mat.opacity = p.instanceId === activeId ? 0.95 : 0.5;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieces, activeId]);

  // Two-finger twist = rotate, pinch = resize (on the active piece only)
  const onTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest && target.closest('[data-xr-ui]')) return;
    if (e.touches.length >= 2) {
      multiTouchRef.current = true;
      draggingRef.current = false;
      pickPendingRef.current = false;
      const id = activeIdRef.current;
      const pc = piecesRef.current.find((x) => x.instanceId === id);
      if (!id || !pc || pc.locked) return;
      const a = e.touches[0];
      const b = e.touches[1];
      gestureRef.current = {
        id,
        dist: Math.max(20, Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)),
        angle: Math.atan2(b.clientY - a.clientY, b.clientX - a.clientX),
        scale: pc.scale,
        rot: pc.rotationDeg,
        liveScale: pc.scale,
        liveRot: pc.rotationDeg,
      };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const gs = gestureRef.current;
    if (!gs || e.touches.length < 2) return;
    const a = e.touches[0];
    const b = e.touches[1];
    const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    const angle = Math.atan2(b.clientY - a.clientY, b.clientX - a.clientX);
    gs.liveScale = THREE.MathUtils.clamp(Number((gs.scale * (dist / gs.dist)).toFixed(2)), 0.5, 1.8);
    gs.liveRot = normDeg(gs.rot - THREE.MathUtils.radToDeg(angle - gs.angle));
    const g = groupsRef.current.get(gs.id);
    const body = bodiesRef.current.get(gs.id);
    const pc = piecesRef.current.find((x) => x.instanceId === gs.id);
    if (g) {
      g.rotation.y = THREE.MathUtils.degToRad(gs.liveRot);
      g.scale.setScalar(gs.liveScale);
      if (body && pc) body.position.y = pc.floorOffsetCm / 100 / gs.liveScale;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const gs = gestureRef.current;
    if (gs && e.touches.length < 2) {
      updatePiece(gs.id, { scale: gs.liveScale, rotationDeg: gs.liveRot });
      gestureRef.current = null;
    }
    if (e.touches.length === 0) multiTouchRef.current = false;
  };

  const activePiece = pieces.find((p) => p.instanceId === activeId) || null;

  const chipStyle = (isActive: boolean, isPlaced: boolean): React.CSSProperties =>
    isActive
      ? { backgroundColor: studioTheme.accentHex, color: '#FFFFFF', borderColor: studioTheme.accentHex }
      : isPlaced
      ? { backgroundColor: `${studioTheme.bgCard}F2`, color: studioTheme.textPrimary, borderColor: studioTheme.borderHex }
      : { backgroundColor: '#FFFFFFEE', color: studioTheme.textPrimary, borderColor: studioTheme.accentHex, borderStyle: 'dashed' };

  const smallBtn: React.CSSProperties = { backgroundColor: studioTheme.bgPage, color: studioTheme.textPrimary };

  const overlay = (
    <div
      ref={overlayRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      className="fixed inset-0 z-[400] select-none"
      style={{
        touchAction: 'none',
        backgroundColor: sessionActive ? 'transparent' : `${studioTheme.bgPage}F5`,
        color: studioTheme.textPrimary,
      }}
    >
      <div ref={canvasHostRef} className="hidden" />

      {!sessionActive && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div
            data-xr-ui
            className="max-w-sm w-full rounded-3xl p-5 space-y-3 border shadow-xl text-center"
            style={{ backgroundColor: studioTheme.bgCard, borderColor: studioTheme.borderHex }}
          >
            <h3 className="text-sm font-bold">Canlı AR: Parça Parça Yerleştir</h3>
            <p className="text-xs leading-relaxed" style={{ color: studioTheme.textMuted }}>
              Kamera açılınca telefonu yere doğru tutup yavaşça gezdirin. Yeşil halka zemini bulunca üstten istediğiniz
              parçayı seçin. Her parçayı ayrı ayrı sürükleyebilir, çevirebilir ve boyutlandırabilirsiniz.
            </p>
            {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
            <button
              type="button"
              onClick={startSession}
              className="w-full py-2.5 rounded-full text-xs font-bold text-white cursor-pointer"
              style={{ backgroundColor: '#10b981' }}
            >
              Kamerayı Aç &amp; Zemini Tara
            </button>
            <button
              type="button"
              onClick={exitSession}
              className="w-full py-2 rounded-full text-xs font-semibold border cursor-pointer"
              style={{ borderColor: studioTheme.borderHex }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {sessionActive && (
        <>
          {/* TOP: status + piece chips */}
          <div data-xr-ui className="absolute top-3 left-3 right-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold border shadow"
                style={{ backgroundColor: `${studioTheme.bgCard}EE`, borderColor: studioTheme.borderHex }}
              >
                {floorFound
                  ? '🟢 Zemin bulundu: parçayı seçin, parmakla sürükleyin'
                  : '📱 Telefonu yere tutup yavaşça gezdirin…'}
              </div>
              <button
                type="button"
                onClick={exitSession}
                className="p-2 rounded-full border shadow cursor-pointer"
                style={{ backgroundColor: `${studioTheme.bgCard}EE`, borderColor: studioTheme.borderHex }}
                title="AR'dan çık"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
              {availablePieces.map((spec) => {
                const placed = pieces.filter((p) => p.specId === spec.id);
                const isActive = !!activePiece && activePiece.specId === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => {
                      if (placed.length > 0) {
                        const next = isActive
                          ? spawnPiece(spec)
                          : selectPiece(placed[placed.length - 1].instanceId);
                        return next;
                      }
                      spawnPiece(spec);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border shadow whitespace-nowrap flex items-center gap-1 cursor-pointer"
                    style={chipStyle(isActive, placed.length > 0)}
                  >
                    {placed.length === 0 ? <Plus size={11} /> : placed.some((p) => p.locked) ? <Lock size={10} /> : null}
                    <span>
                      {spec.shortName}
                      {placed.length > 1 ? ` ×${placed.length}` : ''}
                    </span>
                  </button>
                );
              })}
              {placedPieces.length > 1 && (
                <button
                  type="button"
                  onClick={placeArrangedLayout}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border shadow whitespace-nowrap flex items-center gap-1 cursor-pointer text-white"
                  style={{ backgroundColor: '#10b981', borderColor: '#059669' }}
                >
                  <Box size={11} /> 3D&apos;de Dizdiğim {placedPieces.length} Parçayı Kur
                </button>
              )}
            </div>
            {activePiece && (
              <div className="text-[10px] font-semibold px-2" style={{ color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                Seçili parçaya tekrar dokunursanız bir tane daha ekler • Başka parçaya dokunarak seçin
              </div>
            )}
          </div>

          {toast && (
            <div
              className="absolute top-32 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold shadow-md border pointer-events-none whitespace-nowrap"
              style={{ backgroundColor: `${studioTheme.bgCard}F2`, borderColor: studioTheme.accentHex }}
            >
              {toast}
            </div>
          )}

          {/* BOTTOM: independent controls for the selected piece */}
          {activePiece && (
            <div
              data-xr-ui
              className="absolute bottom-3 left-3 right-3 rounded-2xl px-3 py-2.5 border shadow-xl flex flex-col gap-2"
              style={{ backgroundColor: `${studioTheme.bgCard}F2`, borderColor: studioTheme.borderHex }}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold leading-tight">{activePiece.name}</div>
                  <div className="text-[11px] font-semibold" style={{ color: studioTheme.accentHex }}>
                    {Math.round(activePiece.widthCm * activePiece.scale)} × {Math.round(activePiece.depthCm * activePiece.scale)} ×{' '}
                    {Math.round(activePiece.heightCm * activePiece.scale)} cm
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updatePiece(activePiece.instanceId, { locked: !activePiece.locked })}
                    className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 cursor-pointer"
                    style={
                      activePiece.locked
                        ? { backgroundColor: '#10b981', color: '#FFFFFF', borderColor: '#10b981' }
                        : { backgroundColor: studioTheme.bgPage, borderColor: studioTheme.borderHex }
                    }
                  >
                    {activePiece.locked ? <Lock size={11} /> : <Unlock size={11} />}
                    {activePiece.locked ? 'Sabit' : 'Sabitle'}
                  </button>
                  <button
                    type="button"
                    onClick={removeActive}
                    className="p-1.5 rounded-full border text-red-600 cursor-pointer"
                    style={{ backgroundColor: studioTheme.bgPage, borderColor: studioTheme.borderHex }}
                    title="Kaldır"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-semibold">
                {/* Rotate */}
                <div className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-full border" style={{ borderColor: studioTheme.borderHex }}>
                  <button
                    type="button"
                    disabled={activePiece.locked}
                    onClick={() => updatePiece(activePiece.instanceId, { rotationDeg: normDeg(activePiece.rotationDeg + 15) })}
                    className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40"
                    style={smallBtn}
                  >
                    <RotateCcw size={11} />
                  </button>
                  <span>{activePiece.rotationDeg}°</span>
                  <button
                    type="button"
                    disabled={activePiece.locked}
                    onClick={() => updatePiece(activePiece.instanceId, { rotationDeg: normDeg(activePiece.rotationDeg - 15) })}
                    className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40"
                    style={smallBtn}
                  >
                    <RotateCw size={11} />
                  </button>
                </div>

                {/* Size */}
                <div className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-full border" style={{ borderColor: studioTheme.borderHex }}>
                  <button
                    type="button"
                    disabled={activePiece.locked}
                    onClick={() =>
                      updatePiece(activePiece.instanceId, {
                        scale: Math.max(0.5, Number((activePiece.scale - 0.05).toFixed(2))),
                      })
                    }
                    className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40"
                    style={smallBtn}
                  >
                    <Minus size={11} />
                  </button>
                  <span>%{Math.round(activePiece.scale * 100)}</span>
                  <button
                    type="button"
                    disabled={activePiece.locked}
                    onClick={() =>
                      updatePiece(activePiece.instanceId, {
                        scale: Math.min(1.8, Number((activePiece.scale + 0.05).toFixed(2))),
                      })
                    }
                    className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40"
                    style={smallBtn}
                  >
                    <Plus size={11} />
                  </button>
                </div>

                {/* Floor height */}
                <div className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-full border" style={{ borderColor: '#10b981' }}>
                  <button
                    type="button"
                    disabled={activePiece.locked}
                    onClick={() =>
                      updatePiece(activePiece.instanceId, { floorOffsetCm: Math.max(-30, activePiece.floorOffsetCm - 1) })
                    }
                    className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40"
                    style={smallBtn}
                    title="Zemine indir"
                  >
                    <Minus size={11} />
                  </button>
                  <span>Zemin {activePiece.floorOffsetCm > 0 ? '+' : ''}{activePiece.floorOffsetCm}</span>
                  <button
                    type="button"
                    disabled={activePiece.locked}
                    onClick={() =>
                      updatePiece(activePiece.instanceId, { floorOffsetCm: Math.min(30, activePiece.floorOffsetCm + 1) })
                    }
                    className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40"
                    style={smallBtn}
                    title="Zeminden kaldır"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={355}
                step={5}
                disabled={activePiece.locked}
                value={activePiece.rotationDeg}
                onChange={(e) => updatePiece(activePiece.instanceId, { rotationDeg: Number(e.target.value) })}
                className="w-full cursor-pointer"
                style={{ accentColor: studioTheme.accentHex }}
              />
              <div className="text-[10px] text-center" style={{ color: studioTheme.textMuted }}>
                Tek parmak: parçayı sürükle • İki parmak: çevir / büyüt • Boş zemine dokun: seçili parça oraya gelir
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (!portalReady || typeof document === 'undefined') {
    return <div ref={canvasHostRef} className="hidden" />;
  }
  return createPortal(overlay, document.body);
}
