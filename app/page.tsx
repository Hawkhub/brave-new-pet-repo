'use client';

import React from 'react';
import { ScreenSized } from 'src/shared/ui/ScreenSized';
import { GlowingBorder } from 'src/shared/ui/GlowingBorder';
import { GlowingTiles } from 'src/shared/ui/GlowingTiles';
import { MovingPlane } from 'src/shared/ui/MovingPlane';
import { Canvas } from "@react-three/fiber";

import styles from './index.module.sass';

const Homepage = () => {

  return (
    <div>
      <ScreenSized className={styles.firstScreen}>
        <GlowingBorder className={styles.card} />
      </ScreenSized>
      <ScreenSized className={styles.secondScreen}>
        <GlowingTiles
          className={styles.tiles}
          eventType={'mousemove'}
          colorSuccession={['#fff', '#000']}
        />
      </ScreenSized>
      <ScreenSized className={styles.thirdScreen}>
        <Canvas camera={{ position: [.3, .35, .5] }}>
          <MovingPlane />
        </Canvas>
      </ScreenSized>
    </div>
  );
};

export default Homepage;