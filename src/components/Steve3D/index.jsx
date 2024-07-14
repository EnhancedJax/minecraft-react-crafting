import { Canvas, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useState, useTransition } from "react";
import * as THREE from "three";
import { useApp } from "../../provider";
import SteveBody from "./containers/SteveBody";
import SteveHead from "./containers/SteveHead";

export default function Steve3D() {
  const cursorPosition = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const thisRef = useRef();
  const { skin } = useApp();
  const [isPending, startTransition] = useTransition();
  const [currentSkin, setCurrentSkin] = useState(skin);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = thisRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    const newPosition = { x, y };
    cursorPosition.current = newPosition;
    setPosition(newPosition);
  };

  const texture = useLoader(THREE.TextureLoader, currentSkin);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    startTransition(() => {
      setCurrentSkin(skin);
    });
  }, [skin]);

  return (
    <Canvas ref={thisRef}>
      <SteveHead cursorPosition={position} texture={texture} />
      <SteveBody cursorPosition={position} texture={texture} />
    </Canvas>
  );
}
