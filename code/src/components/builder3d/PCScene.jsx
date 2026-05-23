import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import PCChassis from './PCChassis';
import { RGBAnimProvider } from './RGBEffect';
import { useBuild } from '../../context/BuildContext';
import { useRGB } from '../../context/RGBContext';

function SceneLights({ color }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[8, 12, 8]} intensity={0.8} color="#ffffff" castShadow />
      <directionalLight position={[-4, 6, -4]} intensity={0.2} color={color} />
      <pointLight position={[0, 4, 3]} intensity={0.8} color={color} distance={15} decay={1.5} />
      <pointLight position={[3, -1, 4]} intensity={0.5} color={color} distance={12} decay={1.5} />
      {/* 底部补光 */}
      <pointLight position={[0, -3, 0]} intensity={0.3} color={color} distance={10} />
    </>
  );
}

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshPhysicalMaterial
        color="#0a0a10"
        metalness={1.0}
        roughness={0.08}
        transparent
        opacity={0.6}
        envMapIntensity={1.0}
      />
    </mesh>
  );
}

export default function PCScene() {
  const { color } = useRGB();
  const { poweredOn } = useBuild();

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-[#0a0a0b] via-[#080810] to-[#030308] relative">
      <Canvas
        camera={{ position: [7, 4.5, 7], fov: 28 }}
        gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.0 }}
        shadows
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneLights color={color} />
          <GroundPlane />
          <RGBAnimProvider>
            <PCChassis powered={poweredOn} />
          </RGBAnimProvider>
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={18}
            autoRotate={!poweredOn}
            autoRotateSpeed={0.8}
            target={[0, 0.2, 0]}
            dampingFactor={0.08}
            enableDamping
          />
          <Environment preset="night" />

          {/* 后期处理：Bloom 辉光 */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.7}
              intensity={poweredOn ? 1.2 : 0.4}
              mipmapBlur
            />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} exposure={1.0} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* 操作提示 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="font-label-sm text-label-sm text-on-surface-variant/40">
          🖱 拖拽旋转 · 滚轮缩放
        </span>
      </div>
    </div>
  );
}
