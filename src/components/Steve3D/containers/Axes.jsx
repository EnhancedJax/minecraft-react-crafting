import React, { useEffect, useRef } from "react";
import * as THREE from "three";
const AXIS_LENGTH = 4;

// Helper function to create an axis line
const createAxisLine = (color, direction) => {
  const material = new THREE.LineBasicMaterial({ color });
  const points = [
    new THREE.Vector3(0, 0, 0),
    direction.clone().multiplyScalar(AXIS_LENGTH),
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, material);
};

// Axes component
export default function Axes() {
  const axesRef = useRef();

  useEffect(() => {
    const axesGroup = new THREE.Group();
    axesGroup.add(createAxisLine(0xff0000, new THREE.Vector3(1, 0, 0))); // X-axis (red)
    axesGroup.add(createAxisLine(0x00ff00, new THREE.Vector3(0, 1, 0))); // Y-axis (green)
    axesGroup.add(createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 1))); // Z-axis (blue)
    axesRef.current.add(axesGroup);
  }, []);

  return <group ref={axesRef} />;
}
