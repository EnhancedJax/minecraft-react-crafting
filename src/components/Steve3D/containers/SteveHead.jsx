import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createBodyPart, getTexture } from "../../../utils/steve3D";
import {
  HEAD_ANGLE_DISTANCE_OFFSET,
  HEAD_OFFSET,
  HEAD_SCALE,
  PLAYER_DISTANCE,
} from "../constants";

export default function SteveHead({ cursorPosition, texture }) {
  const playerRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, PLAYER_DISTANCE);
    camera.lookAt(0, 0, 0);

    const player = new THREE.Group();

    // Head
    player.add(
      createBodyPart(
        8 / 64,
        8 / 64,
        8 / 64,
        [
          getTexture(texture, 16, 8, 8, 8), // Right
          getTexture(texture, 0, 8, 8, 8), // Left
          getTexture(texture, 8, 0, 8, 8), // Top
          getTexture(texture, 16, 0, 8, 8), // Bottom
          getTexture(texture, 8, 8, 8, 8), // Front
          getTexture(texture, 24, 8, 8, 8), // Back
        ],
        0,
        28 / 64,
        0
      )
    );

    playerRef.current.add(player);

    // Scale the entire player
    player.scale.setScalar(HEAD_SCALE);
    player.translateY(HEAD_OFFSET);
  }, [camera, texture]);

  useFrame(() => {
    if (playerRef.current) {
      const { x, y } = cursorPosition;
      const angleY = Math.atan2(
        x,
        PLAYER_DISTANCE - HEAD_ANGLE_DISTANCE_OFFSET
      );
      const angleX = Math.atan2(
        y,
        PLAYER_DISTANCE - HEAD_ANGLE_DISTANCE_OFFSET
      );
      playerRef.current.rotation.y = angleY;
      playerRef.current.rotation.x = -angleX;
    }
  });

  return <group ref={playerRef} />;
}
