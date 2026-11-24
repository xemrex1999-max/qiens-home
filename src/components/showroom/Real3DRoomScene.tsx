"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  DoorOpen, Eye, Compass, ZoomIn, ZoomOut, RotateCcw,
  Palette, Check
} from 'lucide-react';
import type { PlacedPiece } from './ShowroomRoomPlanner';

export const WALL_COLOR_OPTIONS = [
  { name: 'Sıcak Krem', hex: '#eae3d5', num: 0xeae3d5 },
  { name: 'Saf Beyaz', hex: '#f5f4f0', num: 0xf5f4f0 },
  { name: 'Adaçayı Yeşil', hex: '#54685c', num: 0x54685c },
  { name: 'Gece Antrasit', hex: '#2b2930', num: 0x2b2930 },
  { name: 'Terracotta', hex: '#7c4d3e', num: 0x7c4d3e },
];

export const FLOOR_TONE_OPTIONS = [
  { name: 'İskandinav Açık Meşe', rgb: [182, 158, 128] as [number, number, number], hex: '#b69e80' },
  { name: 'Doğal Meşe', rgb: [132, 98, 66] as [number, number, number], hex: '#846242' },
  { name: 'Koyu Ceviz', rgb: [76, 50, 32] as [number, number, number], hex: '#4c3220' },
  { name: 'Bej Mermer', rgb: [212, 204, 192] as [number, number, number], hex: '#d4ccc0' },
];

export const FABRIC_SWATCH_LIST = [
  { name: 'Krem Boucle', hex: '#d8cbb8' },
  { name: 'Doğal Meşe', hex: '#c8ad86' },
  { name: 'Ceviz', hex: '#6b4428' },
  { name: 'Zümrüt Yeşili', hex: '#18523d' },
  { name: 'Antrasit', hex: '#2e333b' },
  { name: 'Safir Mavi', hex: '#1e3f6e' },
];

export interface StudioThemeColors {
  bgPage: string;
  bgCard: string;
  textPrimary: string;
  textMuted: string;
  accentHex: string;
  borderHex: string;
  sceneBgHex: number;
}

export const DEFAULT_LIGHT_STUDIO_THEME: StudioThemeColors = {
  bgPage: '#F6F3EC',
  bgCard: '#FAF8F4',
  textPrimary: '#261E19',
  textMuted: '#786B5E',
  accentHex: '#B5893A',
  borderHex: '#E4DCCF',
  sceneBgHex: 0xf2ede4,
};

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
  onScaleRotatePiece3D?: (instanceId: string, newScale: number, newRotation: number) => void;
  onDropNewPiece3D?: (pieceId: string, dropXCm: number, dropYCm: number) => void;
  studioTheme?: StudioThemeColors;
  eraserTrigger?: number;
  resetCameraTrigger?: number;
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
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = `rgb(${Math.max(0, baseRgb[0] - 18)}, ${Math.max(0, baseRgb[1] - 14)}, ${Math.max(0, baseRgb[2] - 10)})`;
    ctx.fillRect(0, 0, 256, 256);
    const plankW = 64;
    const plankH = 16;
    for (let y = 0; y < 256; y += plankH) {
      const offset = ((y / plankH) % 2) * (plankW / 2);
      for (let x = -plankW; x < 256 + plankW; x += plankW) {
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
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#EAE2D6';
    ctx.fillRect(0, 0, 128, 128);
    const step = 32;
    for (let y = 0; y < 128; y += step) {
      for (let x = 0; x < 128; x += step) {
        ctx.fillStyle = '#4B382A';
        ctx.beginPath();
        ctx.moveTo(x + step / 2, y + 2);
        ctx.lineTo(x + step - 2, y + step / 2);
        ctx.lineTo(x + step / 2, y + step - 2);
        ctx.lineTo(x + 2, y + step / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#C9B8A3';
        ctx.beginPath();
        ctx.moveTo(x + step / 2, y + 8);
        ctx.lineTo(x + step - 8, y + step / 2);
        ctx.lineTo(x + step / 2, y + step - 8);
        ctx.lineTo(x + 8, y + step / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2B2119';
        ctx.beginPath();
        ctx.moveTo(x + step / 2, y + 12);
        ctx.lineTo(x + step - 12, y + step / 2);
        ctx.lineTo(x + step / 2, y + step - 12);
        ctx.lineTo(x + 12, y + step / 2);
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
  activeInstanceId,
  onSelectPiece3D,
  onMovePiece3D,
  onScaleRotatePiece3D,
  onDropNewPiece3D,
  studioTheme = DEFAULT_LIGHT_STUDIO_THEME,
  eraserTrigger = 0,
  resetCameraTrigger = 0,
}: Real3DRoomSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const eraserCanvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const worldAnchorRef = useRef<THREE.Group | null>(null);
  const animTargetsRef = useRef<AnimTarget[]>([]);
  const pieceGroupsMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const selectionRingsMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const isInteractingRef = useRef<boolean>(false);
  const openStateMapRef = useRef<Record<string, boolean>>({});
  const isCameraARRef = useRef<boolean>(isCameraAR);
  const activeIdRef = useRef<string | null>(activeInstanceId || null);

  // Optical-Flow + Gyroscope World Anchor Offset so furniture stays locked to the real room floor when camera moves!
  const arWorldOffsetRef = useRef<{ x: number; z: number; yawRad: number }>({ x: 0, z: 0, yawRad: 0 });
  const prevGyroRef = useRef<{ alpha: number; beta: number; gamma: number } | null>(null);

  const onToggleRef = useRef(onTogglePieceOpen);
  const onSelectRef = useRef(onSelectPiece3D);
  const onMoveRef = useRef(onMovePiece3D);
  const onScaleRotateRef = useRef(onScaleRotatePiece3D);
  const onDropNewRef = useRef(onDropNewPiece3D);

  const [wallIdx, setWallIdx] = useState<number>(0);
  const [floorIdx, setFloorIdx] = useState<number>(0);
  const [localColor, setLocalColor] = useState<string>(selectedColor);
  const [showStylePanel, setShowStylePanel] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [floorSnapToast, setFloorSnapToast] = useState<string | null>(null);

  // AI Room Furniture Eraser ("Eski Eşyayı Sil") state
  const [eraserMode, setEraserMode] = useState<boolean>(false);
  const [hasCleanedRoomBg, setHasCleanedRoomBg] = useState<boolean>(false);
  const isErasingBrushRef = useRef<boolean>(false);

  useEffect(() => {
    setLocalColor(selectedColor);
  }, [selectedColor]);

  onToggleRef.current = onTogglePieceOpen;
  onSelectRef.current = onSelectPiece3D;
  onMoveRef.current = onMovePiece3D;
  onScaleRotateRef.current = onScaleRotatePiece3D;
  onDropNewRef.current = onDropNewPiece3D;
  isCameraARRef.current = isCameraAR;
  activeIdRef.current = activeInstanceId || null;

  const triggerFloorSnapFeedback = (msg: string) => {
    setFloorSnapToast(msg);
    setTimeout(() => {
      setFloorSnapToast((prev) => (prev === msg ? null : prev));
    }, 1800);
  };

  // Automatic Gyroscope Listener in Camera AR mode (locks furniture to the room floor as phone tilts/pans)
  useEffect(() => {
    if (!isCameraAR) {
      prevGyroRef.current = null;
      arWorldOffsetRef.current = { x: 0, z: 0, yawRad: 0 };
      return;
    }
    const handleOrientation = (ev: DeviceOrientationEvent) => {
      if (ev.alpha === null || ev.beta === null || ev.gamma === null || isInteractingRef.current) return;
      const prev = prevGyroRef.current;
      if (!prev) {
        prevGyroRef.current = { alpha: ev.alpha, beta: ev.beta, gamma: ev.gamma };
        return;
      }
      let dAlpha = ev.alpha - prev.alpha;
      if (dAlpha > 180) dAlpha -= 360;
      if (dAlpha < -180) dAlpha += 360;
      const dBeta = ev.beta - prev.beta;
      prevGyroRef.current = { alpha: ev.alpha, beta: ev.beta, gamma: ev.gamma };

      if (Math.abs(dAlpha) < 35 && Math.abs(dBeta) < 35) {
        arWorldOffsetRef.current.x = THREE.MathUtils.clamp(
          arWorldOffsetRef.current.x + dAlpha * 0.048,
          -4.5,
          4.5
        );
        arWorldOffsetRef.current.z = THREE.MathUtils.clamp(
          arWorldOffsetRef.current.z + dBeta * 0.038,
          -3.5,
          3.5
        );
        arWorldOffsetRef.current.yawRad = THREE.MathUtils.clamp(
          arWorldOffsetRef.current.yawRad + THREE.MathUtils.degToRad(dAlpha * 0.65),
          -Math.PI,
          Math.PI
        );
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isCameraAR]);

  // Trigger AI Eraser from parent dock button
  useEffect(() => {
    if (eraserTrigger > 0 && isCameraAR) {
      startEraserOnCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eraserTrigger]);

  // Reset cleaned camera background when requested
  useEffect(() => {
    if (resetCameraTrigger > 0) {
      setHasCleanedRoomBg(false);
      setEraserMode(false);
      arWorldOffsetRef.current = { x: 0, z: 0, yawRad: 0 };
    }
  }, [resetCameraTrigger]);

  const startEraserOnCamera = () => {
    const video = videoRef.current;
    const canvas = eraserCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.parentElement?.clientWidth || 1080;
    const h = canvas.parentElement?.clientHeight || 720;
    canvas.width = w;
    canvas.height = h;

    if (!hasCleanedRoomBg) {
      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        ctx.drawImage(video, 0, 0, w, h);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#E8E0D2');
        grad.addColorStop(0.58, '#DDD3C2');
        grad.addColorStop(0.59, '#B89F7D');
        grad.addColorStop(1, '#9A805E');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      setHasCleanedRoomBg(true);
    }
    setEraserMode((prev) => !prev);
  };

  const applySmartInpaintAt = (clientX: number, clientY: number, radius = 44) => {
    const canvas = eraserCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    const sampleY = y < canvas.height * 0.58 ? Math.max(8, y - radius * 1.8) : Math.min(canvas.height - 8, y + radius * 1.6);
    const sampleX = Math.max(8, Math.min(canvas.width - 8, x));
    const pixel = ctx.getImageData(Math.round(sampleX), Math.round(sampleY), 1, 1).data;

    const radGrad = ctx.createRadialGradient(x, y, 2, x, y, radius);
    radGrad.addColorStop(0, `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 0.96)`);
    radGrad.addColorStop(0.7, `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 0.72)`);
    radGrad.addColorStop(1, `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 0)`);
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const autoCleanCenterOldFurniture = () => {
    const canvas = eraserCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    const wallPx = ctx.getImageData(Math.round(w * 0.5), Math.round(h * 0.14), 1, 1).data;
    const floorPx = ctx.getImageData(Math.round(w * 0.5), Math.round(h * 0.88), 1, 1).data;
    const horizonY = h * 0.58;

    ctx.save();
    const wallGrad = ctx.createLinearGradient(0, h * 0.25, 0, horizonY);
    wallGrad.addColorStop(0, `rgba(${wallPx[0]}, ${wallPx[1]}, ${wallPx[2]}, 0.95)`);
    wallGrad.addColorStop(1, `rgba(${Math.max(0, wallPx[0] - 12)}, ${Math.max(0, wallPx[1] - 12)}, ${Math.max(0, wallPx[2] - 12)}, 0.98)`);
    ctx.fillStyle = wallGrad;
    ctx.fillRect(w * 0.08, h * 0.28, w * 0.84, horizonY - h * 0.28);

    const floorGrad = ctx.createLinearGradient(0, horizonY, 0, h * 0.86);
    floorGrad.addColorStop(0, `rgba(${Math.max(0, floorPx[0] - 10)}, ${Math.max(0, floorPx[1] - 10)}, ${Math.max(0, floorPx[2] - 10)}, 0.96)`);
    floorGrad.addColorStop(1, `rgba(${floorPx[0]}, ${floorPx[1]}, ${floorPx[2]}, 0.95)`);
    ctx.fillStyle = floorGrad;
    ctx.fillRect(w * 0.08, horizonY, w * 0.84, h * 0.86 - horizonY);
    ctx.restore();
    setEraserMode(false);
  };

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (!isCameraAR) {
      setCameraReady(false);
      setCameraError(null);
      setEraserMode(false);
      setHasCleanedRoomBg(false);
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
          setCameraError('Tarayıcı kamera erişimini desteklemiyor. Üstteki parçaları seçip zemine yerleştirebilirsiniz.');
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
        setCameraError('Kamera izni verilmedi. Üstteki parçalara tıklayıp parmağınızla zemine yerleştirebilirsiniz.');
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

  const structureSignature = JSON.stringify({
    roomWidthCm,
    roomDepthCm,
    activeColorName,
    wallIdx,
    floorIdx,
    isCameraAR,
    isFullScreen,
    sceneBg: studioTheme.sceneBgHex,
    items: placedPieces.map((p) => ({
      id: p.instanceId,
      t: p.type,
      w: p.widthCm,
      d: p.depthCm,
      h: p.heightCm,
    })),
  });

  // Fast 60fps in-place update of position, independent scale, independent rotation, and floor ring
  useEffect(() => {
    if (isInteractingRef.current) return;
    const W = roomWidthCm / 100;
    const D = roomDepthCm / 100;

    placedPieces.forEach((item) => {
      const grp = pieceGroupsMapRef.current.get(item.instanceId);
      if (grp) {
        const cx = (item.xCm + item.widthCm / 2) / 100 - W / 2;
        const cz = (item.yCm + item.depthCm / 2) / 100 - D / 2;
        grp.position.set(cx, 0, cz);
        grp.rotation.y = -THREE.MathUtils.degToRad(item.rotation);
        const s = item.scale ?? 1.0;
        grp.scale.set(s, s, s);
        grp.userData.widthCm = item.widthCm;
        grp.userData.depthCm = item.depthCm;
        grp.userData.scale = s;
        grp.userData.rotation = item.rotation;
        grp.userData.isLocked = !!item.isLocked;
      }
      const ring = selectionRingsMapRef.current.get(item.instanceId);
      if (ring) {
        ring.visible = item.instanceId === activeInstanceId;
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.color.setHex(item.isLocked ? 0x10b981 : 0xb5893a);
      }
    });
  }, [placedPieces, activeInstanceId, roomWidthCm, roomDepthCm, isCameraAR]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;
    const isMobileViewport = width < 768;

    const scene = new THREE.Scene();
    if (!isCameraAR) {
      scene.background = new THREE.Color(studioTheme.sceneBgHex || 0xf2ede4);
    } else {
      scene.background = null;
      scene.fog = null;
    }

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    const W = roomWidthCm / 100;
    const D = roomDepthCm / 100;
    const H = 2.65;

    if (isCameraAR) {
      camera.position.set(0, 1.85, D * 0.98);
    } else {
      camera.position.set(W * 0.82, 3.45, D * 1.12);
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobileViewport,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileViewport ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    if (isCameraAR) {
      renderer.setClearColor(0x000000, 0);
    }
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 1.6;
    controls.maxDistance = 15;
    controls.target.set(0, isCameraAR ? 0.32 : 0.65, 0);
    if (isCameraAR) {
      controls.enabled = false;
      controls.enableZoom = false;
      controls.enableRotate = false;
      controls.enablePan = false;
    }
    controls.update();
    controlsRef.current = controls;

    // World Anchor Group: holds the floor & all placed furniture so optical-flow + gyroscope locks them to the physical room floor!
    const worldAnchor = new THREE.Group();
    scene.add(worldAnchor);
    worldAnchorRef.current = worldAnchor;

    // --- LIGHTING ---
    const hemi = new THREE.HemisphereLight(0xfffaf0, 0xd8cfc2, isCameraAR ? 1.35 : 1.18);
    scene.add(hemi);

    const sunLight = new THREE.DirectionalLight(0xfff5e4, isCameraAR ? 2.0 : 1.85);
    sunLight.position.set(3.8, 6.2, 4.2);
    sunLight.castShadow = true;
    const shadowRes = isMobileViewport ? 1024 : 2048;
    sunLight.shadow.mapSize.width = shadowRes;
    sunLight.shadow.mapSize.height = shadowRes;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 20;
    const shadowExtent = Math.max(W, D) * 0.95;
    sunLight.shadow.camera.left = -shadowExtent;
    sunLight.shadow.camera.right = shadowExtent;
    sunLight.shadow.camera.top = shadowExtent;
    sunLight.shadow.camera.bottom = -shadowExtent;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

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
    const matBaseboard = new THREE.MeshStandardMaterial({ color: 0x6e5d4f, roughness: 0.5 });

    // --- ROOM ARCHITECTURE vs CAMERA AR DETECTED FLOOR PLANE ---
    const floorTex = createParquetTexture(activeFloor.rgb);
    if (isCameraAR) {
      const shadowFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(W * 3.0, D * 3.0),
        new THREE.ShadowMaterial({ opacity: 0.38 })
      );
      shadowFloor.rotation.x = -Math.PI / 2;
      shadowFloor.position.set(0, 0.001, 0);
      shadowFloor.receiveShadow = true;
      worldAnchor.add(shadowFloor);

      // Subtle AR Floor Detection Target Ring in the center of the detected floor
      const targetRing = new THREE.Mesh(
        new THREE.RingGeometry(0.28, 0.31, 32),
        new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.42 })
      );
      targetRing.rotation.x = -Math.PI / 2;
      targetRing.position.set(0, 0.002, 0);
      worldAnchor.add(targetRing);
    } else {
      const floorMesh = new THREE.Mesh(
        new THREE.BoxGeometry(W + 0.24, 0.14, D + 0.24),
        new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.52, metalness: 0.05 })
      );
      floorMesh.position.set(0, -0.07, 0);
      floorMesh.receiveShadow = true;
      worldAnchor.add(floorMesh);

      const backWall = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, H, 0.12), matWall);
      backWall.position.set(0, H / 2, -D / 2 - 0.06);
      backWall.receiveShadow = true;
      worldAnchor.add(backWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, H, D + 0.12), matWall);
      leftWall.position.set(-W / 2 - 0.06, H / 2, 0);
      leftWall.receiveShadow = true;
      worldAnchor.add(leftWall);

      const bbBack = new THREE.Mesh(new THREE.BoxGeometry(W, 0.11, 0.025), matBaseboard);
      bbBack.position.set(0, 0.055, -D / 2 + 0.012);
      worldAnchor.add(bbBack);
      const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.11, D), matBaseboard);
      bbLeft.position.set(-W / 2 + 0.012, 0.055, 0);
      worldAnchor.add(bbLeft);

      const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.35, 1.55), matBaseboard);
      winFrame.position.set(-W / 2 + 0.02, 1.48, 0);
      worldAnchor.add(winFrame);
      const winGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 1.22, 1.42),
        new THREE.MeshStandardMaterial({ color: 0xd8eeff, emissive: 0xb5deff, emissiveIntensity: 0.45, roughness: 0.1 })
      );
      winGlass.position.set(-W / 2 + 0.025, 1.48, 0);
      worldAnchor.add(winGlass);

      const rug = new THREE.Mesh(
        new THREE.BoxGeometry(W * 0.62, 0.014, D * 0.58),
        new THREE.MeshStandardMaterial({ color: 0xebe3d5, roughness: 0.96 })
      );
      rug.position.set(0, 0.007, D * 0.04);
      rug.receiveShadow = true;
      worldAnchor.add(rug);
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

    const mkCyl = (r: number, h: number, mat: THREE.Material, x = 0, y = 0, z = 0, seg = 16) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    placedPieces.forEach((item) => {
      const root = new THREE.Group();
      const s = item.scale ?? 1.0;
      root.userData = {
        instanceId: item.instanceId,
        name: item.shortName || item.name,
        widthCm: item.widthCm,
        depthCm: item.depthCm,
        scale: s,
        rotation: item.rotation,
        isLocked: !!item.isLocked,
      };

      const pw = item.widthCm / 100;
      const pd = item.depthCm / 100;
      const ph = item.heightCm / 100;

      const cx = (item.xCm + item.widthCm / 2) / 100 - W / 2;
      const cz = (item.yCm + item.depthCm / 2) / 100 - D / 2;
      root.position.set(cx, 0, cz);
      root.rotation.y = -THREE.MathUtils.degToRad(item.rotation);
      root.scale.set(s, s, s);

      // Floor Anchor Reticle Ring under each piece (Amber when editing, Emerald when locked to floor)
      const ringGeo = new THREE.RingGeometry(Math.max(pw, pd) * 0.51, Math.max(pw, pd) * 0.56, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: item.isLocked ? 0x10b981 : 0xb5893a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
      });
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
        root.add(mkBox(pw + 0.14, ph, 0.1, matWood, 0, ph / 2, -pd / 2 + 0.04));
        for (let hi = 0; hi < 4; hi++) {
          const hx = -pw * 0.37 + hi * (pw * 0.245);
          root.add(mkBox(pw * 0.22, ph * 0.78, 0.06, matMain, hx, ph * 0.54, -pd / 2 + 0.1));
        }

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
          const mFrame = mkCyl(0.42, 0.03, matGold, 0, topY + 0.5, -pd / 2 + 0.05, 24);
          mFrame.rotation.x = Math.PI / 2;
          root.add(mFrame);
          const mGlass = mkCyl(0.39, 0.036, matMirror, 0, topY + 0.5, -pd / 2 + 0.05, 24);
          mGlass.rotation.x = Math.PI / 2;
          root.add(mGlass);
        }
      } else if (item.type === 'table') {
        root.add(mkBox(0.16, ph - 0.06, pd * 0.55, matWood, -pw * 0.28, (ph - 0.06) / 2, 0));
        root.add(mkBox(0.16, ph - 0.06, pd * 0.55, matWood, pw * 0.28, (ph - 0.06) / 2, 0));
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
          const tuft = mkCyl(0.014, 0.02, matWood, bx, 0.6, -pd / 2 + 0.33, 12);
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
      }

      worldAnchor.add(root);
      clickableRoots.push(root);
      groupsMap.set(item.instanceId, root);
    });

    animTargetsRef.current = animTargets;
    pieceGroupsMapRef.current = groupsMap;
    selectionRingsMapRef.current = ringsMap;

    // --- 1-FINGER DIRECT DRAG (WITH EDITABLE FLOOR SNAP) + 2-FINGER PINCH-TO-SCALE & TWIST-TO-ROTATE ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersect = new THREE.Vector3();

    const activePointers = new Map<number, { x: number; y: number }>();

    let dragState: {
      root: THREE.Group;
      instanceId: string;
      name: string;
      widthCm: number;
      depthCm: number;
      startX: number;
      startY: number;
      startRootX: number;
      startRootZ: number;
      offsetX: number;
      offsetZ: number;
      moved: boolean;
    } | null = null;

    let pinchState: {
      root: THREE.Group;
      instanceId: string;
      name: string;
      widthCm: number;
      depthCm: number;
      initialDist: number;
      initialAngle: number;
      initialScale: number;
      initialRotation: number;
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
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // 2-FINGER PINCH-TO-SCALE & TWIST-TO-ROTATE (works even on anchored pieces so user can always fine-tune!)
      if (activePointers.size === 2) {
        dragState = null;
        const pts = Array.from(activePointers.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
        const targetId = activeIdRef.current || Array.from(pieceGroupsMapRef.current.keys()).pop();
        const rootGrp = targetId ? pieceGroupsMapRef.current.get(targetId) : undefined;
        if (rootGrp && targetId && !rootGrp.userData?.isLocked) {
          isInteractingRef.current = true;
          controls.enabled = false;
          pinchState = {
            root: rootGrp,
            instanceId: targetId,
            name: rootGrp.userData.name || 'Mobilya',
            widthCm: rootGrp.userData.widthCm || 100,
            depthCm: rootGrp.userData.depthCm || 100,
            initialDist: Math.max(20, dist),
            initialAngle: angle,
            initialScale: rootGrp.userData.scale ?? 1.0,
            initialRotation: rootGrp.userData.rotation ?? 0,
          };
        }
        return;
      }

      if (activePointers.size !== 1) return;

      getNormalizedPointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableRoots, true);

      let chosenRoot: THREE.Group | null = null;
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.userData?.instanceId) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.instanceId) {
          chosenRoot = obj as THREE.Group;
        }
      }

      // If user taps an empty floor spot in Camera AR mode and has an unlocked active piece, snap/drag that active piece to the floor spot!
      if (!chosenRoot && isCameraARRef.current && activeIdRef.current) {
        const activeGrp = pieceGroupsMapRef.current.get(activeIdRef.current);
        if (activeGrp && !activeGrp.userData?.isLocked) {
          chosenRoot = activeGrp;
        }
      }

      if (chosenRoot) {
        const instId = chosenRoot.userData.instanceId as string;
        onSelectRef.current?.(instId);
        highlightSelectedRing(instId);

        if (chosenRoot.userData.isLocked) {
          triggerFloorSnapFeedback(`${chosenRoot.userData.name} kilitli • Oynatmak için alttan "Sabit" kilidine dokunun`);
          return;
        }

        let offsetX = 0;
        let offsetZ = 0;
        if (raycaster.ray.intersectPlane(floorPlane, planeIntersect)) {
          offsetX = chosenRoot.position.x - (planeIntersect.x - worldAnchor.position.x);
          offsetZ = chosenRoot.position.z - (planeIntersect.z - worldAnchor.position.z);
        }
        isInteractingRef.current = true;
        dragState = {
          root: chosenRoot,
          instanceId: instId,
          name: chosenRoot.userData.name || 'Mobilya',
          widthCm: chosenRoot.userData.widthCm || 100,
          depthCm: chosenRoot.userData.depthCm || 100,
          startX: e.clientX,
          startY: e.clientY,
          startRootX: chosenRoot.position.x,
          startRootZ: chosenRoot.position.z,
          offsetX,
          offsetZ,
          moved: false,
        };
        controls.enabled = false;
        try {
          renderer.domElement.setPointerCapture(e.pointerId);
        } catch {}
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (activePointers.has(e.pointerId)) {
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // 2-finger pinch (scale) & twist (rotate) with live centimeter update
      if (pinchState && activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);

        const ratio = dist / pinchState.initialDist;
        const newScale = THREE.MathUtils.clamp(Number((pinchState.initialScale * ratio).toFixed(2)), 0.45, 2.1);
        const deltaDeg = THREE.MathUtils.radToDeg(angle - pinchState.initialAngle);
        const newRot = Math.round(((pinchState.initialRotation + deltaDeg) % 360 + 360) % 360);

        pinchState.root.scale.set(newScale, newScale, newScale);
        pinchState.root.rotation.y = -THREE.MathUtils.degToRad(newRot);
        pinchState.root.userData.scale = newScale;
        pinchState.root.userData.rotation = newRot;
        return;
      }

      if (!dragState || activePointers.size !== 1) return;
      if (!dragState.moved && Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY) > 4) {
        dragState.moved = true;
      }
      if (!dragState.moved) return;

      const rect = renderer.domElement.getBoundingClientRect();
      if (isCameraARRef.current) {
        const dxNorm = (e.clientX - dragState.startX) / Math.max(1, rect.width);
        const dyNorm = (e.clientY - dragState.startY) / Math.max(1, rect.height);
        const spanW = W * 1.15;
        const spanD = D * 1.25;
        const nextX = THREE.MathUtils.clamp(dragState.startRootX + dxNorm * spanW, -W * 1.2, W * 1.2);
        const nextZ = THREE.MathUtils.clamp(dragState.startRootZ + dyNorm * spanD, -D * 1.2, D * 0.98);
        dragState.root.position.set(nextX, 0, nextZ);
      } else {
        getNormalizedPointer(e.clientX, e.clientY);
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(floorPlane, planeIntersect)) {
          const nextX = THREE.MathUtils.clamp(planeIntersect.x - worldAnchor.position.x + dragState.offsetX, -W * 0.9, W * 0.9);
          const nextZ = THREE.MathUtils.clamp(planeIntersect.z - worldAnchor.position.z + dragState.offsetZ, -D * 0.9, D * 0.9);
          dragState.root.position.set(nextX, 0, nextZ);
        }
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);

      if (pinchState && activePointers.size < 2) {
        const finishedPinch = pinchState;
        pinchState = null;
        isInteractingRef.current = false;
        if (!isCameraARRef.current) {
          controls.enabled = true;
        }
        const s = finishedPinch.root.userData.scale ?? 1.0;
        const r = finishedPinch.root.userData.rotation ?? 0;
        onScaleRotateRef.current?.(finishedPinch.instanceId, s, r);
        const curW = Math.round(finishedPinch.widthCm * s);
        const curD = Math.round(finishedPinch.depthCm * s);
        triggerFloorSnapFeedback(`${finishedPinch.name}: ${curW}×${curD} cm • ${r}° zemine oturdu`);
        return;
      }

      if (!dragState) return;
      const finished = dragState;
      dragState = null;
      isInteractingRef.current = false;
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
        const s = finished.root.userData.scale ?? 1.0;
        triggerFloorSnapFeedback(`✓ ${finished.name} (${Math.round(finished.widthCm * s)}×${Math.round(finished.depthCm * s)} cm) zemine oturdu`);
      } else {
        onToggleRef.current(finished.instanceId);
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
        const dropXCm = Math.round((planeIntersect.x - worldAnchor.position.x + W / 2) * 100);
        const dropYCm = Math.round((planeIntersect.z - worldAnchor.position.z + D / 2) * 100);
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

    // Lightweight 2D Optical-Flow Floor Tracker on the <video> stream (runs every 3rd frame in <0.12ms)
    // Locks the placed 3D furniture to the real floor pixels even when the user pans/tilts their phone camera!
    const trackW = 48;
    const trackH = 36;
    const trackCanvas = document.createElement('canvas');
    trackCanvas.width = trackW;
    trackCanvas.height = trackH;
    const trackCtx = trackCanvas.getContext('2d', { willReadFrequently: true });
    let prevLuma: Uint8Array | null = null;
    let tickCount = 0;

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      tickCount++;

      if (isCameraARRef.current) {
        // Update optical-flow floor lock every 3rd frame when user is not dragging a piece
        if (
          tickCount % 3 === 0 &&
          !isInteractingRef.current &&
          trackCtx &&
          videoRef.current &&
          videoRef.current.readyState >= 2 &&
          videoRef.current.videoWidth > 0
        ) {
          try {
            trackCtx.drawImage(videoRef.current, 0, 0, trackW, trackH);
            const imgData = trackCtx.getImageData(0, 0, trackW, trackH).data;
            const curLuma = new Uint8Array(trackW * trackH);
            for (let i = 0, j = 0; i < imgData.length; i += 4, j++) {
              curLuma[j] = (imgData[i] * 77 + imgData[i + 1] * 150 + imgData[i + 2] * 29) >> 8;
            }
            if (prevLuma) {
              let bestDx = 0;
              let bestDy = 0;
              let minSad = Infinity;
              for (let dy = -3; dy <= 3; dy++) {
                for (let dx = -4; dx <= 4; dx++) {
                  let sad = 0;
                  for (let y = 10; y < 28; y += 2) {
                    const row1 = y * trackW;
                    const row2 = (y + dy) * trackW;
                    for (let x = 10; x < 38; x += 2) {
                      sad += Math.abs(curLuma[row2 + x + dx] - prevLuma[row1 + x]);
                    }
                  }
                  // Slight bias toward (0,0) to reject camera noise when stationary
                  if (dx === 0 && dy === 0) sad -= 45;
                  if (sad < minSad) {
                    minSad = sad;
                    bestDx = dx;
                    bestDy = dy;
                  }
                }
              }
              if (bestDx !== 0 || bestDy !== 0) {
                arWorldOffsetRef.current.x = THREE.MathUtils.clamp(
                  arWorldOffsetRef.current.x + bestDx * 0.055,
                  -4.5,
                  4.5
                );
                arWorldOffsetRef.current.z = THREE.MathUtils.clamp(
                  arWorldOffsetRef.current.z + bestDy * 0.055,
                  -3.5,
                  3.5
                );
              }
            }
            prevLuma = curLuma;
          } catch {}
        }

        // Smoothly interpolate worldAnchor to the tracked floor position
        worldAnchor.position.x += (arWorldOffsetRef.current.x - worldAnchor.position.x) * 0.22;
        worldAnchor.position.z += (arWorldOffsetRef.current.z - worldAnchor.position.z) * 0.22;
        worldAnchor.rotation.y += (arWorldOffsetRef.current.yawRad - worldAnchor.rotation.y) * 0.18;
      } else {
        worldAnchor.position.set(0, 0, 0);
        worldAnchor.rotation.y = 0;
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
      cam.position.set(W * 0.82, 3.45, D * 1.12);
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
    if (dir.length() >= 1.6 && dir.length() <= 15) {
      cam.position.copy(ctrl.target).add(dir);
      ctrl.update();
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${
        isFullScreen ? 'w-screen h-[100dvh] rounded-none border-0' : 'rounded-2xl border shadow-sm'
      }`}
      style={{
        backgroundColor: studioTheme.bgPage,
        borderColor: studioTheme.borderHex,
      }}
    >
      {/* Live Rear Camera Feed + Optional AI Old-Furniture Inpainting Canvas */}
      {isCameraAR && (
        <div className="absolute inset-0 z-0 bg-[#E8E0D2]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${hasCleanedRoomBg ? 'hidden' : 'block'}`}
          />
          <canvas
            ref={eraserCanvasRef}
            onPointerDown={(e) => {
              if (!eraserMode) return;
              isErasingBrushRef.current = true;
              applySmartInpaintAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (!eraserMode || !isErasingBrushRef.current) return;
              applySmartInpaintAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              isErasingBrushRef.current = false;
            }}
            className={`w-full h-full object-cover ${hasCleanedRoomBg ? 'block' : 'hidden'} ${
              eraserMode ? 'z-30 relative cursor-crosshair touch-none' : ''
            }`}
          />
          {!cameraReady && cameraError && !hasCleanedRoomBg && (
            <div
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 max-w-sm w-[90%] px-4 py-2 rounded-2xl text-xs text-center shadow-lg border"
              style={{
                backgroundColor: studioTheme.bgCard,
                color: studioTheme.textPrimary,
                borderColor: studioTheme.borderHex,
              }}
            >
              {cameraError}
            </div>
          )}
        </div>
      )}

      {/* AI Furniture Eraser Banner when Eraser Mode is active */}
      {isCameraAR && eraserMode && (
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] rounded-2xl p-3 shadow-xl border flex flex-wrap items-center justify-between gap-2"
          style={{
            backgroundColor: studioTheme.bgCard,
            color: studioTheme.textPrimary,
            borderColor: studioTheme.accentHex,
          }}
        >
          <span className="text-xs font-semibold">
            🪄 Eski koltuğun üzerini parmağınızla boyayarak silin:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={autoCleanCenterOldFurniture}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white cursor-pointer"
              style={{ backgroundColor: studioTheme.accentHex }}
            >
              Otomatik Temizle
            </button>
            <button
              type="button"
              onClick={() => setEraserMode(false)}
              className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Check size={12} /> Tamam
            </button>
          </div>
        </div>
      )}

      {/* Subtle Toast when a piece snaps to the floor */}
      {floorSnapToast && (
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full text-xs font-semibold shadow-md border pointer-events-none whitespace-nowrap"
          style={{
            backgroundColor: `${studioTheme.bgCard}F2`,
            color: studioTheme.textPrimary,
            borderColor: studioTheme.accentHex,
          }}
        >
          {floorSnapToast}
        </div>
      )}

      {/* Clean Step-by-Step Onboarding Card when Camera AR starts empty */}
      {placedPieces.length === 0 && !eraserMode && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-none">
          <div
            className="max-w-xs rounded-3xl p-4 text-center space-y-1.5 shadow-lg border"
            style={{
              backgroundColor: `${studioTheme.bgCard}EA`,
              color: studioTheme.textPrimary,
              borderColor: studioTheme.borderHex,
            }}
          >
            <h4 className="text-xs sm:text-sm font-bold">
              Zemin Algılandı • Üstten Parça Seçin
            </h4>
            <p className="text-[11px] leading-relaxed" style={{ color: studioTheme.textMuted }}>
              Yukarıdan <strong>Tekli Berjer</strong> veya <strong>1. İkili Koltuk</strong>&apos;a dokunun. Parmağınızla bıraktığınız yerde zemine otomatik oturur; istediğiniz an tekrar oynatıp boyutlandırabilirsiniz.
            </p>
          </div>
        </div>
      )}

      <div
        ref={mountRef}
        className={`relative z-10 w-full ${heightClass} cursor-grab active:cursor-grabbing touch-none ${
          eraserMode ? 'pointer-events-none opacity-40' : ''
        }`}
      />

      {/* Minimal Top-Right Controls in Inline 3D View */}
      {!isFullScreen && (
        <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowStylePanel(!showStylePanel)}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border shadow-xs"
            style={{
              backgroundColor: studioTheme.bgCard,
              color: studioTheme.textPrimary,
              borderColor: studioTheme.borderHex,
            }}
          >
            <Palette size={13} style={{ color: studioTheme.accentHex }} /> Renk &amp; Parke
          </button>
          <button
            type="button"
            onClick={onToggleAllOpen}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border shadow-xs"
            style={{
              backgroundColor: studioTheme.bgCard,
              color: studioTheme.textPrimary,
              borderColor: studioTheme.borderHex,
            }}
          >
            <DoorOpen size={13} style={{ color: studioTheme.accentHex }} /> Kapak / Baza Aç
          </button>
        </div>
      )}

      {/* Live 3D Wall / Floor / Fabric Customizer Popover */}
      {showStylePanel && (
        <div
          className="absolute top-14 right-3 z-30 w-64 rounded-2xl p-4 space-y-3.5 shadow-xl border"
          style={{
            backgroundColor: studioTheme.bgCard,
            color: studioTheme.textPrimary,
            borderColor: studioTheme.borderHex,
          }}
        >
          <div>
            <div className="text-[11px] font-semibold mb-1.5" style={{ color: studioTheme.textMuted }}>
              Kumaş &amp; Ahşap ({activeColorName})
            </div>
            <div className="flex flex-wrap gap-2">
              {FABRIC_SWATCH_LIST.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => { setLocalColor(f.name); onChangeColor?.(f.name); }}
                  title={f.name}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
                    activeColorName === f.name ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: f.hex,
                    borderColor: activeColorName === f.name ? studioTheme.accentHex : studioTheme.borderHex,
                  }}
                />
              ))}
            </div>
          </div>
          {!isCameraAR && (
            <>
              <div>
                <div className="text-[11px] font-semibold mb-1.5" style={{ color: studioTheme.textMuted }}>
                  Duvar Rengi
                </div>
                <div className="flex flex-wrap gap-2">
                  {WALL_COLOR_OPTIONS.map((w, idx) => (
                    <button
                      key={w.name}
                      type="button"
                      onClick={() => setWallIdx(idx)}
                      title={w.name}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
                        wallIdx === idx ? 'scale-110' : ''
                      }`}
                      style={{
                        backgroundColor: w.hex,
                        borderColor: wallIdx === idx ? studioTheme.accentHex : studioTheme.borderHex,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold mb-1.5" style={{ color: studioTheme.textMuted }}>
                  Zemin Parke
                </div>
                <div className="flex flex-wrap gap-2">
                  {FLOOR_TONE_OPTIONS.map((fl, idx) => (
                    <button
                      key={fl.name}
                      type="button"
                      onClick={() => setFloorIdx(idx)}
                      title={fl.name}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
                        floorIdx === idx ? 'scale-110' : ''
                      }`}
                      style={{
                        backgroundColor: fl.hex,
                        borderColor: floorIdx === idx ? studioTheme.accentHex : studioTheme.borderHex,
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Subtle Bottom Camera Angle Bar in 3D Room View */}
      {!isFullScreen && !isCameraAR && (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
          <div
            className="flex items-center gap-1 p-1 rounded-full pointer-events-auto text-[11px] font-medium border shadow-xs"
            style={{
              backgroundColor: `${studioTheme.bgCard}E6`,
              color: studioTheme.textPrimary,
              borderColor: studioTheme.borderHex,
            }}
          >
            <button type="button" onClick={() => setCameraPreset('corner')} className="px-3 py-1 rounded-full hover:opacity-75 flex items-center gap-1 cursor-pointer">
              <Compass size={12} /> Köşe
            </button>
            <button type="button" onClick={() => setCameraPreset('walk')} className="px-3 py-1 rounded-full hover:opacity-75 flex items-center gap-1 cursor-pointer">
              <Eye size={12} /> Göz Hizası
            </button>
            <button type="button" onClick={() => setCameraPreset('top')} className="px-3 py-1 rounded-full hover:opacity-75 flex items-center gap-1 cursor-pointer">
              <RotateCcw size={12} /> Üstten
            </button>
          </div>

          <div
            className="flex items-center gap-1 p-1 rounded-full pointer-events-auto border shadow-xs"
            style={{
              backgroundColor: `${studioTheme.bgCard}E6`,
              color: studioTheme.textPrimary,
              borderColor: studioTheme.borderHex,
            }}
          >
            <button type="button" onClick={() => adjustZoom(0.82)} className="p-1.5 rounded-full hover:opacity-75 cursor-pointer" title="Yakınlaş">
              <ZoomIn size={14} />
            </button>
            <button type="button" onClick={() => adjustZoom(1.22)} className="p-1.5 rounded-full hover:opacity-75 cursor-pointer" title="Uzaklaş">
              <ZoomOut size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
