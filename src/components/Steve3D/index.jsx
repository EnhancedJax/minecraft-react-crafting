import { Canvas, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import SteveBody from "./containers/SteveBody";
import SteveHead from "./containers/SteveHead";

export default function Steve3D() {
  const cursorPosition = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const thisRef = useRef();

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = thisRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    const newPosition = { x, y };
    cursorPosition.current = newPosition;
    setPosition(newPosition);
  };
  const texture = useLoader(THREE.TextureLoader, "/Steve_64x64.png");
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Canvas ref={thisRef}>
      {/* <ambientLight intensity={0.2} /> */}
      {/* <pointLight position={[10, 10, 10]} intensity={0.4} /> */}
      {/* <Axes /> */}
      <SteveHead cursorPosition={position} texture={texture} />
      <SteveBody cursorPosition={position} texture={texture} />
    </Canvas>
  );
}
