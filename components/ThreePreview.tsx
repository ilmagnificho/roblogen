import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';

// Roblox Shirt Template Dimensions
const T_W = 585;
const T_H = 559;

// Helper to calculate UV mapping for a specific part of the template
// Since standard BoxGeometry maps 0..1 to the whole face, we need to offset/repeat the texture
// to show only the correct part of the template on the correct face.
function getTextureMaterial(texture: THREE.Texture, x: number, y: number, w: number, h: number) {
  const cloned = texture.clone();
  cloned.colorSpace = THREE.SRGBColorSpace;
  cloned.magFilter = THREE.NearestFilter; // Pixelated look for Roblox style
  cloned.minFilter = THREE.NearestFilter;
  
  // Calculate repeat (scale)
  cloned.repeat.set(w / T_W, h / T_H);
  
  // Calculate offset
  // Texture origin (0,0) is bottom-left, but template coords (0,0) are top-left
  // offsetX = x / width
  // offsetY = (height - y - h) / height
  cloned.offset.set(x / T_W, (T_H - y - h) / T_H);
  cloned.needsUpdate = true;

  return new THREE.MeshStandardMaterial({ map: cloned, transparent: true });
}

const AvatarPart = ({ 
  texture, 
  position, 
  size, 
  mapping 
}: { 
  texture: THREE.Texture | null, 
  position: [number, number, number], 
  size: [number, number, number],
  mapping: { [key: string]: { x: number, y: number, w: number, h: number } } 
}) => {
  
  const materials = useMemo(() => {
    if (!texture) return new THREE.MeshStandardMaterial({ color: '#cccccc' });

    // Order: Right, Left, Top, Bottom, Front, Back
    const matRight = getTextureMaterial(texture, mapping.right.x, mapping.right.y, mapping.right.w, mapping.right.h);
    const matLeft = getTextureMaterial(texture, mapping.left.x, mapping.left.y, mapping.left.w, mapping.left.h);
    const matTop = getTextureMaterial(texture, mapping.up.x, mapping.up.y, mapping.up.w, mapping.up.h);
    const matBottom = getTextureMaterial(texture, mapping.down.x, mapping.down.y, mapping.down.w, mapping.down.h);
    const matFront = getTextureMaterial(texture, mapping.front.x, mapping.front.y, mapping.front.w, mapping.front.h);
    const matBack = getTextureMaterial(texture, mapping.back.x, mapping.back.y, mapping.back.w, mapping.back.h);

    return [matRight, matLeft, matTop, matBottom, matFront, matBack];
  }, [texture, mapping]);

  return (
    <mesh position={new THREE.Vector3(...position)} material={Array.isArray(materials) ? materials : undefined}>
      <boxGeometry args={[...size]} />
      {!Array.isArray(materials) && <meshStandardMaterial color="#999999" />}
    </mesh>
  );
};

export const ThreePreview = ({ imageUrl }: { imageUrl: string | null }) => {
  const texture = useMemo(() => {
    if (!imageUrl) return null;
    const loader = new THREE.TextureLoader();
    return loader.load(imageUrl);
  }, [imageUrl]);

  // Dimensions based on Roblox R15/Blocky scaling (approx)
  // Torso: 2x2x1
  // Arms: 1x2x1
  // Head: 1x1x1 (Scale 1.2)

  // Mapping coordinates from constants.ts but hardcoded here for 3D logic to keep self-contained
  const torsoMapping = {
    front: { x: 231, y: 74, w: 128, h: 128 },
    back: { x: 427, y: 74, w: 128, h: 128 },
    left: { x: 363, y: 74, w: 64, h: 128 }, // Avatar Left is Texture Left (from viewer perspective looking at front)
    right: { x: 162, y: 74, w: 64, h: 128 },
    up: { x: 231, y: 0, w: 128, h: 64 }, // Top
    down: { x: 231, y: 202, w: 128, h: 64 }, // Bottom
  };

  const leftArmMapping = {
    front: { x: 335, y: 329, w: 64, h: 128 },
    back: { x: 467, y: 329, w: 64, h: 128 },
    left: { x: 401, y: 329, w: 64, h: 128 },
    right: { x: 533, y: 329, w: 64, h: 128 }, // Inner side usually
    up: { x: 335, y: 265, w: 64, h: 64 },
    down: { x: 335, y: 457, w: 64, h: 64 },
  };

  const rightArmMapping = {
    front: { x: 198, y: 329, w: 64, h: 128 },
    back: { x: 66, y: 329, w: 64, h: 128 },
    left: { x: 0, y: 329, w: 64, h: 128 }, // Inner side
    right: { x: 132, y: 329, w: 64, h: 128 }, // Outer side
    up: { x: 198, y: 265, w: 64, h: 64 },
    down: { x: 198, y: 457, w: 64, h: 64 },
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 rounded-full text-xs font-bold text-white pointer-events-none">
        3D Preview (Drag to Rotate)
      </div>
      <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        <group position={[0, -1, 0]}>
          {/* Head (Dummy) */}
          <mesh position={[0, 3.5, 0]}>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial color="#f1c40f" /> {/* Classic yellow head */}
          </mesh>

          {/* Torso */}
          <AvatarPart 
            texture={texture} 
            position={[0, 2, 0]} 
            size={[2, 2, 1]} 
            mapping={torsoMapping} 
          />

          {/* Left Arm (Viewer's right) */}
          <AvatarPart 
            texture={texture} 
            position={[1.5, 2, 0]} 
            size={[1, 2, 1]} 
            mapping={leftArmMapping} 
          />

          {/* Right Arm (Viewer's left) */}
          <AvatarPart 
            texture={texture} 
            position={[-1.5, 2, 0]} 
            size={[1, 2, 1]} 
            mapping={rightArmMapping} 
          />

          {/* Legs (Dummy - simple color for now as we focused on shirt) */}
          <mesh position={[-0.5, 0, 0]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#34495e" /> {/* Dark pants */}
          </mesh>
          <mesh position={[0.5, 0, 0]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#34495e" /> {/* Dark pants */}
          </mesh>
        </group>

        <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  );
};