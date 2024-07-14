import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createBodyPart, getTexture } from "../../../utils/steve3D";
import {
  PLAYER_ARMS_ROTATION,
  PLAYER_DISTANCE,
  PLAYER_OFFSET,
  PLAYER_SCALE,
} from "../constants";

export default function SteveBody({ cursorPosition, texture }) {
  const playerRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, PLAYER_DISTANCE);
    camera.lookAt(0, 0, 0);

    const player = new THREE.Group();

    // Body
    player.add(
      createBodyPart(
        8 / 64,
        12 / 64,
        4 / 64,
        [
          getTexture(texture, 16, 20, 4, 12), // Right
          getTexture(texture, 28, 20, 4, 12), // Left
          getTexture(texture, 20, 16, 8, 4), // Top
          getTexture(texture, 28, 16, 8, 4), // Bottom
          getTexture(texture, 20, 20, 8, 12), // Front
          getTexture(texture, 32, 20, 8, 12), // Back
        ],
        0,
        18 / 64,
        0
      )
    );

    // Left Arm
    const leftArm = createBodyPart(
      4 / 64,
      12 / 64,
      4 / 64,
      [
        getTexture(texture, 32, 52, 4, 12), // Right
        getTexture(texture, 40, 52, 4, 12), // Left
        getTexture(texture, 36, 48, 4, 4), // Top
        getTexture(texture, 40, 48, 4, 4), // Bottom
        getTexture(texture, 36, 52, 4, 12), // Front
        getTexture(texture, 44, 52, 4, 12), // Back
      ],
      6.4 / 64,
      18.4 / 64,
      0
    );
    leftArm.rotation.z = PLAYER_ARMS_ROTATION;
    player.add(leftArm);

    // Right Arm
    const rightArm = createBodyPart(
      4 / 64,
      12 / 64,
      4 / 64,
      [
        getTexture(texture, 40, 20, 4, 12), // Right
        getTexture(texture, 48, 20, 4, 12), // Left
        getTexture(texture, 44, 16, 4, 4), // Top
        getTexture(texture, 48, 16, 4, 4), // Bottom
        getTexture(texture, 44, 20, 4, 12), // Front
        getTexture(texture, 52, 20, 4, 12), // Back
      ],
      -6.4 / 64,
      18.4 / 64,
      0
    );
    rightArm.rotation.z = -PLAYER_ARMS_ROTATION;
    player.add(rightArm);

    // Left Leg
    player.add(
      createBodyPart(
        4 / 64,
        12 / 64,
        4 / 64,
        [
          getTexture(texture, 16, 52, 4, 12), // Right
          getTexture(texture, 24, 52, 4, 12), // Left
          getTexture(texture, 20, 48, 4, 4), // Top
          getTexture(texture, 24, 48, 4, 4), // Bottom
          getTexture(texture, 20, 52, 4, 12), // Front
          getTexture(texture, 28, 52, 4, 12), // Back
        ],
        2 / 64,
        6 / 64,
        0
      )
    );

    // Right Leg
    player.add(
      createBodyPart(
        4 / 64,
        12 / 64,
        4 / 64,
        [
          getTexture(texture, 0, 20, 4, 12), // Right
          getTexture(texture, 8, 20, 4, 12), // Left
          getTexture(texture, 4, 16, 4, 4), // Top
          getTexture(texture, 8, 16, 4, 4), // Bottom
          getTexture(texture, 4, 20, 4, 12), // Front
          getTexture(texture, 12, 20, 4, 12), // Back
        ],
        -2 / 64,
        6 / 64,
        0
      )
    );

    playerRef.current.add(player);

    // Scale the entire player
    player.scale.setScalar(PLAYER_SCALE);
    player.translateY(PLAYER_OFFSET);
  }, [camera, texture]);

  useFrame(() => {
    if (playerRef.current) {
      const { x, y } = cursorPosition;
      const angleY = Math.atan2(x, PLAYER_DISTANCE);
      const angleX = Math.atan2(y, PLAYER_DISTANCE);
      playerRef.current.rotation.y = angleY;
      playerRef.current.rotation.x = -angleX;
    }
  });

  return <group ref={playerRef} />;
}
