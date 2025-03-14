'use client';

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, ShaderMaterial } from "three";

import vertexShader from './vertexShaderLogo';
import fragmentShader from './fragmentShaderLogo';
// import vertexShader from './vertexShader';
// import fragmentShader from './fragmentShader';

export const MovingPlane = () => {
  // This reference will give us direct access to the mesh
  const shaderMaterialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_colorA: { value: new Color("#FFFF25") },
      u_colorB: { value: new Color("#FF9525") },
      u_patternColor: { value: new Color('#bc9c7c') },
    }), []
  );

  useFrame((state) => {
    const { clock } = state;
    if(!shaderMaterialRef.current) return;
    shaderMaterialRef.current.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.5}>
      <planeGeometry args={[2, 2, 256, 256]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
        ref={shaderMaterialRef}
      />
    </mesh>
  );
};
