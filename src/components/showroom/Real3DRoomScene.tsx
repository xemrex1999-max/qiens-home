"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DoorOpen, Eye, Compass, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { PlacedPiece } from './ShowroomRoomPlanner';

interface Real3DRoomSceneProps {
  placedPieces: PlacedPiece[];
  roomWidthCm: number;
  roomDepthCm: number;
  selectedColor: string;
  onTogglePieceOpen: (instanceId: string) => void;
  onToggleAllOpen: () => void;
  heightClass?: string;
}

const PALETTES: Record<string, { main: number; wood: number; accent: number }> = {
  'Doğal Meşe': { main: 0xc8ad86, wood: 0x7c5c3a, accent: 0xd4af37 },
  'Ceviz': { main: 0x6b4428, wood: 0x3f2514, accent: 0xd4af37 },
  'Krem': { main: 0xeae0c8, wood: 0xa68e6e, accent: 0xd4af37 },
  'Krem Boucle': { main: 0xede5d4, wood: 0xa68e6e, accent: 0xd4af37 },
  'Antrasit': { main: 0x2e333b, wood: 0x1d2026, accent: 0xd4af37 },
  'Zümrüt Yeşili': { main: 0x18523d, wood: 0x3b2718, accent: 0xd4af37 },
  'Safir Mavi': { main: 0x1e3f6e, wood: 0x2a3340, accent: 0xd4af37 },
  'Mat Siyah': { main: 0x222227, wood: 0x141418, accent: 0xd4af37 },
  'Beyaz Mermer': { main: 0xf0efeb, wood: 0x9e9589, accent: 0xd4af37 },
  'Altın Detaylı Beyaz': { main: 0xf5f2ea, wood: 0xc5a059, accent: 0xd4af37 },
  'Bej': { main: 0xdfd3c3, wood: 0x8f775c, accent: 0xd4af37 },
};

function createParquetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#5c422c';
    ctx.fillRect(0, 0, 512, 512);
    const plankW = 128;
    const plankH = 32;
    for (let y = 0; y < 512; y += plankH) {
      const offset = ((y / plankH) % 2) * (plankW / 2);
      for (let x = -plankW; x < 512 + plankW; x += plankW) {
        const shade = ((x * 7 + y * 13) % 24) - 12;
        ctx.fillStyle = `rgb(${102 + shade}, ${74 + Math.round(shade * 0.7)}, ${49 + Math.round(shade * 0.5)})`;
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
  onTogglePieceOpen,
  onToggleAllOpen,
  heightClass = 'h-[480px] sm:h-[600px]',
}: Real3DRoomSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animTargetsRef = useRef<AnimTarget[]>([]);
  const openStateMapRef = useRef<Record<string, boolean>>({});
  const onToggleRef = useRef(onTogglePieceOpen);
  const [lastClickedName, setLastClickedName] = useState<string | null>(null);

  onToggleRef.current = onTogglePieceOpen;

  // Keep openStateMap synced without rebuilding the entire WebGL scene!
  useEffect(() => {
    const map: Record<string, boolean> = {};
    placedPieces.forEach((p) => {
      map[p.instanceId] = !!p.isOpen;
    });
    openStateMapRef.current = map;
  }, [placedPieces]);

  // Structure key: rebuild geometry only when positions/rotations/count/room/color change
  const layoutSignature = JSON.stringify({
    roomWidthCm,
    roomDepthCm,
    selectedColor,
    items: placedPieces.map((p) => ({
      id: p.instanceId,
      t: p.type,
      x: p.xCm,
      y: p.yCm,
      w: p.widthCm,
      d: p.depthCm,
      h: p.heightCm,
      r: p.rotation,
    })),
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0d12);
    scene.fog = new THREE.FogExp2(0x0c0d12, 0.042);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 50);
    const W = roomWidthCm / 100;
    const D = roomDepthCm / 100;
    const H = 2.65;

    camera.position.set(W * 0.85, 3.6, D * 1.15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 1.8;
    controls.maxDistance = 14;
    controls.target.set(0, 0.65, 0);
    controls.update();
    controlsRef.current = controls;

    // --- LIGHTING ---
    const hemi = new THREE.HemisphereLight(0xfff6e8, 0x26222e, 0.95);
    scene.add(hemi);

    const sunLight = new THREE.DirectionalLight(0xfff1dc, 1.85);
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

    const warmFill = new THREE.PointLight(0xffd296, 1.2, 12);
    warmFill.position.set(-W * 0.3, 2.2, D * 0.25);
    scene.add(warmFill);

    // --- MATERIALS ---
    const pal = PALETTES[selectedColor] || PALETTES['Doğal Meşe'];
    const matMain = new THREE.MeshStandardMaterial({ color: pal.main, roughness: 0.65, metalness: 0.04 });
    const matWood = new THREE.MeshStandardMaterial({ color: pal.wood, roughness: 0.45, metalness: 0.05 });
    const matInterior = new THREE.MeshStandardMaterial({ color: 0x3b2c20, roughness: 0.7 });
    const matGold = new THREE.MeshStandardMaterial({ color: pal.accent, roughness: 0.22, metalness: 0.88 });
    const matMirror = new THREE.MeshPhysicalMaterial({ color: 0xd6e6f2, roughness: 0.05, metalness: 0.92, clearcoat: 1.0 });
    const matMarble = new THREE.MeshStandardMaterial({ color: 0xf4f2ee, roughness: 0.16, metalness: 0.05 });
    const matPillow = new THREE.MeshStandardMaterial({ color: 0xf7f4ee, roughness: 0.85 });
    const matLamp = new THREE.MeshStandardMaterial({ color: 0xffecc2, emissive: 0xffc86b, emissiveIntensity: 0.65, roughness: 0.4 });
    const matWall = new THREE.MeshStandardMaterial({ color: 0x26242a, roughness: 0.9 });
    const matBaseboard = new THREE.MeshStandardMaterial({ color: 0x3b3532, roughness: 0.5 });

    // --- ROOM ARCHITECTURE ---
    const floorTex = createParquetTexture();
    const floorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(W + 0.24, 0.14, D + 0.24),
      new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.55, metalness: 0.05 })
    );
    floorMesh.position.set(0, -0.07, 0);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Back Wall (North, -Z)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, H, 0.12), matWall);
    backWall.position.set(0, H / 2, -D / 2 - 0.06);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall (West, -X)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, H, D + 0.12), matWall);
    leftWall.position.set(-W / 2 - 0.06, H / 2, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Architectural Baseboards
    const bbBack = new THREE.Mesh(new THREE.BoxGeometry(W, 0.11, 0.025), matBaseboard);
    bbBack.position.set(0, 0.055, -D / 2 + 0.012);
    scene.add(bbBack);
    const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.11, D), matBaseboard);
    bbLeft.position.set(-W / 2 + 0.012, 0.055, 0);
    scene.add(bbLeft);

    // Glowing Window on Left Wall
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.35, 1.55), matBaseboard);
    winFrame.position.set(-W / 2 + 0.02, 1.48, 0);
    scene.add(winFrame);
    const winGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.22, 1.42),
      new THREE.MeshStandardMaterial({ color: 0xaad8ff, emissive: 0x7cbfff, emissiveIntensity: 0.55, roughness: 0.1 })
    );
    winGlass.position.set(-W / 2 + 0.025, 1.48, 0);
    scene.add(winGlass);

    // Center Carpet / Rug
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.56, 0.014, D * 0.54),
      new THREE.MeshStandardMaterial({ color: 0x3b352d, roughness: 0.96 })
    );
    rug.position.set(0, 0.007, D * 0.05);
    rug.receiveShadow = true;
    scene.add(rug);

    // --- FURNITURE BUILDERS WITH REAL 3D ANIMATED JOINTS ---
    const animTargets: AnimTarget[] = [];
    const clickableRoots: THREE.Object3D[] = [];

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
      root.userData = { instanceId: item.instanceId, name: item.name };

      const pw = item.widthCm / 100;
      const pd = item.depthCm / 100;
      const ph = item.heightCm / 100;

      // Exact center position synced 1:1 with the 2D planner canvas!
      const cx = (item.xCm + item.widthCm / 2) / 100 - W / 2;
      const cz = (item.yCm + item.depthCm / 2) / 100 - D / 2;
      root.position.set(cx, 0, cz);
      root.rotation.y = -THREE.MathUtils.degToRad(item.rotation);

      if (item.type === 'wardrobe') {
        // Hollow wardrobe shell (back, top, bottom, left, right, vertical dividers)
        root.add(mkBox(pw, ph - 0.08, 0.04, matWood, 0, (ph + 0.08) / 2, -pd / 2 + 0.02));
        root.add(mkBox(0.04, ph - 0.08, pd, matWood, -pw / 2 + 0.02, (ph + 0.08) / 2, 0));
        root.add(mkBox(0.04, ph - 0.08, pd, matWood, pw / 2 - 0.02, (ph + 0.08) / 2, 0));
        root.add(mkBox(pw, 0.04, pd, matWood, 0, ph - 0.02, 0));
        root.add(mkBox(pw, 0.08, pd - 0.03, matGold, 0, 0.04, -0.01));
        // Interior dividers & shelves
        root.add(mkBox(0.03, ph - 0.14, pd - 0.06, matInterior, -pw / 6, ph / 2, -0.02));
        root.add(mkBox(0.03, ph - 0.14, pd - 0.06, matInterior, pw / 6, ph / 2, -0.02));
        for (const sy of [0.55, 0.98, 1.42, 1.82]) {
          root.add(mkBox(pw / 3 - 0.05, 0.025, pd - 0.1, matInterior, -pw / 3, sy, -0.02));
          root.add(mkBox(pw / 3 - 0.05, 0.025, pd - 0.1, matInterior, pw / 3, sy, -0.02));
        }
        // Center hanging clothes rail + folded shirts
        const rail = mkCyl(0.014, pw / 3 - 0.06, matGold, 0, ph - 0.34, -0.02);
        rail.rotation.z = Math.PI / 2;
        root.add(rail);
        for (let ci = -2; ci <= 2; ci++) {
          root.add(mkBox(0.06, 0.72, 0.36, ci % 2 === 0 ? matMain : matPillow, ci * 0.11, ph - 0.76, -0.02));
        }
        // 4 Animated Swinging 3D Doors!
        const doorW = (pw - 0.06) / 4;
        for (let di = 0; di < 4; di++) {
          const isLeftHinge = di % 2 === 0;
          const hingeX = -pw / 2 + 0.03 + di * doorW + (isLeftHinge ? 0 : doorW);
          const pivot = new THREE.Group();
          pivot.position.set(hingeX, ph / 2 + 0.03, pd / 2);

          const isMirror = di === 1 || di === 2;
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
        // 4 Gold Legs
        for (const sx of [-pw / 2 + 0.1, pw / 2 - 0.1]) {
          for (const sz of [-pd / 2 + 0.12, pd / 2 - 0.12]) {
            root.add(mkCyl(0.025, 0.1, matGold, sx, 0.05, sz));
          }
        }
        // Hollow Baza Storage Frame (4 walls + floor + storage blankets inside!)
        root.add(mkBox(pw, 0.04, pd - 0.12, matInterior, 0, 0.12, 0.04));
        root.add(mkBox(pw, 0.28, 0.05, matMain, 0, 0.24, pd / 2 - 0.025));
        root.add(mkBox(0.05, 0.28, pd - 0.12, matMain, -pw / 2 + 0.025, 0.24, 0.04));
        root.add(mkBox(0.05, 0.28, pd - 0.12, matMain, pw / 2 - 0.025, 0.24, 0.04));
        root.add(mkBox(0.04, 0.24, pd - 0.24, matWood, 0, 0.23, 0.04));
        // Folded Quilts inside baza box
        root.add(mkBox(pw * 0.36, 0.16, pd * 0.45, matPillow, -pw * 0.23, 0.22, 0.06));
        root.add(mkBox(pw * 0.36, 0.14, pd * 0.42, matGold, pw * 0.23, 0.21, 0.1));

        // Tufted Headboard (Back -Z)
        root.add(mkBox(pw + 0.14, ph, 0.1, matWood, 0, ph / 2, -pd / 2 + 0.04));
        for (let hi = 0; hi < 4; hi++) {
          const hx = -pw * 0.37 + hi * (pw * 0.245);
          root.add(mkBox(pw * 0.22, ph * 0.78, 0.06, matMain, hx, ph * 0.54, -pd / 2 + 0.1));
        }
        root.add(mkBox(pw + 0.16, 0.03, 0.03, matGold, 0, ph - 0.02, -pd / 2 + 0.09));

        // Animated Hydraulic Lift Mattress Assembly (Pivots from Headboard!)
        const bazaPivot = new THREE.Group();
        bazaPivot.position.set(0, 0.38, -pd / 2 + 0.14);

        const matt = mkBox(pw - 0.08, 0.24, pd - 0.18, matPillow, 0, 0.12, (pd - 0.18) / 2);
        bazaPivot.add(matt);
        const duvet = mkBox(pw - 0.04, 0.25, (pd - 0.18) * 0.65, matMain, 0, 0.125, (pd - 0.18) * 0.67);
        bazaPivot.add(duvet);
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
        // Main Carcass + Marble Top
        root.add(mkBox(pw, bodyH, pd - 0.04, matWood, 0, legH + bodyH / 2, -0.02));
        root.add(mkBox(pw + 0.02, 0.03, pd + 0.02, matMarble, 0, legH + bodyH + 0.015, 0));

        // Animated 3D Sliding Drawers!
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

            // Front face + gold handle + hollow inner box!
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

        // Mirror on Dresser/Console or Warm Glowing Lamp on Nightstand!
        if (item.type === 'nightstand') {
          const topY = legH + bodyH + 0.03;
          root.add(mkCyl(0.06, 0.03, matGold, 0, topY + 0.015, 0));
          root.add(mkCyl(0.014, 0.22, matGold, 0, topY + 0.13, 0));
          root.add(mkCyl(0.11, 0.17, matLamp, 0, topY + 0.26, 0));
        } else {
          const topY = legH + bodyH + 0.03;
          if (item.type === 'dresser') {
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
        }
      } else if (item.type === 'table') {
        // Pedestals
        root.add(mkBox(0.16, ph - 0.06, pd * 0.55, matWood, -pw * 0.28, (ph - 0.06) / 2, 0));
        root.add(mkBox(0.16, ph - 0.06, pd * 0.55, matWood, pw * 0.28, (ph - 0.06) / 2, 0));
        root.add(mkBox(0.22, 0.04, pd * 0.6, matGold, -pw * 0.28, 0.02, 0));
        root.add(mkBox(0.22, 0.04, pd * 0.6, matGold, pw * 0.28, 0.02, 0));
        // Split Extendable Marble Table Top!
        const leftHalf = mkBox(pw / 2, 0.055, pd, matMarble, -pw / 4, ph - 0.028, 0);
        const rightHalf = mkBox(pw / 2, 0.055, pd, matMarble, pw / 4, ph - 0.028, 0);
        const centerLeaf = mkBox(0.42, 0.05, pd - 0.04, matGold, 0, ph - 0.09, 0);
        root.add(leftHalf, rightHalf, centerLeaf);
        animTargets.push(
          { type: 'table-left', object: leftHalf, instanceId: item.instanceId, basePos: leftHalf.position.clone(), baseRot: leftHalf.rotation.clone() },
          { type: 'table-right', object: rightHalf, instanceId: item.instanceId, basePos: rightHalf.position.clone(), baseRot: rightHalf.rotation.clone() },
          { type: 'table-leaf', object: centerLeaf, instanceId: item.instanceId, basePos: centerLeaf.position.clone(), baseRot: centerLeaf.rotation.clone() }
        );
      } else if (item.type === 'sofa3' || item.type === 'sofa2' || item.type === 'armchair') {
        root.add(mkBox(pw, 0.16, pd, matWood, 0, 0.2, 0));
        root.add(mkBox(pw, ph * 0.72, 0.22, matMain, 0, 0.28 + ph * 0.34, -pd / 2 + 0.11));
        root.add(mkBox(0.2, 0.44, pd, matMain, -pw / 2 + 0.1, 0.42, 0));
        root.add(mkBox(0.2, 0.44, pd, matMain, pw / 2 - 0.1, 0.42, 0));
        root.add(mkBox(pw - 0.42, 0.18, pd - 0.2, matMain, 0, 0.36, 0.08));
        // Throw Pillows
        const pCount = item.type === 'sofa3' ? 3 : item.type === 'sofa2' ? 2 : 1;
        for (let pi = 0; pi < pCount; pi++) {
          const px = pCount === 1 ? 0 : -pw * 0.28 + pi * ((pw * 0.56) / (pCount - 1));
          const tp = mkBox(0.34, 0.32, 0.12, matPillow, px, 0.58, -pd / 2 + 0.28);
          tp.rotation.x = 0.2;
          root.add(tp);
        }
        for (const sx of [-pw / 2 + 0.12, pw / 2 - 0.12]) {
          for (const sz of [-pd / 2 + 0.12, pd / 2 - 0.12]) {
            root.add(mkCyl(0.02, 0.14, matGold, sx, 0.07, sz));
          }
        }
      } else if (item.type === 'chair') {
        root.add(mkBox(pw, 0.08, pd, matMain, 0, 0.46, 0));
        root.add(mkBox(pw, 0.44, 0.08, matMain, 0, 0.7, -pd / 2 + 0.04));
        for (const sx of [-pw / 2 + 0.05, pw / 2 - 0.05]) {
          for (const sz of [-pd / 2 + 0.05, pd / 2 - 0.05]) {
            root.add(mkCyl(0.015, 0.44, matGold, sx, 0.22, sz));
          }
        }
      } else {
        // Coffee table, Pouf, TV Unit
        root.add(mkBox(pw, ph * 0.55, pd, item.type === 'coffeetable' ? matMarble : matMain, 0, ph * 0.72, 0));
        for (const sx of [-pw / 2 + 0.08, pw / 2 - 0.08]) {
          for (const sz of [-pd / 2 + 0.08, pd / 2 - 0.08]) {
            root.add(mkCyl(0.016, ph * 0.5, matGold, sx, ph * 0.25, sz));
          }
        }
      }

      scene.add(root);
      clickableRoots.push(root);
    });

    animTargetsRef.current = animTargets;

    // --- RAYCASTER CLICK TO OPEN/CLOSE 3D DOORS, DRAWERS, BAZA ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 7) return; // Ignore orbit drags
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableRoots, true);
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.userData?.instanceId) {
          obj = obj.parent;
        }
        if (obj?.userData?.instanceId) {
          onToggleRef.current(obj.userData.instanceId);
          setLastClickedName(obj.userData.name || 'Mobilya');
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // --- RESIZE OBSERVER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP (SMOOTH 60FPS DOOR/DRAWER/BAZA INTERPOLATION) ---
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();

      const openMap = openStateMapRef.current;
      for (const target of animTargetsRef.current) {
        const isOpen = !!openMap[target.instanceId];
        if (target.type === 'door-left') {
          const goal = isOpen ? -1.3 : 0;
          target.object.rotation.y += (goal - target.object.rotation.y) * 0.12;
        } else if (target.type === 'door-right') {
          const goal = isOpen ? 1.3 : 0;
          target.object.rotation.y += (goal - target.object.rotation.y) * 0.12;
        } else if (target.type === 'drawer') {
          const goalZ = target.basePos.z + (isOpen ? 0.24 : 0);
          target.object.position.z += (goalZ - target.object.position.z) * 0.14;
        } else if (target.type === 'baza') {
          const goalX = isOpen ? -0.66 : 0;
          target.object.rotation.x += (goalX - target.object.rotation.x) * 0.1;
        } else if (target.type === 'table-left') {
          const goalX = target.basePos.x - (isOpen ? 0.22 : 0);
          target.object.position.x += (goalX - target.object.position.x) * 0.12;
        } else if (target.type === 'table-right') {
          const goalX = target.basePos.x + (isOpen ? 0.22 : 0);
          target.object.position.x += (goalX - target.object.position.x) * 0.12;
        } else if (target.type === 'table-leaf') {
          const goalY = target.basePos.y + (isOpen ? 0.062 : 0);
          target.object.position.y += (goalY - target.object.position.y) * 0.12;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
      floorTex.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutSignature]);

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
    if (dir.length() >= 1.8 && dir.length() <= 14) {
      cam.position.copy(ctrl.target).add(dir);
      ctrl.update();
    }
  };

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden border border-amber-400/40 bg-[#0c0d12] shadow-2xl">
      {/* Live 3D WebGL Mount */}
      <div ref={mountRef} className={`w-full ${heightClass} cursor-grab active:cursor-grabbing`} />

      {/* Top HUD */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-black/75 backdrop-blur-md border border-amber-400/40 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          GERÇEK 3D WEBGL ODA • FARE / PARMAKLA 360° DÖNDÜR, MOBİLYAYA TIKLA AÇ!
        </div>

        <button
          type="button"
          onClick={onToggleAllOpen}
          className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 cursor-pointer pointer-events-auto"
        >
          <DoorOpen size={13} /> Tüm Kapak / Çekmece / Bazayı Aç-Kapa
        </button>
      </div>

      {/* Feedback Toast when user clicks a 3D piece */}
      {lastClickedName && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/80 border border-emerald-400/50 text-emerald-300 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider pointer-events-none">
          ✨ {lastClickedName} Kapak / Baza Durumu Değiştirildi
        </div>
      )}

      {/* Bottom Camera Preset Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/15 p-1.5 rounded-full pointer-events-auto">
          <button
            type="button"
            onClick={() => setCameraPreset('corner')}
            className="px-3 py-1.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"
          >
            <Compass size={11} /> 3D Köşe
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('walk')}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"
          >
            <Eye size={11} /> Odanın İçinden
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('top')}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={11} /> Kuşbakışı
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/15 p-1.5 rounded-full pointer-events-auto">
          <button type="button" onClick={() => adjustZoom(0.82)} className="p-2 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-white cursor-pointer" title="Yakınlaş">
            <ZoomIn size={14} />
          </button>
          <button type="button" onClick={() => adjustZoom(1.22)} className="p-2 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-white cursor-pointer" title="Uzaklaş">
            <ZoomOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
