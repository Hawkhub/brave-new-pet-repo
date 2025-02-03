'use client';

import React from 'react';
import { ScreenSized } from 'src/shared/ui/ScreenSized';
import { GlowingBorder } from 'src/shared/ui/GlowingBorder';
import { GlowingTiles } from 'src/shared/ui/GlowingTiles';
import { MovingPlane } from 'src/shared/ui/MovingPlane';
// @ts-ignore
import { Canvas } from "@react-three/fiber";
import { CosmoBackground } from 'src/shared/ui/CosmoBackground';
import styles from './index.module.scss';

const Homepage = () => {

  return (
    <div className={styles.page}>
      <ScreenSized className={styles.firstScreen}>
        <CosmoBackground className={styles.cosmo} />
        <GlowingBorder className={styles.card} />
      </ScreenSized>
      <ScreenSized className={styles.secondScreen}>
        <GlowingTiles
          className={styles.tiles}
          eventType={'mousemove'}
          colorSuccession={['#2f2f2f', '#ffba49', '#a44a3f']}
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