"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import {
  DoorOpen, Eye, Compass, ZoomIn, ZoomOut, RotateCcw,
  Palette, Check, Box
} from 'lucide-react';
import type { PlacedPiece, FurniturePieceSpec } from './ShowroomRoomPlanner';
import WebXRMultiPieceAR, { useWebXRARSupport } from './WebXRMultiPieceAR';

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

export interface FloorAimPoint {
  xCm: number;
  yCm: number;
  rotDeg: number;
}

interface Real3DRoomSceneProps {
  placedPieces: PlacedPiece[];
  availablePieces?: FurniturePieceSpec[];
  onSpawnPieceFromAR?: (spec: FurniturePieceSpec) => void;
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
  onUpdateFloorAim?: (aim: FloorAimPoint) => void;
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

const glbCache = new Map<string, THREE.Group>();
const glbPromiseCache = new Map<string, Promise<THREE.Group>>();
const gltfLoaderSingleton = typeof window !== 'undefined' ? new GLTFLoader() : null;

function loadCachedGLB(url: string): Promise<THREE.Group> {
  if (glbCache.has(url)) {
    return Promise.resolve(glbCache.get(url)!.clone(true));
  }
  if (glbPromiseCache.has(url)) {
    return glbPromiseCache.get(url)!.then((g) => g.clone(true));
  }
  const p = new Promise<THREE.Group>((resolve, reject) => {
    if (!gltfLoaderSingleton) {
      reject(new Error('No GLTFLoader'));
      return;
    }
    gltfLoaderSingleton.load(
      url,
      (gltf) => {
        const sceneGrp = gltf.scene || new THREE.Group();
        sceneGrp.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        glbCache.set(url, sceneGrp);
        resolve(sceneGrp.clone(true));
      },
      undefined,
      (err) => reject(err)
    );
  });
  glbPromiseCache.set(url, p);
  return p;
}

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

// W3C DeviceOrientation 3D Quaternion Solver (maps phone's physical alpha/beta/gamma directly to Three.js world-space camera quaternion!)
const _zee = new THREE.Vector3(0, 0, 1);
const _euler = new THREE.Euler();
const _q0 = new THREE.Quaternion();
const _q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // -PI/2 around X-axis so camera looks out back of phone

function setQuaternionFromDeviceIMU(
  targetQuat: THREE.Quaternion,
  alphaRad: number,
  betaRad: number,
  gammaRad: number,
  screenOrientRad: number
) {
  _euler.set(betaRad, alphaRad, -gammaRad, 'YXZ');
  targetQuat.setFromEuler(_euler);
  targetQuat.multiply(_q1);
  targetQuat.multiply(_q0.setFromAxisAngle(_zee, -screenOrientRad));
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
  availablePieces = [],
  onSpawnPieceFromAR,
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
  onUpdateFloorAim,
  studioTheme = DEFAULT_LIGHT_STUDIO_THEME,
  eraserTrigger = 0,
  resetCameraTrigger = 0,
}: Real3DRoomSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const eraserCanvasRef = useRef<HTMLCanvasElement>(null);
  const arModelViewerRef = useRef<any>(null);
  const [arExportBlobUrl, setArExportBlobUrl] = useState<string>('/models/limoon-berjer.glb');
  const [isExportingAR, setIsExportingAR] = useState<boolean>(false);
  const [showSingleArPicker, setShowSingleArPicker] = useState<boolean>(false);
  const webXRSupported = useWebXRARSupport();
  const [showWebXRAR, setShowWebXRAR] = useState<boolean>(false);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const furnitureContainerRef = useRef<THREE.Group | null>(null);
  const floorReticleRef = useRef<THREE.Group | null>(null);
  const clickableRootsRef = useRef<THREE.Group[]>([]);
  const animTargetsRef = useRef<AnimTarget[]>([]);
  const pieceGroupsMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const selectionRingsMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  // Auto-ground drop animation map: instanceId -> current vertical drop height y (meters)
  const dropAnimMapRef = useRef<Map<string, number>>(new Map());
  const isInteractingRef = useRef<boolean>(false);
  const openStateMapRef = useRef<Record<string, boolean>>({});
  const isCameraARRef = useRef<boolean>(isCameraAR);
  const activeIdRef = useRef<string | null>(activeInstanceId || null);

  // World-Space IMU Camera Orientation State (Gyroscope + Accelerometer + Manual Look Fallback)
  const imuStateRef = useRef<{
    hasSensor: boolean;
    baseAlpha: number | null;
    alphaDeg: number;
    betaDeg: number;
    gammaDeg: number;
    manualYawDeg: number;
    manualPitchDeg: number;
    lastMotionTs: number;
  }>({
    hasSensor: false,
    baseAlpha: null,
    alphaDeg: 0,
    betaDeg: 62, // default phone held at 62° looking down at floor
    gammaDeg: 0,
    manualYawDeg: 0,
    manualPitchDeg: 0,
    lastMotionTs: 0,
  });

  const onToggleRef = useRef(onTogglePieceOpen);
  const onSelectRef = useRef(onSelectPiece3D);
  const onMoveRef = useRef(onMovePiece3D);
  const onScaleRotateRef = useRef(onScaleRotatePiece3D);
  onDropNewRef_assign();
  function onDropNewRef_assign() {}
  const onDropNewRef = useRef(onDropNewPiece3D);
  const onUpdateFloorAimRef = useRef(onUpdateFloorAim);

  const [wallIdx, setWallIdx] = useState<number>(0);
  const [floorIdx, setFloorIdx] = useState<number>(0);
  const [localColor, setLocalColor] = useState<string>(selectedColor);
  const [showStylePanel, setShowStylePanel] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [floorSnapToast, setFloorSnapToast] = useState<string | null>(null);

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
  onUpdateFloorAimRef.current = onUpdateFloorAim;
  isCameraARRef.current = isCameraAR;
  activeIdRef.current = activeInstanceId || null;

  const triggerFloorSnapFeedback = (msg: string) => {
    setFloorSnapToast(msg);
    setTimeout(() => {
      setFloorSnapToast((prev) => (prev === msg ? null : prev));
    }, 1900);
  };

  // TRUE 3D WORLD-SPACE IMU LISTENERS:
  // Listens to DeviceOrientation + DeviceMotion (Gyroscope angular rate) + Parent Iframe postMessage bridge!
  useEffect(() => {
    if (!isCameraAR) {
      imuStateRef.current = {
        hasSensor: false,
        baseAlpha: null,
        alphaDeg: 0,
        betaDeg: 62,
        gammaDeg: 0,
        manualYawDeg: 0,
        manualPitchDeg: 0,
        lastMotionTs: 0,
      };
      return;
    }

    const applyOrientationValues = (alpha: number | null, beta: number | null, gamma: number | null) => {
      const st = imuStateRef.current;
      if (alpha !== null && !Number.isNaN(alpha)) {
        if (st.baseAlpha === null) {
          st.baseAlpha = alpha;
        }
        st.alphaDeg = alpha - st.baseAlpha;
        st.hasSensor = true;
      }
      if (beta !== null && !Number.isNaN(beta)) {
        // Clamp beta to realistic phone-in-hand floor viewing range [25° .. 86°]
        st.betaDeg = THREE.MathUtils.clamp(beta, 25, 86);
        st.hasSensor = true;
      }
      if (gamma !== null && !Number.isNaN(gamma)) {
        st.gammaDeg = THREE.MathUtils.clamp(gamma, -45, 45);
      }
    };

    const handleDeviceOrientation = (ev: DeviceOrientationEvent) => {
      if (ev.alpha === null && ev.beta === null) return;
      applyOrientationValues(ev.alpha, ev.beta, ev.gamma);
    };

    // DeviceMotion Gyroscope Fallback (works even on phones without a magnetometer compass!)
    const handleDeviceMotion = (ev: DeviceMotionEvent) => {
      const st = imuStateRef.current;
      const now = performance.now();
      const dt = st.lastMotionTs > 0 ? Math.min(0.1, (now - st.lastMotionTs) / 1000) : 0.016;
      st.lastMotionTs = now;

      if (ev.rotationRate) {
        // Integrate yaw rate (alpha/beta depending on portrait upright hold) when deviceorientation alpha isn't updating
        const yawRate = (ev.rotationRate.alpha || 0) * 0.35 - (ev.rotationRate.gamma || 0) * 0.65;
        if (Math.abs(yawRate) > 1.2) {
          st.alphaDeg = (st.alphaDeg + yawRate * dt) % 360;
          st.hasSensor = true;
        }
      }
      if (!st.hasSensor && ev.accelerationIncludingGravity) {
        const ay = ev.accelerationIncludingGravity.y || 0;
        const az = ev.accelerationIncludingGravity.z || 0;
        if (Math.abs(ay) + Math.abs(az) > 2) {
          const pitchFromGrav = THREE.MathUtils.radToDeg(Math.atan2(ay, -az));
          st.betaDeg = THREE.MathUtils.clamp(pitchFromGrav, 28, 84);
          st.hasSensor = true;
        }
      }
    };

    // Parent window postMessage bridge (for cross-origin iframe on limoonhome.com!)
    const handleMessage = (ev: MessageEvent) => {
      if (ev.data && ev.data.type === 'LIMOON_GYRO') {
        applyOrientationValues(ev.data.alpha, ev.data.beta, ev.data.gamma);
      }
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    window.addEventListener('deviceorientationabsolute' as any, handleDeviceOrientation, true);
    window.addEventListener('devicemotion', handleDeviceMotion, true);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
      window.removeEventListener('deviceorientationabsolute' as any, handleDeviceOrientation, true);
      window.removeEventListener('devicemotion', handleDeviceMotion, true);
      window.removeEventListener('message', handleMessage);
    };
  }, [isCameraAR]);

  useEffect(() => {
    if (eraserTrigger > 0 && isCameraAR) {
      startEraserOnCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eraserTrigger]);

  useEffect(() => {
    if (resetCameraTrigger > 0) {
      setHasCleanedRoomBg(false);
      setEraserMode(false);
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

  const envSignature = JSON.stringify({
    roomWidthCm,
    roomDepthCm,
    wallIdx,
    floorIdx,
    isCameraAR,
    isFullScreen,
    sceneBg: studioTheme.sceneBgHex,
  });

  const buildFurnitureGroup = (item: PlacedPiece, W: number, D: number) => {
    const pal = PALETTES[activeColorName] || PALETTES['Krem Boucle'];
    const matMain = new THREE.MeshStandardMaterial({ color: pal.main, roughness: 0.76, metalness: 0.02 });
    const matWood = new THREE.MeshStandardMaterial({ color: pal.wood, roughness: 0.42, metalness: 0.05 });
    const matWarmLeg = new THREE.MeshStandardMaterial({ color: 0x8d5228, roughness: 0.36, metalness: 0.05 });
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
    const matPillow = new THREE.MeshStandardMaterial({ color: 0xf7f4ee, roughness: 0.85 });

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

    const root = new THREE.Group();
    const s = item.scale ?? 1.0;
    const floorOffsetM = (item.floorOffsetCm || 0) / 100;
    const pw = item.widthCm / 100;
    const pd = item.depthCm / 100;
    const ph = item.heightCm / 100;

    root.userData = {
      instanceId: item.instanceId,
      name: item.shortName || item.name,
      widthCm: item.widthCm,
      depthCm: item.depthCm,
      heightCm: item.heightCm,
      type: item.type,
      colorName: activeColorName,
      scale: s,
      floorOffsetCm: item.floorOffsetCm || 0,
      rotation: item.rotation,
      isLocked: !!item.isLocked,
    };

    const cx = (item.xCm + item.widthCm / 2) / 100 - W / 2;
    const cz = (item.yCm + item.depthCm / 2) / 100 - D / 2;
    // Start with a subtle vertical drop height (0.28m -> floorOffsetM) so the user sees it physically settle onto the floor plane!
    dropAnimMapRef.current.set(item.instanceId, 0.28);
    root.position.set(cx, floorOffsetM + 0.28, cz);
    root.rotation.y = -THREE.MathUtils.degToRad(item.rotation);
    root.scale.set(s, s, s);

    // Floor Anchor Ring + Subtle Contact Shadow Disc under each piece so it visually locks to the floor even on bright carpets!
    const contactShadowGeo = new THREE.CircleGeometry(Math.max(pw, pd) * 0.48, 28);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      color: 0x1a1512,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.003, 0);
    root.add(contactShadow);

    const ringGeo = new THREE.RingGeometry(Math.max(pw, pd) * 0.51, Math.max(pw, pd) * 0.56, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: item.isLocked ? 0x10b981 : 0xb5893a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(0, 0.008, 0);
    ringMesh.visible = item.instanceId === activeIdRef.current;
    root.add(ringMesh);
    selectionRingsMapRef.current.set(item.instanceId, ringMesh);

    const bodyContainer = new THREE.Group();
    root.add(bodyContainer);

    const useRealGlb =
      item.url &&
      item.url.endsWith('.glb') &&
      (item.type === 'sofa3' || item.type === 'sofa2' || item.type === 'armchair' || item.type === 'coffeetable');

    if (useRealGlb) {
      const fallbackGrp = new THREE.Group();
      if (item.type === 'coffeetable') {
        fallbackGrp.add(mkBox(pw, 0.02, pd, matSmokedGlass, 0, ph, 0));
        fallbackGrp.add(mkBox(pw * 0.75, 0.03, pd * 0.72, matWarmLeg, 0, 0.15, 0));
      } else {
        fallbackGrp.add(mkBox(pw, ph * 0.45, pd, matMain, 0, ph * 0.25, 0));
        fallbackGrp.add(mkBox(pw, ph * 0.5, pd * 0.3, matMain, 0, ph * 0.65, -pd * 0.32));
      }
      bodyContainer.add(fallbackGrp);

      loadCachedGLB(item.url)
        .then((glbScene) => {
          const box = new THREE.Box3().setFromObject(glbScene);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);

          if (size.x > 0.01 && size.y > 0.01 && size.z > 0.01) {
            // Pin bottom of 3D model strictly to y = 0 floor plane!
            glbScene.position.set(-center.x, -box.min.y, -center.z);
            const wrapper = new THREE.Group();
            wrapper.add(glbScene);
            wrapper.scale.set(pw / size.x, ph / size.y, pd / size.z);
            bodyContainer.remove(fallbackGrp);
            bodyContainer.add(wrapper);
          }
        })
        .catch(() => {});
    } else if (item.type === 'wardrobe') {
      bodyContainer.add(mkBox(pw, ph - 0.08, 0.04, matWood, 0, (ph + 0.08) / 2, -pd / 2 + 0.02));
      bodyContainer.add(mkBox(0.04, ph - 0.08, pd, matWood, -pw / 2 + 0.02, (ph + 0.08) / 2, 0));
      bodyContainer.add(mkBox(0.04, ph - 0.08, pd, matWood, pw / 2 - 0.02, (ph + 0.08) / 2, 0));
      bodyContainer.add(mkBox(pw, 0.04, pd, matWood, 0, ph - 0.02, 0));
      bodyContainer.add(mkBox(pw, 0.08, pd - 0.03, matGold, 0, 0.04, -0.01));
      bodyContainer.add(mkBox(0.03, ph - 0.14, pd - 0.06, matInterior, -pw / 6, ph / 2, -0.02));
      bodyContainer.add(mkBox(0.03, ph - 0.14, pd - 0.06, matInterior, pw / 6, ph / 2, -0.02));
      for (const sy of [ph * 0.25, ph * 0.45, ph * 0.66, ph * 0.84]) {
        bodyContainer.add(mkBox(pw / 3 - 0.05, 0.025, pd - 0.1, matInterior, -pw / 3, sy, -0.02));
        bodyContainer.add(mkBox(pw / 3 - 0.05, 0.025, pd - 0.1, matInterior, pw / 3, sy, -0.02));
      }
      const rail = mkCyl(0.014, pw / 3 - 0.06, matGold, 0, ph - 0.34, -0.02);
      rail.rotation.z = Math.PI / 2;
      bodyContainer.add(rail);
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

        bodyContainer.add(pivot);
        animTargetsRef.current.push({
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
          bodyContainer.add(mkCyl(0.025, 0.1, matGold, sx, 0.05, sz));
        }
      }
      bodyContainer.add(mkBox(pw, 0.04, pd - 0.12, matInterior, 0, 0.12, 0.04));
      bodyContainer.add(mkBox(pw, 0.28, 0.05, matMain, 0, 0.24, pd / 2 - 0.025));
      bodyContainer.add(mkBox(0.05, 0.28, pd - 0.12, matMain, -pw / 2 + 0.025, 0.24, 0.04));
      bodyContainer.add(mkBox(0.05, 0.28, pd - 0.12, matMain, pw / 2 - 0.025, 0.24, 0.04));
      bodyContainer.add(mkBox(pw + 0.14, ph, 0.1, matWood, 0, ph / 2, -pd / 2 + 0.04));
      for (let hi = 0; hi < 4; hi++) {
        const hx = -pw * 0.37 + hi * (pw * 0.245);
        bodyContainer.add(mkBox(pw * 0.22, ph * 0.78, 0.06, matMain, hx, ph * 0.54, -pd / 2 + 0.1));
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
      bodyContainer.add(bazaPivot);
      animTargetsRef.current.push({
        type: 'baza',
        object: bazaPivot,
        instanceId: item.instanceId,
        basePos: bazaPivot.position.clone(),
        baseRot: bazaPivot.rotation.clone(),
      });
    } else if (item.type === 'dresser' || item.type === 'nightstand' || item.type === 'console') {
      const legH = item.type === 'nightstand' ? 0.12 : 0.16;
      const bodyH = Math.max(0.35, ph - legH - 0.03);
      for (const sx of [-pw / 2 + 0.08, pw / 2 - 0.08]) {
        for (const sz of [-pd / 2 + 0.06, pd / 2 - 0.06]) {
          bodyContainer.add(mkCyl(0.018, legH, matGold, sx, legH / 2, sz));
        }
      }
      // Warm walnut body with rounded side profiles
      bodyContainer.add(mkBox(pw, bodyH, pd - 0.04, matWood, 0, legH + bodyH / 2, -0.02));
      // Cream travertine marble top slab
      bodyContainer.add(mkBox(pw + 0.02, 0.032, pd + 0.02, matMarble, 0, legH + bodyH + 0.016, 0));

      const rows = item.type === 'nightstand' ? 2 : item.type === 'console' ? 1 : 3;
      const cols = item.type === 'nightstand' ? 1 : item.type === 'console' ? 4 : 2;
      const drW = (pw - 0.08) / cols;
      const drH = (bodyH - 0.06) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = -pw / 2 + 0.04 + drW / 2 + c * drW;
          const dy = legH + 0.03 + drH / 2 + r * drH;
          const drawerGrp = new THREE.Group();
          drawerGrp.position.set(dx, dy, pd / 2 - 0.02);
          drawerGrp.add(mkBox(drW - 0.018, drH - 0.02, 0.026, matMain, 0, 0, 0.01));
          // Vertical fluted slats on console doors for Limoon bohemian look
          if (item.type === 'console') {
            for (let si = -2; si <= 2; si++) {
              drawerGrp.add(mkBox(0.014, drH - 0.06, 0.012, matWood, si * (drW * 0.16), 0, 0.024));
            }
          }
          drawerGrp.add(mkBox(item.type === 'console' ? 0.018 : Math.min(0.16, drW * 0.35), item.type === 'console' ? 0.14 : 0.016, 0.025, matGold, 0, 0, 0.032));
          bodyContainer.add(drawerGrp);
          animTargetsRef.current.push({
            type: 'drawer',
            object: drawerGrp,
            instanceId: item.instanceId,
            basePos: drawerGrp.position.clone(),
            baseRot: drawerGrp.rotation.clone(),
          });
        }
      }

      // Signature Circular Bronze-Framed Wall Mirror above Console or Dresser
      if (item.type === 'console' || item.type === 'dresser') {
        const mirR = item.type === 'console' ? 0.44 : 0.36;
        const mirY = legH + bodyH + mirR + 0.14;
        const rim = mkCyl(mirR + 0.025, 0.03, matGold, 0, mirY, -pd / 2 + 0.03, 36);
        rim.rotation.x = Math.PI / 2;
        const glass = mkCyl(mirR, 0.034, matMirror, 0, mirY, -pd / 2 + 0.032, 36);
        glass.rotation.x = Math.PI / 2;
        bodyContainer.add(rim, glass);
      }
    } else if (item.type === 'table') {
      // Limoon Luxury Travertine & Fluted Double-Pedestal Walnut Dining Table
      const pedH = ph - 0.055;
      for (const px of [-pw * 0.26, pw * 0.26]) {
        // Fluted cylindrical walnut pedestal column
        bodyContainer.add(mkCyl(0.15, pedH, matWood, px, pedH / 2, 0, 24));
        // Brushed brass floor ring
        bodyContainer.add(mkCyl(0.165, 0.035, matGold, px, 0.018, 0, 24));
        // Vertical fluted wood ribs around each pedestal
        for (let ri = 0; ri < 10; ri++) {
          const ang = (ri / 10) * Math.PI * 2;
          bodyContainer.add(
            mkCyl(0.016, pedH - 0.02, matWarmLeg, px + Math.cos(ang) * 0.15, pedH / 2 + 0.01, Math.sin(ang) * 0.15, 8)
          );
        }
      }
      // Warm walnut under-apron beam
      bodyContainer.add(mkBox(pw * 0.78, 0.04, pd * 0.62, matWood, 0, ph - 0.06, 0));
      // Cream Travertine / Marble Tabletop with expandable leaves
      const leftHalf = mkBox(pw / 2, 0.046, pd, matMarble, -pw / 4, ph - 0.023, 0);
      const rightHalf = mkBox(pw / 2, 0.046, pd, matMarble, pw / 4, ph - 0.023, 0);
      const centerLeaf = mkBox(0.42, 0.042, pd - 0.04, matGold, 0, ph - 0.075, 0);
      // Decorative centerpiece bowl on dining table
      const bowlBase = mkCyl(0.11, 0.025, matGold, 0, ph + 0.012, 0, 24);
      const bowlBody = mkCyl(0.16, 0.038, matWood, 0, ph + 0.038, 0, 24);
      bodyContainer.add(leftHalf, rightHalf, centerLeaf, bowlBase, bowlBody);
      animTargetsRef.current.push(
        { type: 'table-left', object: leftHalf, instanceId: item.instanceId, basePos: leftHalf.position.clone(), baseRot: leftHalf.rotation.clone() },
        { type: 'table-right', object: rightHalf, instanceId: item.instanceId, basePos: rightHalf.position.clone(), baseRot: rightHalf.rotation.clone() },
        { type: 'table-leaf', object: centerLeaf, instanceId: item.instanceId, basePos: centerLeaf.position.clone(), baseRot: centerLeaf.rotation.clone() }
      );
    } else if (item.type === 'chair') {
      // Limoon Sculpted Boucle & Warm Walnut Tub Dining Chair (replaces generic orange SheenChair!)
      const seatY = 0.45;
      for (const lx of [-pw * 0.36, pw * 0.36]) {
        for (const lz of [-pd * 0.35, pd * 0.35]) {
          const leg = mkCyl(0.017, seatY, matWarmLeg, lx, seatY / 2, lz, 14);
          leg.rotation.z = lx < 0 ? 0.07 : -0.07;
          leg.rotation.x = lz < 0 ? -0.06 : 0.06;
          bodyContainer.add(leg);
          bodyContainer.add(mkCyl(0.018, 0.045, matGold, lx * 1.04, 0.022, lz * 1.04, 12));
        }
      }
      // Walnut seat frame + plush rounded boucle seat cushion
      bodyContainer.add(mkBox(pw * 0.84, 0.035, pd * 0.82, matWood, 0, seatY - 0.01, 0));
      const seatCushion = mkCyl(pw * 0.46, 0.085, matMain, 0, seatY + 0.038, 0.01, 24);
      seatCushion.scale.set(1, 1, pd / Math.max(0.01, pw));
      bodyContainer.add(seatCushion);

      // Curved wrap-around Boucle tub backrest & side wings
      const backH = ph - seatY - 0.02;
      const backCenter = mkBox(pw * 0.86, backH, 0.075, matMain, 0, seatY + backH / 2 + 0.02, -pd * 0.36);
      backCenter.rotation.x = -0.08;
      bodyContainer.add(backCenter);
      for (const sign of [-1, 1]) {
        const wing = mkBox(0.07, backH * 0.82, pd * 0.48, matMain, sign * (pw * 0.41), seatY + backH * 0.42, -pd * 0.14);
        wing.rotation.y = sign * 0.14;
        bodyContainer.add(wing);
      }
    } else {
      bodyContainer.add(mkBox(pw, ph * 0.55, pd, matMain, 0, ph * 0.4, 0));
    }

    return root;
  };

  const syncFurnitureInScene = () => {
    const containerGrp = furnitureContainerRef.current;
    if (!containerGrp) return;
    const W = roomWidthCm / 100;
    const D = roomDepthCm / 100;

    const currentIds = new Set(placedPieces.map((p) => p.instanceId));

    Array.from(pieceGroupsMapRef.current.entries()).forEach(([id, grp]) => {
      if (!currentIds.has(id)) {
        containerGrp.remove(grp);
        pieceGroupsMapRef.current.delete(id);
        selectionRingsMapRef.current.delete(id);
        dropAnimMapRef.current.delete(id);
        animTargetsRef.current = animTargetsRef.current.filter((a) => a.instanceId !== id);
      }
    });

    placedPieces.forEach((item) => {
      let grp = pieceGroupsMapRef.current.get(item.instanceId);
      const needsRebuild =
        grp &&
        (grp.userData.widthCm !== item.widthCm ||
          grp.userData.depthCm !== item.depthCm ||
          grp.userData.heightCm !== item.heightCm ||
          grp.userData.colorName !== activeColorName);

      if (grp && needsRebuild) {
        containerGrp.remove(grp);
        pieceGroupsMapRef.current.delete(item.instanceId);
        selectionRingsMapRef.current.delete(item.instanceId);
        animTargetsRef.current = animTargetsRef.current.filter((a) => a.instanceId !== item.instanceId);
        grp = undefined;
      }

      if (!grp) {
        grp = buildFurnitureGroup(item, W, D);
        containerGrp.add(grp);
        pieceGroupsMapRef.current.set(item.instanceId, grp);
        triggerFloorSnapFeedback(`✓ ${item.shortName} zemine yerleştirildi`);
      } else if (!isInteractingRef.current) {
        const cx = (item.xCm + item.widthCm / 2) / 100 - W / 2;
        const cz = (item.yCm + item.depthCm / 2) / 100 - D / 2;
        const floorOffsetM = (item.floorOffsetCm || 0) / 100;
        grp.position.x = cx;
        grp.position.z = cz;
        if (!dropAnimMapRef.current.has(item.instanceId)) {
          grp.position.y = floorOffsetM;
        }
        grp.rotation.y = -THREE.MathUtils.degToRad(item.rotation);
        const s = item.scale ?? 1.0;
        grp.scale.set(s, s, s);
        grp.userData.scale = s;
        grp.userData.floorOffsetCm = item.floorOffsetCm || 0;
        grp.userData.rotation = item.rotation;
        grp.userData.isLocked = !!item.isLocked;
      }

      const ring = selectionRingsMapRef.current.get(item.instanceId);
      if (ring) {
        ring.visible = item.instanceId === activeInstanceId || !!item.isLocked;
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.color.setHex(item.isLocked ? 0x10b981 : 0xb5893a);
        mat.opacity = item.isLocked ? 0.55 : 0.92;
      }
    });

    clickableRootsRef.current = Array.from(pieceGroupsMapRef.current.values());
  };

  useEffect(() => {
    syncFurnitureInScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedPieces, activeInstanceId, activeColorName, roomWidthCm, roomDepthCm]);

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

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 60);
    const W = roomWidthCm / 100;
    const D = roomDepthCm / 100;
    const H = 2.65;

    if (isCameraAR) {
      camera.position.set(0, 1.45, D * 0.68);
    } else {
      // Symmetrical, magazine-centered Limoon Home showroom camera angle (never pushed off to one side!)
      camera.position.set(0, 2.32, D * 1.18);
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
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 1.2;
    controls.maxDistance = 15;
    controls.target.set(0, isCameraAR ? 0.35 : 0.58, isCameraAR ? 0 : -0.15);
    // Keep OrbitControls ENABLED in both 3D Room and Camera AR so swiping outside a piece lets the user orbit 360° around the furniture!
    controls.enabled = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    // Prevent accidental 2-finger/right-click pan from shoving the room off-center in 3D studio mode
    controls.enablePan = isCameraAR;
    controls.update();
    controlsRef.current = controls;

    // --- LIGHTING ---
    const hemi = new THREE.HemisphereLight(0xfffaf0, 0xd8cfc2, isCameraAR ? 1.35 : 1.18);
    scene.add(hemi);

    const sunLight = new THREE.DirectionalLight(0xfff5e4, isCameraAR ? 2.0 : 1.85);
    sunLight.position.set(3.8, 6.5, 4.2);
    sunLight.castShadow = true;
    const shadowRes = isMobileViewport ? 1024 : 2048;
    sunLight.shadow.mapSize.width = shadowRes;
    sunLight.shadow.mapSize.height = shadowRes;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    const shadowExtent = Math.max(W, D) * 1.4;
    sunLight.shadow.camera.left = -shadowExtent;
    sunLight.shadow.camera.right = shadowExtent;
    sunLight.shadow.camera.top = shadowExtent;
    sunLight.shadow.camera.bottom = -shadowExtent;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const matWall = new THREE.MeshStandardMaterial({ color: activeWall.num, roughness: 0.88 });
    const matBaseboard = new THREE.MeshStandardMaterial({ color: 0x6e5d4f, roughness: 0.5 });

    // --- ROOM ARCHITECTURE vs CAMERA AR INFINITE WORLD FLOOR ---
    const floorTex = createParquetTexture(activeFloor.rgb);
    if (isCameraAR) {
      const shadowFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.ShadowMaterial({ opacity: 0.38 })
      );
      shadowFloor.rotation.x = -Math.PI / 2;
      shadowFloor.position.set(0, 0.001, 0);
      shadowFloor.receiveShadow = true;
      scene.add(shadowFloor);

      // Subtle World-Space Floor Polar Grid so user visually sees the detected floor stay anchored in their room as they turn the phone!
      const polarGrid = new THREE.PolarGridHelper(5.5, 12, 6, 48, 0xb5893a, 0xffffff);
      const pgMat = polarGrid.material as THREE.Material;
      pgMat.transparent = true;
      pgMat.opacity = 0.16;
      polarGrid.position.set(0, 0.002, 0);
      scene.add(polarGrid);

      // Live Auto-Ground Floor Target Reticle (slides along the floor where the phone camera is pointing!)
      const reticleGrp = new THREE.Group();
      const outerRing = new THREE.Mesh(
        new THREE.RingGeometry(0.24, 0.28, 32),
        new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
      );
      outerRing.rotation.x = -Math.PI / 2;
      const innerDot = new THREE.Mesh(
        new THREE.CircleGeometry(0.05, 20),
        new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      );
      innerDot.rotation.x = -Math.PI / 2;
      reticleGrp.add(outerRing, innerDot);
      reticleGrp.position.set(0, 0.005, -2.5);
      scene.add(reticleGrp);
      floorReticleRef.current = reticleGrp;
    } else {
      floorReticleRef.current = null;
      const floorMesh = new THREE.Mesh(
        new THREE.BoxGeometry(W + 0.24, 0.14, D + 0.24),
        new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.48, metalness: 0.05 })
      );
      floorMesh.position.set(0, -0.07, 0);
      floorMesh.receiveShadow = true;
      scene.add(floorMesh);

      // Back Wall + Left Wall + Right Wall (creates a balanced, symmetrical Limoon Home architectural salon!)
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, H, 0.12), matWall);
      backWall.position.set(0, H / 2, -D / 2 - 0.06);
      backWall.receiveShadow = true;
      scene.add(backWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, H, D + 0.12), matWall);
      leftWall.position.set(-W / 2 - 0.06, H / 2, 0);
      leftWall.receiveShadow = true;
      scene.add(leftWall);

      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, H, D + 0.12), matWall);
      rightWall.position.set(W / 2 + 0.06, H / 2, 0);
      rightWall.receiveShadow = true;
      scene.add(rightWall);

      // Baseboards
      const bbBack = new THREE.Mesh(new THREE.BoxGeometry(W, 0.1, 0.025), matBaseboard);
      bbBack.position.set(0, 0.05, -D / 2 + 0.012);
      scene.add(bbBack);
      const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.1, D), matBaseboard);
      bbLeft.position.set(-W / 2 + 0.012, 0.05, 0);
      scene.add(bbLeft);
      const bbRight = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.1, D), matBaseboard);
      bbRight.position.set(W / 2 - 0.012, 0.05, 0);
      scene.add(bbRight);

      // 1. Limoon Home Catalog Signature 3D Geometric / Fluted Accent Wall Panel (Left-Center of Back Wall)
      const panelMat = new THREE.MeshStandardMaterial({ color: 0xc8beb0, roughness: 0.65 });
      const woodSlatMat = new THREE.MeshStandardMaterial({ color: 0x6e4c30, roughness: 0.42 });
      const panelBack = new THREE.Mesh(new THREE.BoxGeometry(1.15, H - 0.08, 0.025), panelMat);
      panelBack.position.set(-W * 0.22, H / 2 + 0.02, -D / 2 + 0.014);
      scene.add(panelBack);
      for (let si = -6; si <= 6; si++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.036, H - 0.12, 0.035), si % 2 === 0 ? woodSlatMat : panelMat);
        slat.position.set(-W * 0.22 + si * 0.085, H / 2 + 0.02, -D / 2 + 0.028);
        slat.castShadow = true;
        scene.add(slat);
      }

      // 2. Limoon Home Catalog Walnut-Framed Minimalist Gallery Artwork (Right-Center of Back Wall)
      const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(1.08, 1.38, 0.04), woodSlatMat);
      frameOuter.position.set(W * 0.18, 1.48, -D / 2 + 0.02);
      frameOuter.castShadow = true;
      scene.add(frameOuter);
      const artCanvas = new THREE.Mesh(
        new THREE.BoxGeometry(0.96, 1.26, 0.046),
        new THREE.MeshStandardMaterial({ color: 0xf6efe2, roughness: 0.85 })
      );
      artCanvas.position.set(W * 0.18, 1.48, -D / 2 + 0.022);
      scene.add(artCanvas);
      const artHorizon = new THREE.Mesh(
        new THREE.BoxGeometry(0.74, 0.06, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xb5893a, roughness: 0.5 })
      );
      artHorizon.position.set(W * 0.18, 1.62, -D / 2 + 0.024);
      scene.add(artHorizon);

      // 3. Right Window with Warm Architectural Venetian Blinds & Daylight Glow (matching limoon-koltuk-takimi.jpg!)
      const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.75, 1.85), matBaseboard);
      winFrame.position.set(W / 2 - 0.02, 1.45, 0.15);
      scene.add(winFrame);
      const winGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.055, 1.64, 1.72),
        new THREE.MeshStandardMaterial({ color: 0xfff8eb, emissive: 0xffeacc, emissiveIntensity: 0.55, roughness: 0.1 })
      );
      winGlass.position.set(W / 2 - 0.025, 1.45, 0.15);
      scene.add(winGlass);

      // 4. Decorative Indoor Botanical Pot in Back-Right Corner
      const potMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.13, 0.38, 20),
        new THREE.MeshStandardMaterial({ color: 0xf2eee6, roughness: 0.7 })
      );
      potMesh.position.set(W * 0.39, 0.19, -D * 0.38);
      potMesh.castShadow = true;
      scene.add(potMesh);
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x5c7457, roughness: 0.8 });
      for (const [fx, fy, fz, fr] of [
        [0, 0.68, 0, 0.24],
        [-0.12, 0.85, 0.08, 0.19],
        [0.11, 0.92, -0.06, 0.21],
      ]) {
        const leafCluster = new THREE.Mesh(new THREE.SphereGeometry(fr, 14, 12), foliageMat);
        leafCluster.position.set(W * 0.39 + fx, fy, -D * 0.38 + fz);
        leafCluster.castShadow = true;
        scene.add(leafCluster);
      }

      // 5. Large Centered Cream Woven Showroom Carpet with Subtle Border
      const rugBorder = new THREE.Mesh(
        new THREE.BoxGeometry(W * 0.78, 0.012, D * 0.72),
        new THREE.MeshStandardMaterial({ color: 0xd8cbb8, roughness: 0.94 })
      );
      rugBorder.position.set(0, 0.006, D * 0.03);
      rugBorder.receiveShadow = true;
      scene.add(rugBorder);

      const rug = new THREE.Mesh(
        new THREE.BoxGeometry(W * 0.74, 0.016, D * 0.68),
        new THREE.MeshStandardMaterial({ color: 0xf1ebe0, roughness: 0.96 })
      );
      rug.position.set(0, 0.008, D * 0.03);
      rug.receiveShadow = true;
      scene.add(rug);
    }

    const furnitureContainer = new THREE.Group();
    scene.add(furnitureContainer);
    furnitureContainerRef.current = furnitureContainer;
    pieceGroupsMapRef.current.clear();
    selectionRingsMapRef.current.clear();
    animTargetsRef.current = [];

    syncFurnitureInScene();

    // --- 1-FINGER WORLD-FLOOR RAYCAST DRAG + EMPTY-SPACE 360° ROOM LOOK + 2-FINGER PINCH/TWIST ---
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
      offsetX: number;
      offsetZ: number;
      moved: boolean;
    } | null = null;

    // When touching empty floor/background (or a locked piece) in Camera AR mode, swiping turns the 360° room camera view (helpful if phone browser blocks IMU)!
    let cameraPanState: {
      startX: number;
      startY: number;
      startYaw: number;
      startPitch: number;
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
        const grp = pieceGroupsMapRef.current.get(id);
        ring.visible = id === selectedId || !!grp?.userData?.isLocked;
      });
    };

    const handlePointerDown = (e: PointerEvent) => {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 2) {
        dragState = null;
        cameraPanState = null;
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
      const hits = raycaster.intersectObjects(clickableRootsRef.current, true);

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

      if (chosenRoot) {
        const instId = chosenRoot.userData.instanceId as string;
        onSelectRef.current?.(instId);
        highlightSelectedRing(instId);

        if (chosenRoot.userData.isLocked) {
          triggerFloorSnapFeedback(`🔒 ${chosenRoot.userData.name} zemine sabitli • Etrafında 360° dönebilirsiniz`);
          return;
        }

        let offsetX = 0;
        let offsetZ = 0;
        if (raycaster.ray.intersectPlane(floorPlane, planeIntersect) && raycaster.ray.direction.y < -0.04) {
          offsetX = chosenRoot.position.x - planeIntersect.x;
          offsetZ = chosenRoot.position.z - planeIntersect.z;
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
          offsetX,
          offsetZ,
          moved: false,
        };
        controls.enabled = false;
        try {
          renderer.domElement.setPointerCapture(e.pointerId);
        } catch {}
      } else if (isCameraARRef.current) {
        // Touching empty background in Camera AR lets user pan the 360° room view (or tap empty floor to snap active unlocked piece there!)
        cameraPanState = {
          startX: e.clientX,
          startY: e.clientY,
          startYaw: imuStateRef.current.manualYawDeg,
          startPitch: imuStateRef.current.manualPitchDeg,
        };
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (activePointers.has(e.pointerId)) {
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

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

      if (dragState && activePointers.size === 1) {
        if (!dragState.moved && Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY) > 4) {
          dragState.moved = true;
        }
        if (!dragState.moved) return;

        getNormalizedPointer(e.clientX, e.clientY);
        raycaster.setFromCamera(pointer, camera);
        // True 3D World-Floor Raycast: places the piece at the exact 3D world floor point (x, floorOffsetM, z) under the user's finger!
        if (raycaster.ray.direction.y < -0.02 && raycaster.ray.intersectPlane(floorPlane, planeIntersect)) {
          const maxR = isCameraARRef.current ? 6.5 : Math.max(W, D) * 0.9;
          const nextX = THREE.MathUtils.clamp(planeIntersect.x + dragState.offsetX, -maxR, maxR);
          const nextZ = THREE.MathUtils.clamp(planeIntersect.z + dragState.offsetZ, -maxR, maxR);
          const floorY = (dragState.root.userData.floorOffsetCm || 0) / 100;
          dragState.root.position.set(nextX, floorY, nextZ);
        }
        return;
      }

      if (cameraPanState && activePointers.size === 1 && isCameraARRef.current) {
        const dx = e.clientX - cameraPanState.startX;
        const dy = e.clientY - cameraPanState.startY;
        imuStateRef.current.manualYawDeg = cameraPanState.startYaw + dx * 0.25;
        imuStateRef.current.manualPitchDeg = THREE.MathUtils.clamp(cameraPanState.startPitch + dy * 0.15, -25, 25);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);

      if (pinchState && activePointers.size < 2) {
        const finishedPinch = pinchState;
        pinchState = null;
        isInteractingRef.current = false;
        controls.enabled = true;
        const s = finishedPinch.root.userData.scale ?? 1.0;
        const r = finishedPinch.root.userData.rotation ?? 0;
        onScaleRotateRef.current?.(finishedPinch.instanceId, s, r);
        const curW = Math.round(finishedPinch.widthCm * s);
        const curD = Math.round(finishedPinch.depthCm * s);
        triggerFloorSnapFeedback(`✓ ${finishedPinch.name}: ${curW}×${curD} cm • ${r}°`);
        return;
      }

      if (cameraPanState) {
        const panMoveDist = Math.hypot(e.clientX - cameraPanState.startX, e.clientY - cameraPanState.startY);
        cameraPanState = null;
        // Quick tap on empty carpet in Camera AR moves the currently selected unlocked piece directly to that floor point!
        if (panMoveDist < 7 && isCameraARRef.current && activeIdRef.current) {
          const activeGrp = pieceGroupsMapRef.current.get(activeIdRef.current);
          if (activeGrp && !activeGrp.userData?.isLocked) {
            getNormalizedPointer(e.clientX, e.clientY);
            raycaster.setFromCamera(pointer, camera);
            if (raycaster.ray.direction.y < -0.02 && raycaster.ray.intersectPlane(floorPlane, planeIntersect)) {
              const nextX = THREE.MathUtils.clamp(planeIntersect.x, -4.5, 4.5);
              const nextZ = THREE.MathUtils.clamp(planeIntersect.z, -4.5, 4.5);
              const floorY = (activeGrp.userData.floorOffsetCm || 0) / 100;
              activeGrp.position.set(nextX, floorY, nextZ);
              dropAnimMapRef.current.set(activeIdRef.current, 0.14);
              const newXCm = Math.round((nextX + W / 2) * 100 - (activeGrp.userData.widthCm || 100) / 2);
              const newYCm = Math.round((nextZ + D / 2) * 100 - (activeGrp.userData.depthCm || 100) / 2);
              onMoveRef.current?.(activeIdRef.current, newXCm, newYCm);
              triggerFloorSnapFeedback(`✓ ${activeGrp.userData.name} dokunduğunuz zemine oturdu`);
            }
          }
        }
      }

      if (!dragState) return;
      const finished = dragState;
      dragState = null;
      isInteractingRef.current = false;
      if (!isCameraARRef.current || !imuStateRef.current.hasSensor) {
        controls.enabled = true;
      }
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {}

      if (finished.moved) {
        // Trigger subtle floor settle bounce (0.12m -> 0m) when user releases finger!
        dropAnimMapRef.current.set(finished.instanceId, 0.12);
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
      if (raycaster.ray.direction.y < -0.03 && raycaster.ray.intersectPlane(floorPlane, planeIntersect)) {
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
    const resizeObs =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => handleResize())
        : null;
    resizeObs?.observe(container);

    const targetCameraQuat = new THREE.Quaternion();
    const aimRaycaster = new THREE.Raycaster();
    const aimNdc = new THREE.Vector2(0, -0.15);
    const aimHit = new THREE.Vector3();
    const camForward = new THREE.Vector3();
    let frameTick = 0;

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      frameTick++;

      if (isCameraARRef.current) {
        if (imuStateRef.current.hasSensor) {
          // Keep camera position steady at (0, 1.45, D * 0.68) and disable OrbitControls so touching a piece NEVER teleports or tilts the camera!
          controls.enabled = false;
          camera.position.set(0, 1.45, D * 0.68);
          const st = imuStateRef.current;
          const totalAlphaRad = THREE.MathUtils.degToRad(st.alphaDeg + st.manualYawDeg);
          const totalBetaRad = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(st.betaDeg + st.manualPitchDeg, 25, 85));
          const totalGammaRad = THREE.MathUtils.degToRad(st.gammaDeg);
          const screenOrientDeg =
            typeof window !== 'undefined' && window.screen?.orientation?.angle
              ? window.screen.orientation.angle
              : 0;
          setQuaternionFromDeviceIMU(
            targetCameraQuat,
            totalAlphaRad,
            totalBetaRad,
            totalGammaRad,
            THREE.MathUtils.degToRad(screenOrientDeg)
          );
          camera.quaternion.slerp(targetCameraQuat, 0.35);
        } else if (!isInteractingRef.current) {
          controls.update();
        }

        // Raycast from center of camera view onto the world floor plane (y = 0) to position the Auto-Ground Floor Reticle!
        aimRaycaster.setFromCamera(aimNdc, camera);
        let aimX = 0;
        let aimZ = 0;
        if (aimRaycaster.ray.direction.y < -0.04 && aimRaycaster.ray.intersectPlane(floorPlane, aimHit)) {
          aimX = THREE.MathUtils.clamp(aimHit.x, -3.5, 3.5);
          aimZ = THREE.MathUtils.clamp(aimHit.z, -3.5, 3.5);
        }

        if (floorReticleRef.current) {
          floorReticleRef.current.position.x += (aimX - floorReticleRef.current.position.x) * 0.35;
          floorReticleRef.current.position.z += (aimZ - floorReticleRef.current.position.z) * 0.35;
          const pulse = 1 + Math.sin(frameTick * 0.1) * 0.06;
          floorReticleRef.current.scale.set(pulse, pulse, pulse);
        }

        if (frameTick % 4 === 0 && onUpdateFloorAimRef.current) {
          const aimXCm = Math.round((aimX + W / 2) * 100);
          const aimYCm = Math.round((aimZ + D / 2) * 100);
          onUpdateFloorAimRef.current({ xCm: aimXCm, yCm: aimYCm, rotDeg: 0 });
        }
      }

      // 3. Auto-Ground Gravity Drop Spring Animation (settles newly spawned or dropped furniture smoothly onto floorOffsetM!)
      dropAnimMapRef.current.forEach((dropY, instId) => {
        const grp = pieceGroupsMapRef.current.get(instId);
        if (!grp) {
          dropAnimMapRef.current.delete(instId);
          return;
        }
        const floorY = (grp.userData.floorOffsetCm || 0) / 100;
        const nextY = dropY * 0.72;
        if (nextY < 0.003) {
          grp.position.y = floorY;
          dropAnimMapRef.current.delete(instId);
        } else {
          grp.position.y = floorY + nextY;
          dropAnimMapRef.current.set(instId, nextY);
        }
      });

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
      resizeObs?.disconnect();
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envSignature]);

  const setCameraPreset = (preset: 'corner' | 'walk' | 'top') => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const W = roomWidthCm / 100;
    const D = roomDepthCm / 100;
    if (preset === 'corner') {
      cam.position.set(0, 2.32, D * 1.18);
      ctrl.target.set(0, 0.58, -0.15);
    } else if (preset === 'walk') {
      cam.position.set(0, 1.48, D * 0.96);
      ctrl.target.set(0, 0.65, -0.35);
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

  const activePieceObj =
    placedPieces.find((p) => p.instanceId === activeInstanceId) ||
    placedPieces[placedPieces.length - 1] ||
    null;

  // Exports either ONLY the currently selected single piece (with its custom cm size & floor offset!) OR the user's multi-piece custom arrangement into a live .GLB and opens Qiens-style Native Hardware AR (ARCore / ARKit)!
  const launchNativeHardwareFloorAR = (
    mode: 'single' | 'all' = 'single',
    directSpec?: FurniturePieceSpec
  ) => {
    const mv = arModelViewerRef.current;
    if (!mv) return;

    // 1. Direct single-piece launch from the 1-tap piece picker when room was empty
    if (directSpec) {
      setShowSingleArPicker(false);
      onSpawnPieceFromAR?.(directSpec);
      const targetUrl = directSpec.url || '/models/limoon-berjer.glb';
      setArExportBlobUrl(targetUrl);
      mv.src = targetUrl;
      setTimeout(() => {
        if (typeof mv.activateAR === 'function') mv.activateAR();
      }, 100);
      return;
    }

    // 2. If room is currently empty, open the 1-tap single-piece picker instead of dumping all 4 pieces together!
    if (placedPieces.length === 0) {
      if (availablePieces.length > 0) {
        setShowSingleArPicker((prev) => !prev);
        return;
      }
      mv.src = '/models/limoon-3lu-koltuk.glb';
      setTimeout(() => {
        if (typeof mv.activateAR === 'function') mv.activateAR();
      }, 100);
      return;
    }

    setIsExportingAR(true);
    try {
      const exporter = new GLTFExporter();
      const exportClone = new THREE.Group();

      if (mode === 'single' && activePieceObj) {
        const targetGrp = pieceGroupsMapRef.current.get(activePieceObj.instanceId);
        if (targetGrp) {
          const clone = targetGrp.clone(true);
          // Center the single piece at (0, floorOffsetM, 0) so ARCore places it right on the carpet target reticle at its custom floor height & cm dimensions!
          const floorY = (activePieceObj.floorOffsetCm || 0) / 100;
          clone.position.set(0, floorY, 0);
          clone.children = clone.children.filter(
            (ch: any) => !(ch.geometry && (ch.geometry.type === 'RingGeometry' || ch.geometry.type === 'CircleGeometry'))
          );
          exportClone.add(clone);
        }
      } else {
        pieceGroupsMapRef.current.forEach((grp) => {
          const clone = grp.clone(true);
          clone.children = clone.children.filter(
            (ch: any) => !(ch.geometry && (ch.geometry.type === 'RingGeometry' || ch.geometry.type === 'CircleGeometry'))
          );
          exportClone.add(clone);
        });
      }

      if (exportClone.children.length === 0) {
        setIsExportingAR(false);
        const fallbackUrl = activePieceObj?.url || '/models/limoon-3lu-koltuk.glb';
        mv.src = fallbackUrl;
        setTimeout(() => {
          if (typeof mv.activateAR === 'function') mv.activateAR();
        }, 90);
        return;
      }

      exporter.parse(
        exportClone,
        (result) => {
          setIsExportingAR(false);
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: 'model/gltf-binary' });
            const url = URL.createObjectURL(blob);
            setArExportBlobUrl(url);
            mv.src = url;
            setTimeout(() => {
              if (typeof mv.activateAR === 'function') mv.activateAR();
            }, 140);
          }
        },
        () => {
          setIsExportingAR(false);
          mv.src = activePieceObj?.url || '/models/limoon-3lu-koltuk.glb';
          if (typeof mv.activateAR === 'function') mv.activateAR();
        },
        { binary: true }
      );
    } catch {
      setIsExportingAR(false);
      mv.src = activePieceObj?.url || '/models/limoon-3lu-koltuk.glb';
      if (typeof mv.activateAR === 'function') mv.activateAR();
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

      {/* Clean Step-by-Step Onboarding Card when Room / Camera starts empty */}
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
              {isCameraAR ? 'Yeşil Zemin Halkasını Köşeye Tutup Parça Seçin' : 'Üstten Yerleştirmek İstediğiniz Parçayı Seçin'}
            </h4>
            <p className="text-[11px] leading-relaxed" style={{ color: studioTheme.textMuted }}>
              {isCameraAR
                ? 'Telefonu yerleştirmek istediğiniz köşedeki zemine tutun ve yukarıdan + Tekli Berjer veya + 1. İkili Koltuk’a dokunun. Telefonu başka köşeye çevirdiğinizde ilk ürün koyduğunuz yerde sabit kalır.'
                : 'Yukarıdan + Tekli Berjer veya + 1. İkili Koltuk’a dokunun. Parmağınızla bıraktığınız konuma oturur.'}
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

      {/* Hidden Qiens-Style Native Hardware Floor AR Bridge (<model-viewer> with ARCore / ARKit Quick Look & auto resize/walk-around!) */}
      {showWebXRAR && (
        <WebXRMultiPieceAR
          availablePieces={availablePieces}
          placedPieces={placedPieces}
          studioTheme={studioTheme}
          onClose={() => setShowWebXRAR(false)}
        />
      )}
      <div className="sr-only pointer-events-none overflow-hidden w-0 h-0">
        <model-viewer
          ref={arModelViewerRef}
          src={arExportBlobUrl}
          alt="3D Mobilya AR"
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          ar-placement="floor"
          camera-controls
        />
      </div>

      {/* Prominent Top-Left Piece-by-Piece & Custom-Layout Floor AR Controls */}
      <div className={`absolute ${isFullScreen ? 'top-16' : 'top-3'} left-3 z-30 flex flex-col items-start gap-1.5`}>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => (webXRSupported ? setShowWebXRAR(true) : launchNativeHardwareFloorAR('single'))}
            className="px-3.5 py-2 rounded-full text-xs font-bold shadow-lg border flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 text-white"
            style={{
              backgroundColor: '#10b981',
              borderColor: '#059669',
            }}
            title="Her parçayı gerçek zemine ayrı ayrı oturtun, çevirin ve boyutlandırın"
          >
            <Box size={14} />
            <span>
              {webXRSupported
                ? 'Canlı AR: Parça Parça Yerleştir & Çevir'
                : isExportingAR
                ? 'Zemine Hazırlanıyor...'
                : activePieceObj
                ? `${activePieceObj.shortName} (${Math.round(
                    activePieceObj.widthCm * (activePieceObj.scale ?? 1)
                  )}×${Math.round(
                    activePieceObj.depthCm * (activePieceObj.scale ?? 1)
                  )} cm) Zemine Oturt (AR)`
                : 'Tek Tek Gerçek Zemine Oturt (AR)'}
            </span>
          </button>

          {placedPieces.length > 1 && !webXRSupported && (
            <button
              type="button"
              onClick={() => launchNativeHardwareFloorAR('all')}
              className="px-3 py-2 rounded-full text-[11px] font-bold shadow-md border flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
              style={{
                backgroundColor: studioTheme.bgCard,
                color: studioTheme.textPrimary,
                borderColor: studioTheme.accentHex,
              }}
              title="Dizdiğiniz tüm parçaları ayarladığınız konum ve ölçülerle birlikte gerçek zemine oturtun"
            >
              <Box size={13} style={{ color: studioTheme.accentHex }} />
              <span>Dizdiğin {placedPieces.length} Parçayı Beraber AR&apos;da Aç</span>
            </button>
          )}
        </div>

        {/* 1-Tap Single Piece AR Selector when user taps "Tek Tek Gerçek Zemine Oturt (AR)" while room is empty */}
        {showSingleArPicker && availablePieces.length > 0 && (
          <div
            className="rounded-2xl p-2.5 shadow-xl border flex flex-wrap items-center gap-1.5 max-w-md"
            style={{
              backgroundColor: `${studioTheme.bgCard}F8`,
              color: studioTheme.textPrimary,
              borderColor: studioTheme.accentHex,
            }}
          >
            <span className="text-[11px] font-bold w-full px-1" style={{ color: studioTheme.accentHex }}>
              Hangi parçayı tek başına halınıza/zemine oturtmak istersiniz?
            </span>
            {availablePieces.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => launchNativeHardwareFloorAR('single', spec)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer flex items-center gap-1 transition-all hover:opacity-90"
                style={{
                  backgroundColor: studioTheme.bgPage,
                  color: studioTheme.textPrimary,
                  borderColor: studioTheme.borderHex,
                }}
              >
                <Box size={11} style={{ color: '#10b981' }} />
                <span>
                  {spec.shortName} ({spec.widthCm}×{spec.depthCm} cm)
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

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
