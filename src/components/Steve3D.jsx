import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Distance of the model from the camera
const MODEL_DISTANCE = 1.2;

const Model = ({ cursorPosition }) => {
  const modelRef = useRef();
  // Load the 3D model using useGLTF hook
  const { scene } = useGLTF("/Steve/scene.gltf");

  // Get access to the Three.js camera
  const { camera } = useThree();

  useEffect(() => {
    // Log the loaded model for debugging
    console.log("Model loaded:", scene);

    // Position the camera and make it look at the center of the scene
    camera.position.set(0, 0, MODEL_DISTANCE);
    camera.lookAt(0, 0, 0);

    // Center and scale the model to fit the view
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1 / maxDim;
    scene.scale.setScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));
  }, [scene, camera]);

  // This function runs on every frame render
  useFrame(() => {
    if (modelRef.current) {
      // Calculate rotation angles based on cursor position
      const { x, y } = cursorPosition;
      const angleY = Math.atan2(x, MODEL_DISTANCE);
      const angleX = Math.atan2(y, MODEL_DISTANCE);
      // Apply rotation to the model
      modelRef.current.rotation.y = angleY;
      modelRef.current.rotation.x = -angleX;
    }
  });

  // Render the 3D model
  return (
    <primitive object={scene} ref={modelRef} position={[0, 0, 0]} castShadow />
  );
};

const Scene = () => {
  // Store and update cursor position
  const cursorPosition = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    // Convert screen coordinates to normalized device coordinates
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;
    const newPosition = { x, y };
    cursorPosition.current = newPosition;
    setPosition(newPosition);
  };

  // Add and remove mouse move event listener
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Canvas shadows camera={{ position: [0, 0, MODEL_DISTANCE], fov: 60 }}>
      {/* Add ambient light for overall illumination */}
      <ambientLight intensity={1} />
      {/* Add point light for specific highlights */}
      <pointLight position={[10, 10, 10]} intensity={2} castShadow />
      {/* Add directional light for shadows */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Suspense is used for handling asynchronous loading of the model */}
      <Suspense fallback={null}>
        <Model cursorPosition={position} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
