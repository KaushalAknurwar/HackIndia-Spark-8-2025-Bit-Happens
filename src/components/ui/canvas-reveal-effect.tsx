"use client";
import { cn } from "@/lib/utils";
import { Canvas } from "@react-three/fiber";
import React from "react";

export const CanvasRevealEffect = ({
  containerClassName,
}: {
  containerClassName?: string;
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <Canvas
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.1} />
        </mesh>
      </Canvas>
    </div>
  );
};
