'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import {
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';

type Props = { modelUrl: string; autoRotate?: boolean };

function GLTFModel({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
}

export default function ModelCanvas({ modelUrl, autoRotate = true }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.5, 2.2], fov: 35 }}
      className='rounded-2xl bg-transparent'
    >
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <GLTFModel url={modelUrl} />
        <Environment preset='city' />
        <ContactShadows opacity={0.35} blur={2.5} far={5} resolution={256} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        autoRotate={autoRotate}
      />
    </Canvas>
  );
}
