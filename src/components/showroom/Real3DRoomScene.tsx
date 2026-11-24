"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  DoorOpen, Eye, Compass, ZoomIn, ZoomOut, RotateCcw,
  Palette, Camera, CameraOff, Move, Lock
} from 'lucide-react';
import type { PlacedPiece } from './ShowroomRoomPlanner';

export const WALL_COLOR_OPTIONS = [
  { name: 'Gece Antrasit', hex: '#26242a', num: 0x26242a },
  { name: 'Sıcak Krem', hex: '#dfd7ca', num: 0xdfd7ca },
  { name: 'Adaçayı Yeşil', hex: '#46584e', num: 0x46584e },
  { name: 'Saf Beyaz', hex: '#ecece8', num: 0xecece8 },
  { name: 'Terracotta', hex: '#6e4234', num: 0x6e4234 },
];

export const FLOOR_TONE_OPTIONS = [
  { name: 'Doğal Meşe', rgb: [112, 82, 54] as [number, number, number], hex: '#705236' },
  { name: 'Koyu Ceviz', rgb: [64, 42, 26] as [number, number, number], hex: '#402a1a' },
  { name: 'İskandinav Açık', rgb: [168, 146, 118] as [number, number, number], hex: '#a89276' },
  { name: 'Gri Mermer', rgb: [125, 128, 132] as [number, number, number], hex: '#7d8084' },
];

export const FABRIC_SWATCH_LIST = [
  { name: 'Krem Boucle', hex: '#d8cbb8' },
  { name: 'Doğal Meşe', hex: '#c8ad86' },
  { name: 'Ceviz', hex: '#6b4428' },
  { name: 'Zümrüt Yeşili', hex: '#18523d' },
  { name: 'Antrasit', hex: '#2e333b' },
  { name: 'Safir Mavi', hex: '#1e3f6e' },
];

interface Real3DRoomSceneProps {
  placedPieces: PlacedPiece[];
  roomWidthCm: number;
  roomDepthCm: number;
  selectedColor: string;
  onChangeColor?: (colorName: string) => void;
  onTogglePieceOpen: (instanceId: string) => void;
  onToggleAllOpen: () => void;
  heightClass?: string;
  isFullScreen?: boolean;
  isCameraAR?: boolean;
  onToggleCameraAR?: () => void;
  activeInstanceId?: string | null;
  onSelectPiece3D?: (instanceId: string) => void;
  onMovePiece3D?: (instanceId: string, newXCm: number, newYCm: number) => void;
  onDropNewPiece3D?: (pieceId: string, dropXCm: number, dropYCm: number) => void;
  arManualScale?: number;
}

const PALETTES: Record<string, { main: number; wood: number; accent: number }> = {
  'Doğal Meşe': { main: 0xd6c7b2, wood: 0x7c5c3a, accent: 0x9c5a2d },
  'Ceviz': { main: 0x6b4428, wood: 0x3f2514, accent: 0xd4af37 },
  'Krem': { main: 0xe2d6c1, wood: 0x5c3d28, accent: 0x9c5a2d },
  'Krem Boucle': { main: 0xd8cbb8, wood: 0x4d3322, accent: 0x9c5a2d },
  'Antrasit': { main: 0x2e333b, wood: 0x1d2026, accent: 0x9c5a2d },
  'Zümrüt Yeşili': { main: 0x18523d, wood: 0x3b2718, accent: 0xd4af37 },
  'Safir Mavi': { main: 0x1e3f6e, wood: 0x2a3340, accent: 0xd4af37 },
  'Mat Siyah': { main: 0x222227, wood: 0x141418, accent: 0xd4af37 },
  'Beyaz Mermer': { main: 0xf0efeb, wood: 0x9e9589, accent: 0xd4af37 },
  'Altın Detaylı Beyaz': { main: 0xf5f2ea, wood: 0xc5a059, accent: 0xd4af37 },
  'Bej': { main: 0xd8cbb8, wood: 0x5c3d28, accent: 0x9c5a2d },
};

function createParquetTexture(baseRgb: [number, number, number]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = `rgb(${Math.max(0, baseRgb[0] - 18)}, ${Math.max(0, baseRgb[1] - 14)}, ${Math.max(0, baseRgb[2] - 10)})`;
    ctx.fillRect(0, 0, 512, 512);
    const plankW = 128;
    const plankH = 32;
    for (let y = 0; y < 512; y += plankH) {
      const offset = ((y / plankH) % 2) * (plankW / 2);
      for (let x = -plankW; x < 512 + plankW; x += plankW) {
        const shade = ((x * 7 + y * 13) % 22) - 11;
        const r = Math.min(255, Math.max(0, baseRgb[0] + shade));
        const g = Math.min(255, Math.max(0, baseRgb[1] + Math.round(shade * 0.8)));
        const b = Math.min(255, Math.max(0, baseRgb[2] + Math.round(shade * 0.6)));
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x + offset + 1, y + 1, plankW - 2, plankH - 2);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createGeometricPillowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#EAE2D6';
    ctx.fillRect(0, 0, 256, 256);
    const step = 64;
    for (let y = 0; y < 256; y += step) {
      for (let x = 0; x < 256; x += step) {
        ctx.fillStyle = '#4B382A';
        ctx.beginPath();
        ctx.moveTo(x + step / 2, y + 4);
        ctx.lineTo(x + step - 4, y + step / 2);
        ctx.lineTo(x + step / 2, y + step - 4);
        ctx.lineTo(x + 4, y + step / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#C9B8A3';
        ctx.beginPath();
        ctx.moveTo(x + step / 2, y + 16);
        ctx.lineTo(x + step - 16, y + step / 2);
        ctx.lineTo(x + step / 2, y + step - 16);
        ctx.lineTo(x + 16, y + step / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2B2119';
        ctx.beginPath();
        ctx.moveTo(x + step / 2, y + 25);
        ctx.lineTo(x + step - 25, y + step / 2);
        ctx.lineTo(x + step / 2, y + step - 25);
        ctx.lineTo(x + 25, y + step / 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface AnimTarget {
  type: 'door-left' | 'door-right' | 'drawer' | 'baza' | 'table-left' | 'table-right' | 'table-leaf';
  object: THREE.Object3D;
  instanceId: string;
  basePos: THREE.Vector3;
  baseRot: THREE.Euler;
}

export default function Real3DRoomScene({
  placedPieces,
  roomWidthCm,
  roomDepthCm,
  selectedColor,
  onChangeColor,
  onTogglePieceOpen,
  onToggleAllOpen,
  heightClass = 'h-[480px] sm:h-[600px]',
  isFullScreen = false,
  isCameraAR = false,
  onToggleCameraAR,
  activeInstanceId,
  onSelectPiece3D,
  onMovePiece3D,
  onDropNewPiece3D,
  arManualScale = 1,
}: Real3DRoomSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animTargetsRef = useRef<AnimTarget[]>([]);
  const pieceGroupsMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const selectionRingsMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const isDraggingPieceRef = useRef<boolean>(false);
  const openStateMapRef = useRef<Record<string, boolean>>({});
  const arManualScaleRef = useRef<number>(arManualScale);
  const isCameraARRef = useRef<boolean>(isCameraAR);

  const onToggleRef = useRef(onTogglePieceOpen);
  const onSelectRef = useRef(onSelectPiece3D);
  const onMoveRef = useRef(onMovePiece3D);
  const onDropNewRef = useRef(onDropNewPiece3D);

  const [lastClickedName, setLastClickedName] = useState<string | null>(null);
  const [wallIdx, setWallIdx] = useState<number>(0);
  const [floorIdx, setFloorIdx] = useState<number>(0);
  const [localColor, setLocalColor] = useState<string>(selectedColor);
  const [showStylePanel, setShowStylePanel] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);

  useEffect(() => {
    setLocalColor(selectedColor);
  }, [selectedColor]);

  onToggleRef.current = onTogglePieceOpen;
  onSelectRef.current = onSelectPiece3D;
  onMoveRef.current = onMovePiece3D;
  onDropNewRef.current = onDropNewPiece3D;
  arManualScaleRef.current = arManualScale;
  isCameraARRef.current = isCameraAR;

  // Constant-Visual-Scale Helper for Camera AR Mode:
  // Compensates for perspective distance so dragging a piece near the bottom or top of the phone screen NEVER auto-enlarges or shrinks it!
  const applyARLockedScale = (root: THREE.Group, cam: THREE.Camera | null) => {
    if (!isCameraARRef.current || !cam) {
      root.scale.set(1, 1, 1);
      return;
    }
    const refDist = 4.35;
    const dist = cam.position.distanceTo(root.position);
    const compensated = THREE.MathUtils.clamp((dist / refDist) * arManualScaleRef.current, 0.45, 1.85);
    root.scale.set(compensated, compensated, compensated);
  };

  // Manage Live Rear Camera Stream when isCameraAR is enabled
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (!isCameraAR) {
      setCameraReady(false);
      setCameraError(null);
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    const startRearCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError('Tarayıcı kamera erişimini desteklemiyor. Üstteki parçaları seçip sabit ölçekle köşelere yerleştirebilirsiniz.');
          return;
        }
        try {
          activeStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        } catch {
          activeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        if (videoRef.current && activeStream) {
          videoRef.current.srcObject = activeStream;
          await videoRef.current.play().catch(() => {});
          setCameraReady(true);
        }
      } catch {
        setCameraError('Kamera izni verilmedi. Üstteki parçalara tıklayıp parmağınızla sabit ölçekte köşelere yerleştirebilirsiniz.');
      }
    };

    startRearCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isCameraAR]);

  useEffect(() => {
    const map: Record<string, boolean> = {};
    placedPieces.forEach((p) => {
      map[p.instanceId] = !!p.isOpen;
    });
    openStateMapRef.current = map;
  }, [placedPieces]);

  const activeColorName = localColor || selectedColor;
  const activeWall = WALL_COLOR_OPTIONS[wallIdx] || WALL_COLOR_OPTIONS[0];
  const activeFloor = FLOOR_TONE_OPTIONS[floorIdx] || FLOOR_TONE_OPTIONS[0];

  // CRITICAL FIX: structureSignature ONLY includes piece geometry/dimensions/add/remove!
  // It DOES NOT include xCm, yCm, rotation, or activeInstanceId!
  // That way, touching, selecting, dragging, or rotating a piece on mobile NEVER rebuilds the WebGL canvas!
  const structureSignature = JSON.stringify({
    roomWidthCm,
    roomDepthCm,
    activeColorName,
    wallIdx,
    floorIdx,
    isCameraAR,
    isFullScreen,
    items: placedPieces.map((p) => ({
      id: p.instanceId,
      t: p.type,
      w: p.widthCm,
      d: p.depthCm,
      h: p.heightCm,
    })),
  });

  // In-place fast update of position, rotation, selection ring, and locked AR scale whenever xCm, yCm, rotation, activeInstanceId, or arManualScale change
  useEffect(() => {
    if (isDraggingPieceRef.current) return;
    const W = roomWidthCm / 100;
    const D = roomDepthCm / 100;
    const cam = cameraRef.current;

    placedPieces.forEach((item) => {
      const grp = pieceGroupsMapRef.current.get(item.instanceId);
      if (grp) {
        const cx = (item.xCm + item.widthCm / 2) / 100 - W / 2;
        const cz = (item.yCm + item.depthCm / 2) / 100 - D / 2;
        grp.position.set(cx, 0, cz);
        grp.rotation.y = -THREE.MathUtils.degToRad(item.rotation);
        grp.userData.widthCm = item.widthCm;
        grp.userData.depthCm = item.depthCm;
        applyARLockedScale(grp, cam);
      }
      const ring = selectionRingsMapRef.current.get(item.instanceId);
      if (ring) {
        ring.visible = item.instanceId === activeInstanceId;
      }
    });
  }, [placedPieces, activeInstanceId, roomWidthCm, roomDepthCm, arManualScale, isCameraAR]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    if (!isCameraAR) {
      scene.background = new THREE.Color(0x0c0d12);
      scene.fog = new THREE.FogExp2(0x0c0d12, 0.038);
    } else {
      scene.background = null;
      scene.fog = null;
    }

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    const W = roomWidthCm / 100;
    const D = roomDepthCm / 100;
    const H = 2.65;

    if (isCameraAR) {
      // Eye-level room camera angle looking straight into the user's real room floor
      camera.position.set(0, 2.05, D * 0.98);
    } else {
      camera.position.set(W * 0.85, 3.6, D * 1.15);
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    if (isCameraAR) {
      renderer.setClearColor(0x000000, 0);
    }
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 1.6;
    controls.maxDistance = 14;
    controls.target.set(0, isCameraAR ? 0.35 : 0.65, 0);
    // CRITICAL MOBILE FIX: In Camera AR mode, LOCK OrbitControls so touching/dragging on phone NEVER zooms or spins the room!
    if (isCameraAR) {
      controls.enabled = false;
      controls.enableZoom = false;
      controls.enableRotate = false;
      controls.enablePan = false;
    }
    controls.update();
    controlsRef.current = controls;

    // --- LIGHTING ---
    const hemi = new THREE.HemisphereLight(0xfff6e8, 0x26222e, isCameraAR ? 1.25 : 1.0);
    scene.add(hemi);

    const sunLight = new THREE.DirectionalLight(0xfff1dc, isCameraAR ? 2.1 : 1.85);
    sunLight.position.set(3.8, 6.2, 4.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 20;
    const shadowExtent = Math.max(W, D) * 0.85;
    sunLight.shadow.camera.left = -shadowExtent;
    sunLight.shadow.camera.right = shadowExtent;
    sunLight.shadow.camera.top = shadowExtent;
    sunLight.shadow.camera.bottom = -shadowExtent;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const warmFill = new THREE.PointLight(0xffd296, 1.25, 12);
    warmFill.position.set(-W * 0.3, 2.2, D * 0.25);
    scene.add(warmFill);

    // --- MATERIALS ---
    const pal = PALETTES[activeColorName] || PALETTES['Krem Boucle'];
    const matMain = new THREE.MeshStandardMaterial({ color: pal.main, roughness: 0.78, metalness: 0.02 });
    const matWood = new THREE.MeshStandardMaterial({ color: pal.wood, roughness: 0.42, metalness: 0.05 });
    const matWarmLeg = new THREE.MeshStandardMaterial({ color: 0x8d5228, roughness: 0.36, metalness: 0.05 });
    const matArmInsert = new THREE.MeshStandardMaterial({ color: 0xa45c2c, roughness: 0.3, metalness: 0.06 });
    const matInterior = new THREE.MeshStandardMaterial({ color: 0x3b2c20, roughness: 0.7 });
    const matGold = new THREE.MeshStandardMaterial({ color: pal.accent, roughness: 0.25, metalness: 0.82 });
    const matMirror = new THREE.MeshPhysicalMaterial({ color: 0xd6e6f2, roughness: 0.05, metalness: 0.92, clearcoat: 1.0 });
    const matSmokedGlass = new THREE.MeshPhysicalMaterial({
      color: 0x22262b,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.62,
      clearcoat: 1.0,
    });
    const matMarble = new THREE.MeshStandardMaterial({ color: 0xf4f2ee, roughness: 0.16, metalness: 0.05 });
    const geoPillowTex = createGeometricPillowTexture();
    const matGeoPillow = new THREE.MeshStandardMaterial({ map: geoPillowTex, roughness: 0.82 });
    const matPillow = new THREE.MeshStandardMaterial({ color: 0xf7f4ee, roughness: 0.85 });
    const matLamp = new THREE.MeshStandardMaterial({ color: 0xffecc2, emissive: 0xffc86b, emissiveIntensity: 0.65, roughness: 0.4 });
    const matWall = new THREE.MeshStandardMaterial({ color: activeWall.num, roughness: 0.88 });
    const matBaseboard = new THREE.MeshStandardMaterial({ color: 0x3b3532, roughness: 0.5 });

    // --- ROOM ARCHITECTURE vs CAMERA AR SHADOW FLOOR ---
    const floorTex = createParquetTexture(activeFloor.rgb);
    if (isCameraAR) {
      const shadowFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(W * 1.6, D * 1.6),
        new THREE.ShadowMaterial({ opacity: 0.42 })
      );
      shadowFloor.rotation.x = -Math.PI / 2;
      shadowFloor.position.set(0, 0.001, 0);
      shadowFloor.receiveShadow = true;
      scene.add(shadowFloor);

      const arGrid = new THREE.GridHelper(Math.max(W, D), 10, 0xd4af37, 0xffffff);
      const gridMat = arGrid.material as THREE.Material;
      gridMat.transparent = true;
      gridMat.opacity = 0.18;
      arGrid.position.set(0, 0.002, 0);
      scene.add(arGrid);
    } else {
      const floorMesh = new THREE.Mesh(
        new THREE.BoxGeometry(W + 0.24, 0.14, D + 0.24),
        new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.52, metalness: 0.05 })
      );
      floorMesh.position.set(0, -0.07, 0);
      floorMesh.receiveShadow = true;
      scene.add(floorMesh);

      const backWall = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, H, 0.12), matWall);
      backWall.position.set(0, H / 2, -D / 2 - 0.06);
      backWall.receiveShadow = true;
      scene.add(backWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, H, D + 0.12), matWall);
      leftWall.position.set(-W / 2 - 0.06, H / 2, 0);
      leftWall.receiveShadow = true;
      scene.add(leftWall);

      const bbBack = new THREE.Mesh(new THREE.BoxGeometry(W, 0.11, 0.025), matBaseboard);
      bbBack.position.set(0, 0.055, -D / 2 + 0.012);
      scene.add(bbBack);
      const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.11, D), matBaseboard);
      bbLeft.position.set(-W / 2 + 0.012, 0.055, 0);
      scene.add(bbLeft);

      const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.35, 1.55), matBaseboard);
      winFrame.position.set(-W / 2 + 0.02, 1.48, 0);
      scene.add(winFrame);
      const winGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 1.22, 1.42),
        new THREE.MeshStandardMaterial({ color: 0xaad8ff, emissive: 0x7cbfff, emissiveIntensity: 0.55, roughness: 0.1 })
      );
      winGlass.position.set(-W / 2 + 0.025, 1.48, 0);
      scene.add(winGlass);

      const rug = new THREE.Mesh(
        new THREE.BoxGeometry(W * 0.62, 0.014, D * 0.58),
        new THREE.MeshStandardMaterial({ color: 0xe5dccd, roughness: 0.96 })
      );
      rug.position.set(0, 0.007, D * 0.04);
      rug.receiveShadow = true;
      scene.add(rug);
    }

    // --- FURNITURE BUILDERS ---
    const animTargets: AnimTarget[] = [];
    const clickableRoots: THREE.Group[] = [];
    const groupsMap = new Map<string, THREE.Group>();
    const ringsMap = new Map<string, THREE.Mesh>();

    const mkBox = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const mkCyl = (r: number, h: number, mat: THREE.Material, x = 0, y = 0, z = 0, seg = 20) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    placedPieces.forEach((item) => {
      const root = new THREE.Group();
      root.userData = {
        instanceId: item.instanceId,
        name: item.name,
        widthCm: item.widthCm,
        depthCm: item.depthCm,
      };

      const pw = item.widthCm / 100;
      const pd = item.depthCm / 100;
      const ph = item.heightCm / 100;

      const cx = (item.xCm + item.widthCm / 2) / 100 - W / 2;
      const cz = (item.yCm + item.depthCm / 2) / 100 - D / 2;
      root.position.set(cx, 0, cz);
      root.rotation.y = -THREE.MathUtils.degToRad(item.rotation);

      // Selection ring on floor under the piece (toggled via ring.visible without rebuilding scene!)
      const ringGeo = new THREE.RingGeometry(Math.max(pw, pd) * 0.52, Math.max(pw, pd) * 0.57, 36);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(0, 0.008, 0);
      ringMesh.visible = item.instanceId === activeInstanceId;
      root.add(ringMesh);
      ringsMap.set(item.instanceId, ringMesh);

      if (item.type === 'wardrobe') {
        root.add(mkBox(pw, ph - 0.08, 0.04, matWood, 0, (ph + 0.08) / 2, -pd / 2 + 0.02));
        root.add(mkBox(0.04, ph - 0.08, pd, matWood, -pw / 2 + 0.02, (ph + 0.08) / 2, 0));
        root.add(mkBox(0.04, ph - 0.08, pd, matWood, pw / 2 - 0.02, (ph + 0.08) / 2, 0));
        root.add(mkBox(pw, 0.04, pd, matWood, 0, ph - 0.02, 0));
        root.add(mkBox(pw, 0.08, pd - 0.03, matGold, 0, 0.04, -0.01));
        root.add(mkBox(0.03, ph - 0.14, pd - 0.06, matInterior, -pw / 6, ph / 2, -0.02));
        root.add(mkBox(0.03, ph - 0.14, pd - 0.06, matInterior, pw / 6, ph / 2, -0.02));
        for (const sy of [ph * 0.25, ph * 0.45, ph * 0.66, ph * 0.84]) {
          root.add(mkBox(pw / 3 - 0.05, 0.025, pd - 0.1, matInterior, -pw / 3, sy, -0.02));
          root.add(mkBox(pw / 3 - 0.05, 0.025, pd - 0.1, matInterior, pw / 3, sy, -0.02));
        }
        const rail = mkCyl(0.014, pw / 3 - 0.06, matGold, 0, ph - 0.34, -0.02);
        rail.rotation.z = Math.PI / 2;
        root.add(rail);
        for (let ci = -2; ci <= 2; ci++) {
          root.add(mkBox(0.06, Math.min(0.72, ph * 0.35), Math.min(0.36, pd * 0.6), ci % 2 === 0 ? matMain : matPillow, ci * Math.min(0.11, pw * 0.05), ph - 0.72, -0.02));
        }
        const doorCount = pw >= 2.25 ? 6 : 4;
        const doorW = (pw - 0.06) / doorCount;
        for (let di = 0; di < doorCount; di++) {
          const isLeftHinge = di % 2 === 0;
          const hingeX = -pw / 2 + 0.03 + di * doorW + (isLeftHinge ? 0 : doorW);
          const pivot = new THREE.Group();
          pivot.position.set(hingeX, ph / 2 + 0.03, pd / 2);

          const midStart = Math.floor(doorCount / 2) - 1;
          const isMirror = di === midStart || di === midStart + 1;
          const doorMesh = mkBox(doorW - 0.012, ph - 0.12, 0.028, isMirror ? matMirror : matMain, isLeftHinge ? doorW / 2 : -doorW / 2, 0, 0);
          pivot.add(doorMesh);

          const handle = mkBox(0.02, 0.42, 0.035, matGold, isLeftHinge ? doorW - 0.06 : -doorW + 0.06, 0, 0.025);
          pivot.add(handle);

          root.add(pivot);
          animTargets.push({
            type: isLeftHinge ? 'door-left' : 'door-right',
            object: pivot,
            instanceId: item.instanceId,
            basePos: pivot.position.clone(),
            baseRot: pivot.rotation.clone(),
          });
        }
      } else if (item.type === 'bed') {
        for (const sx of [-pw / 2 + 0.1, pw / 2 - 0.1]) {
          for (const sz of [-pd / 2 + 0.12, pd / 2 - 0.12]) {
            root.add(mkCyl(0.025, 0.1, matGold, sx, 0.05, sz));
          }
        }
        root.add(mkBox(pw, 0.04, pd - 0.12, matInterior, 0, 0.12, 0.04));
        root.add(mkBox(pw, 0.28, 0.05, matMain, 0, 0.24, pd / 2 - 0.025));
        root.add(mkBox(0.05, 0.28, pd - 0.12, matMain, -pw / 2 + 0.025, 0.24, 0.04));
        root.add(mkBox(0.05, 0.28, pd - 0.12, matMain, pw / 2 - 0.025, 0.24, 0.04));
        root.add(mkBox(0.04, 0.24, pd - 0.24, matWood, 0, 0.23, 0.04));
        root.add(mkBox(pw * 0.36, 0.16, pd * 0.45, matPillow, -pw * 0.23, 0.22, 0.06));
        root.add(mkBox(pw * 0.36, 0.14, pd * 0.42, matGold, pw * 0.23, 0.21, 0.1));

        root.add(mkBox(pw + 0.14, ph, 0.1, matWood, 0, ph / 2, -pd / 2 + 0.04));
        for (let hi = 0; hi < 4; hi++) {
          const hx = -pw * 0.37 + hi * (pw * 0.245);
          root.add(mkBox(pw * 0.22, ph * 0.78, 0.06, matMain, hx, ph * 0.54, -pd / 2 + 0.1));
        }
        root.add(mkBox(pw + 0.16, 0.03, 0.03, matGold, 0, ph - 0.02, -pd / 2 + 0.09));

        const bazaPivot = new THREE.Group();
        bazaPivot.position.set(0, 0.38, -pd / 2 + 0.14);
        bazaPivot.add(mkBox(pw - 0.08, 0.24, pd - 0.18, matPillow, 0, 0.12, (pd - 0.18) / 2));
        bazaPivot.add(mkBox(pw - 0.04, 0.25, (pd - 0.18) * 0.65, matMain, 0, 0.125, (pd - 0.18) * 0.67));
        for (const px of [-pw * 0.24, pw * 0.24]) {
          const pil = mkBox(pw * 0.38, 0.14, 0.38, matPillow, px, 0.29, 0.26);
          pil.rotation.x = 0.22;
          bazaPivot.add(pil);
        }
        root.add(bazaPivot);
        animTargets.push({
          type: 'baza',
          object: bazaPivot,
          instanceId: item.instanceId,
          basePos: bazaPivot.position.clone(),
          baseRot: bazaPivot.rotation.clone(),
        });
      } else if (item.type === 'dresser' || item.type === 'nightstand' || item.type === 'console') {
        const legH = item.type === 'nightstand' ? 0.12 : 0.18;
        const bodyH = Math.max(0.35, ph - legH - 0.03);
        for (const sx of [-pw / 2 + 0.06, pw / 2 - 0.06]) {
          for (const sz of [-pd / 2 + 0.06, pd / 2 - 0.06]) {
            root.add(mkCyl(0.018, legH, matGold, sx, legH / 2, sz));
          }
        }
        root.add(mkBox(pw, bodyH, pd - 0.04, matWood, 0, legH + bodyH / 2, -0.02));
        root.add(mkBox(pw + 0.02, 0.03, pd + 0.02, matMarble, 0, legH + bodyH + 0.015, 0));

        const rows = item.type === 'nightstand' ? 2 : 3;
        const cols = item.type === 'nightstand' ? 1 : 2;
        const drW = (pw - 0.08) / cols;
        const drH = (bodyH - 0.06) / rows;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dx = cols === 1 ? 0 : (c === 0 ? -drW / 2 - 0.01 : drW / 2 + 0.01);
            const dy = legH + 0.03 + drH / 2 + r * drH;
            const drawerGrp = new THREE.Group();
            drawerGrp.position.set(dx, dy, pd / 2 - 0.02);
            drawerGrp.add(mkBox(drW - 0.02, drH - 0.02, 0.025, matMain, 0, 0, 0.01));
            drawerGrp.add(mkBox(Math.min(0.16, drW * 0.35), 0.016, 0.025, matGold, 0, 0, 0.03));
            drawerGrp.add(mkBox(drW - 0.06, drH * 0.72, pd * 0.65, matInterior, 0, -0.01, -pd * 0.33));
            root.add(drawerGrp);
            animTargets.push({
              type: 'drawer',
              object: drawerGrp,
              instanceId: item.instanceId,
              basePos: drawerGrp.position.clone(),
              baseRot: drawerGrp.rotation.clone(),
            });
          }
        }

        const topY = legH + bodyH + 0.03;
        if (item.type === 'nightstand') {
          root.add(mkCyl(0.06, 0.03, matGold, 0, topY + 0.015, 0));
          root.add(mkCyl(0.014, 0.22, matGold, 0, topY + 0.13, 0));
          root.add(mkCyl(0.11, 0.17, matLamp, 0, topY + 0.26, 0));
        } else if (item.type === 'dresser') {
          const mFrame = mkCyl(0.42, 0.03, matGold, 0, topY + 0.5, -pd / 2 + 0.05, 32);
          mFrame.rotation.x = Math.PI / 2;
          root.add(mFrame);
          const mGlass = mkCyl(0.39, 0.036, matMirror, 0, topY + 0.5, -pd / 2 + 0.05, 32);
          mGlass.rotation.x = Math.PI / 2;
          root.add(mGlass);
        } else {
          root.add(mkBox(pw * 0.68, 0.68, 0.03, matGold, 0, topY + 0.45, -pd / 2 + 0.05));
          root.add(mkBox(pw * 0.63, 0.62, 0.036, matMirror, 0, topY + 0.45, -pd / 2 + 0.05));
        }
      } else if (item.type === 'table') {
        root.add(mkBox(0.16, ph - 0.06, pd * 0.55, matWood, -pw * 0.28, (ph - 0.06) / 2, 0));
        root.add(mkBox(0.16, ph - 0.06, pd * 0.55, matWood, pw * 0.28, (ph - 0.06) / 2, 0));
        root.add(mkBox(0.22, 0.04, pd * 0.6, matGold, -pw * 0.28, 0.02, 0));
        root.add(mkBox(0.22, 0.04, pd * 0.6, matGold, pw * 0.28, 0.02, 0));
        const leftHalf = mkBox(pw / 2, 0.055, pd, matMarble, -pw / 4, ph - 0.028, 0);
        const rightHalf = mkBox(pw / 2, 0.055, pd, matMarble, pw / 4, ph - 0.028, 0);
        const centerLeaf = mkBox(0.42, 0.05, pd - 0.04, matGold, 0, ph - 0.09, 0);
        root.add(leftHalf, rightHalf, centerLeaf);
        animTargets.push(
          { type: 'table-left', object: leftHalf, instanceId: item.instanceId, basePos: leftHalf.position.clone(), baseRot: leftHalf.rotation.clone() },
          { type: 'table-right', object: rightHalf, instanceId: item.instanceId, basePos: rightHalf.position.clone(), baseRot: rightHalf.rotation.clone() },
          { type: 'table-leaf', object: centerLeaf, instanceId: item.instanceId, basePos: centerLeaf.position.clone(), baseRot: centerLeaf.rotation.clone() }
        );
      } else if (item.type === 'sofa3' || item.type === 'sofa2') {
        for (const sx of [-pw / 2 + 0.14, pw / 2 - 0.14]) {
          for (const sz of [-pd / 2 + 0.12, pd / 2 - 0.12]) {
            root.add(mkBox(0.065, 0.1, 0.065, matWarmLeg, sx, 0.05, sz));
          }
        }
        root.add(mkBox(0.055, 0.1, 0.055, matWarmLeg, 0, 0.05, 0));
        root.add(mkBox(pw - 0.02, 0.055, pd - 0.02, matWood, 0, 0.125, 0));

        const halfSeatW = pw / 2 - 0.015;
        root.add(mkBox(halfSeatW, 0.25, pd - 0.02, matMain, -halfSeatW / 2 - 0.006, 0.275, 0.01));
        root.add(mkBox(halfSeatW, 0.25, pd - 0.02, matMain, halfSeatW / 2 + 0.006, 0.275, 0.01));
        root.add(mkBox(pw - 0.06, 0.44, 0.17, matMain, 0, 0.6, -pd / 2 + 0.1));

        const armW = 0.25;
        const innerW = pw - armW * 2;
        const backCushW = innerW / 2 - 0.012;
        for (const side of [-1, 1]) {
          const bx = side * (backCushW / 2 + 0.006);
          const bc = mkBox(backCushW, 0.4, 0.19, matMain, bx, 0.59, -pd / 2 + 0.23);
          bc.rotation.x = -0.08;
          root.add(bc);
          const tuft = mkCyl(0.014, 0.02, matWood, bx, 0.6, -pd / 2 + 0.33, 14);
          tuft.rotation.x = Math.PI / 2;
          root.add(tuft);
        }

        for (const side of [-1, 1]) {
          const ax = side * (pw / 2 - armW / 2 - 0.01);
          root.add(mkBox(armW - 0.02, 0.36, pd * 0.48, matMain, ax, 0.56, -pd * 0.18));
          root.add(mkBox(armW, 0.21, pd * 0.78, matMain, ax, 0.485, pd * 0.05));
          const capsule = mkBox(armW * 0.56, 0.052, 0.035, matArmInsert, ax, 0.48, pd * 0.445);
          root.add(capsule);
        }

        for (const side of [-1, 1]) {
          const px = side * (pw / 2 - armW - 0.11);
          const pil = mkBox(0.36, 0.35, 0.11, matGeoPillow, px, 0.56, -pd / 2 + 0.36);
          pil.rotation.y = -side * 0.38;
          pil.rotation.x = 0.15;
          root.add(pil);
        }
      } else if (item.type === 'armchair') {
        for (const sx of [-pw / 2 + 0.05, pw / 2 - 0.05]) {
          root.add(mkBox(0.055, 0.26, 0.055, matWarmLeg, sx, 0.13, pd / 2 - 0.07));
          root.add(mkBox(0.055, 0.24, 0.055, matWarmLeg, sx, 0.12, -pd / 2 + 0.07));
        }
        root.add(mkBox(pw - 0.08, 0.035, pd - 0.08, matWarmLeg, 0, 0.11, 0));
        root.add(mkBox(pw - 0.08, 0.14, pd - 0.08, matMain, 0, 0.2, 0));
        root.add(mkBox(pw - 0.2, 0.22, pd - 0.12, matMain, 0, 0.36, 0.04));
        root.add(mkBox(pw - 0.04, 0.54, 0.18, matMain, 0, 0.55, -pd / 2 + 0.11));
        for (const side of [-1, 1]) {
          const arm = mkBox(0.15, 0.44, pd - 0.12, matMain, side * (pw / 2 - 0.085), 0.48, 0.01);
          root.add(arm);
        }
      } else if (item.type === 'coffeetable') {
        const legX = pw * 0.38;
        const legZ = pd * 0.36;
        for (const sx of [-legX, legX]) {
          for (const sz of [-legZ, legZ]) {
            root.add(mkBox(0.045, ph - 0.02, 0.045, matWarmLeg, sx, (ph - 0.02) / 2, sz));
          }
        }
        root.add(mkBox(pw * 0.76, 0.035, 0.035, matWarmLeg, 0, ph - 0.04, -legZ));
        root.add(mkBox(pw * 0.76, 0.035, 0.035, matWarmLeg, 0, ph - 0.04, legZ));
        root.add(mkBox(0.035, 0.035, pd * 0.72, matWarmLeg, -legX, 0.14, 0));
        root.add(mkBox(0.035, 0.035, pd * 0.72, matWarmLeg, legX, 0.14, 0));
        for (let si = -3; si <= 3; si++) {
          root.add(mkBox(pw * 0.75, 0.018, 0.042, matWarmLeg, 0, 0.15, si * (pd * 0.1)));
        }
        root.add(mkBox(pw, 0.018, pd, matSmokedGlass, 0, ph, 0));
      } else if (item.type === 'chair') {
        root.add(mkBox(pw, 0.08, pd, matMain, 0, 0.46, 0));
        root.add(mkBox(pw, 0.44, 0.08, matMain, 0, 0.7, -pd / 2 + 0.04));
        for (const sx of [-pw / 2 + 0.05, pw / 2 - 0.05]) {
          for (const sz of [-pd / 2 + 0.05, pd / 2 - 0.05]) {
            root.add(mkCyl(0.015, 0.44, matGold, sx, 0.22, sz));
          }
        }
      } else {
        root.add(mkBox(pw, ph * 0.55, pd, matMain, 0, ph * 0.72, 0));
        for (const sx of [-pw / 2 + 0.08, pw / 2 - 0.08]) {
          for (const sz of [-pd / 2 + 0.08, pd / 2 - 0.08]) {
            root.add(mkCyl(0.016, ph * 0.5, matGold, sx, ph * 0.25, sz));
          }
        }
      }

      applyARLockedScale(root, camera);
      scene.add(root);
      clickableRoots.push(root);
      groupsMap.set(item.instanceId, root);
    });

    animTargetsRef.current = animTargets;
    pieceGroupsMapRef.current = groupsMap;
    selectionRingsMapRef.current = ringsMap;

    // --- ROCK-SOLID MOBILE & DESKTOP 1-FINGER DRAG & TAP-TO-CORNER PLACEMENT ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersect = new THREE.Vector3();

    let dragState: {
      root: THREE.Group;
      instanceId: string;
      name: string;
      widthCm: number;
      depthCm: number;
      startX: number;
      startY: number;
      offsetX: number;
      offsetZ: number;
      moved: boolean;
    } | null = null;

    const getNormalizedPointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const highlightSelectedRing = (selectedId: string) => {
      selectionRingsMapRef.current.forEach((ring, id) => {
        ring.visible = id === selectedId;
      });
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      getNormalizedPointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableRoots, true);

      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.userData?.instanceId) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.instanceId) {
          const rootGrp = obj as THREE.Group;
          const instId = rootGrp.userData.instanceId as string;
          highlightSelectedRing(instId);
          onSelectRef.current?.(instId);

          let offsetX = 0;
          let offsetZ = 0;
          if (raycaster.ray.intersectPlane(floorPlane, planeIntersect)) {
            offsetX = rootGrp.position.x - planeIntersect.x;
            offsetZ = rootGrp.position.z - planeIntersect.z;
          }
          isDraggingPieceRef.current = true;
          dragState = {
            root: rootGrp,
            instanceId: instId,
            name: rootGrp.userData.name || 'Mobilya',
            widthCm: rootGrp.userData.widthCm || 100,
            depthCm: rootGrp.userData.depthCm || 100,
            startX: e.clientX,
            startY: e.clientY,
            offsetX,
            offsetZ,
            moved: false,
          };
          controls.enabled = false;
          try {
            renderer.domElement.setPointerCapture(e.pointerId);
          } catch {}
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragState || !e.isPrimary) return;
      if (!dragState.moved && Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY) > 5) {
        dragState.moved = true;
      }
      if (!dragState.moved) return;

      getNormalizedPointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(floorPlane, planeIntersect)) {
        const halfW = W * 0.65;
        const halfD = D * 0.65;
        const nextX = Math.max(-halfW, Math.min(halfW, planeIntersect.x + dragState.offsetX));
        const nextZ = Math.max(-halfD, Math.min(halfD, planeIntersect.z + dragState.offsetZ));
        dragState.root.position.set(nextX, 0, nextZ);
        // Keep constant locked visual scale so moving to any corner NEVER enlarges or shrinks the furniture!
        applyARLockedScale(dragState.root, camera);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragState) return;
      const finished = dragState;
      dragState = null;
      isDraggingPieceRef.current = false;
      if (!isCameraARRef.current) {
        controls.enabled = true;
      }
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {}

      if (finished.moved) {
        const newXCm = Math.round((finished.root.position.x + W / 2) * 100 - finished.widthCm / 2);
        const newYCm = Math.round((finished.root.position.z + D / 2) * 100 - finished.depthCm / 2);
        onMoveRef.current?.(finished.instanceId, newXCm, newYCm);
        setLastClickedName(`${finished.name} köşeye sabitlendi (Sabit Ölçek)`);
      } else {
        onToggleRef.current(finished.instanceId);
        setLastClickedName(`${finished.name} seçildi`);
      }
    };

    const handleDragOver3D = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop3D = (e: DragEvent) => {
      e.preventDefault();
      const pieceId = e.dataTransfer?.getData('application/qiens-piece-id');
      if (!pieceId) return;
      getNormalizedPointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(floorPlane, planeIntersect)) {
        const dropXCm = Math.round((planeIntersect.x + W / 2) * 100);
        const dropYCm = Math.round((planeIntersect.z + D / 2) * 100);
        onDropNewRef.current?.(pieceId, dropXCm, dropYCm);
      } else {
        onDropNewRef.current?.(pieceId, Math.round(roomWidthCm / 2), Math.round(roomDepthCm / 2));
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointercancel', handlePointerUp);
    renderer.domElement.addEventListener('dragover', handleDragOver3D);
    renderer.domElement.addEventListener('drop', handleDrop3D);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isCameraARRef.current) {
        controls.update();
      }

      const openMap = openStateMapRef.current;
      for (const target of animTargetsRef.current) {
        const isOpen = !!openMap[target.instanceId];
        if (target.type === 'door-left') {
          target.object.rotation.y += ((isOpen ? -1.3 : 0) - target.object.rotation.y) * 0.12;
        } else if (target.type === 'door-right') {
          target.object.rotation.y += ((isOpen ? 1.3 : 0) - target.object.rotation.y) * 0.12;
        } else if (target.type === 'drawer') {
          target.object.position.z += ((target.basePos.z + (isOpen ? 0.24 : 0)) - target.object.position.z) * 0.14;
        } else if (target.type === 'baza') {
          target.object.rotation.x += ((isOpen ? -0.66 : 0) - target.object.rotation.x) * 0.1;
        } else if (target.type === 'table-left') {
          target.object.position.x += ((target.basePos.x - (isOpen ? 0.22 : 0)) - target.object.position.x) * 0.12;
        } else if (target.type === 'table-right') {
          target.object.position.x += ((target.basePos.x + (isOpen ? 0.22 : 0)) - target.object.position.x) * 0.12;
        } else if (target.type === 'table-leaf') {
          target.object.position.y += ((target.basePos.y + (isOpen ? 0.062 : 0)) - target.object.position.y) * 0.12;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointercancel', handlePointerUp);
      renderer.domElement.removeEventListener('dragover', handleDragOver3D);
      renderer.domElement.removeEventListener('drop', handleDrop3D);
      controls.dispose();
      renderer.dispose();
      floorTex.dispose();
      geoPillowTex.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structureSignature]);

  const setCameraPreset = (preset: 'corner' | 'walk' | 'top') => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const W = roomWidthCm / 100;
    const D = roomDepthCm / 100;
    if (preset === 'corner') {
      cam.position.set(W * 0.85, 3.6, D * 1.15);
      ctrl.target.set(0, 0.65, 0);
    } else if (preset === 'walk') {
      cam.position.set(W * 0.35, 1.48, D * 0.72);
      ctrl.target.set(-0.2, 0.85, -D * 0.25);
    } else {
      cam.position.set(0, Math.max(W, D) * 1.35, 0.4);
      ctrl.target.set(0, 0, 0);
    }
    ctrl.update();
  };

  const adjustZoom = (factor: number) => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const dir = new THREE.Vector3().subVectors(cam.position, ctrl.target);
    dir.multiplyScalar(factor);
    if (dir.length() >= 1.6 && dir.length() <= 14) {
      cam.position.copy(ctrl.target).add(dir);
      ctrl.update();
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0e0f14] ${
        isFullScreen ? 'w-screen h-[100dvh] rounded-none border-0' : 'rounded-2xl border border-white/10 shadow-xl'
      }`}
    >
      {/* Live Rear Camera Feed Background when Camera AR Mode is Active */}
      {isCameraAR && (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1c1917] via-[#292524] to-[#1c1917]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!cameraReady && cameraError && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 max-w-md w-[92%] bg-black/80 backdrop-blur-md border border-amber-400/40 text-amber-200 px-3.5 py-2 rounded-xl text-[11px] text-center">
              {cameraError}
            </div>
          )}
        </div>
      )}

      {/* Step-by-Step Empty Room Onboarding Overlay when user hasn't dropped their first piece yet */}
      {placedPieces.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-none">
          <div className="max-w-md bg-black/75 backdrop-blur-xl border border-amber-400/40 rounded-3xl p-5 text-center space-y-2 shadow-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold">
              <Lock size={12} /> Sabit Ölçek Kilidi Aktif (Otomatik Büyütmez)
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-white">
              Üstteki Parçalardan Birine Dokunup Köşeye Yerleştirin
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Önce yukarıdan örneğin <strong>+ Tekli Berjer</strong>&apos;e tıklayın, gelen berjeri parmağınızla odanın köşesine çekin. Sonra yukarıdan <strong>+ 1. İkili Koltuk</strong>&apos;a tıklayıp diğer köşeye yerleştirin.
            </p>
          </div>
        </div>
      )}

      <div ref={mountRef} className={`relative z-10 w-full ${heightClass} cursor-grab active:cursor-grabbing touch-none`} />

      {/* Clean Minimal Top HUD (hidden in full-screen where the floating piece tray is shown at top) */}
      {!isFullScreen && (
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="bg-black/65 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-[11px] font-medium text-neutral-100 flex items-center gap-2 pointer-events-auto">
            <Move size={13} className="text-amber-400 shrink-0" />
            <span>
              {isCameraAR
                ? 'Sabit Ölçekli AR • Üstten parçaya tıklayın, parmağınızla köşeye sürükleyin'
                : 'Üstten istediğiniz parçaya tıklayın • Parmağınızla / fareyle köşeye sürükleyin'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            {onToggleCameraAR && (
              <button
                type="button"
                onClick={onToggleCameraAR}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border ${
                  isCameraAR
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                    : 'bg-amber-400 hover:bg-amber-300 text-black border-amber-400'
                }`}
              >
                {isCameraAR ? <CameraOff size={13} /> : <Camera size={13} />}
                {isCameraAR ? 'Kamerayı Kapat' : 'Odanda Gör (Tek Tek Kamera AR)'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowStylePanel(!showStylePanel)}
              className="px-3.5 py-1.5 rounded-full bg-black/65 hover:bg-white hover:text-black text-white border border-white/15 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Palette size={13} className="text-amber-300" /> Renk &amp; Parke
            </button>
            <button
              type="button"
              onClick={onToggleAllOpen}
              className="px-3.5 py-1.5 rounded-full bg-black/65 hover:bg-white hover:text-black text-white border border-white/15 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <DoorOpen size={13} className="text-emerald-400" /> Kapak / Baza Aç-Kapa
            </button>
          </div>
        </div>
      )}

      {/* Floating Right Side Quick Tools in Full-Screen Mode */}
      {isFullScreen && (
        <div className="absolute right-3 top-28 z-30 flex flex-col gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowStylePanel(!showStylePanel)}
            className="p-2.5 rounded-full bg-black/75 backdrop-blur-md text-amber-300 border border-white/15 shadow-lg cursor-pointer"
            title="Renk & Parke"
          >
            <Palette size={16} />
          </button>
        </div>
      )}

      {/* Live 3D Wall / Floor / Fabric Customizer Popover */}
      {showStylePanel && (
        <div className="absolute top-16 right-3 z-30 w-64 bg-[#14141b]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 space-y-3.5 shadow-2xl text-white">
          <div>
            <div className="text-[11px] font-medium text-neutral-300 mb-1.5">Mobilya Rengi ({activeColorName})</div>
            <div className="flex flex-wrap gap-2">
              {FABRIC_SWATCH_LIST.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => { setLocalColor(f.name); onChangeColor?.(f.name); }}
                  title={f.name}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${activeColorName === f.name ? 'border-amber-400 scale-110' : 'border-white/25'}`}
                  style={{ backgroundColor: f.hex }}
                />
              ))}
            </div>
          </div>
          {!isCameraAR && (
            <>
              <div>
                <div className="text-[11px] font-medium text-neutral-300 mb-1.5">Duvar Rengi</div>
                <div className="flex flex-wrap gap-2">
                  {WALL_COLOR_OPTIONS.map((w, idx) => (
                    <button
                      key={w.name}
                      type="button"
                      onClick={() => setWallIdx(idx)}
                      title={w.name}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${wallIdx === idx ? 'border-amber-400 scale-110' : 'border-white/25'}`}
                      style={{ backgroundColor: w.hex }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-neutral-300 mb-1.5">Zemin Parke</div>
                <div className="flex flex-wrap gap-2">
                  {FLOOR_TONE_OPTIONS.map((fl, idx) => (
                    <button
                      key={fl.name}
                      type="button"
                      onClick={() => setFloorIdx(idx)}
                      title={fl.name}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${floorIdx === idx ? 'border-amber-400 scale-110' : 'border-white/25'}`}
                      style={{ backgroundColor: fl.hex }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {lastClickedName && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-black/75 border border-white/15 text-neutral-200 px-3.5 py-1 rounded-full text-[11px] font-medium pointer-events-none whitespace-nowrap">
          {lastClickedName}
        </div>
      )}

      {/* Subtle Bottom Camera Bar (hidden in full-screen or Camera AR where OrbitControls is locked) */}
      {!isFullScreen && !isCameraAR && (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 p-1 rounded-full pointer-events-auto text-[11px] font-medium">
            <button type="button" onClick={() => setCameraPreset('corner')} className="px-3 py-1 rounded-full text-white hover:bg-white/15 flex items-center gap-1 cursor-pointer">
              <Compass size={12} /> Köşe
            </button>
            <button type="button" onClick={() => setCameraPreset('walk')} className="px-3 py-1 rounded-full text-white hover:bg-white/15 flex items-center gap-1 cursor-pointer">
              <Eye size={12} /> Göz Hizası
            </button>
            <button type="button" onClick={() => setCameraPreset('top')} className="px-3 py-1 rounded-full text-white hover:bg-white/15 flex items-center gap-1 cursor-pointer">
              <RotateCcw size={12} /> Üstten
            </button>
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 p-1 rounded-full pointer-events-auto">
            <button type="button" onClick={() => adjustZoom(0.82)} className="p-1.5 rounded-full hover:bg-white/15 text-white cursor-pointer" title="Yakınlaş">
              <ZoomIn size={14} />
            </button>
            <button type="button" onClick={() => adjustZoom(1.22)} className="p-1.5 rounded-full hover:bg-white/15 text-white cursor-pointer" title="Uzaklaş">
              <ZoomOut size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
