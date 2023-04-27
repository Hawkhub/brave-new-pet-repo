import React from 'react';
import { ScreenSized } from 'src/shared/ui/ScreenSized';
import { GlowingBorder } from 'src/shared/ui/GlowingBorder';
import { GlowingTiles } from 'src/shared/ui/GlowingTiles';

import styles from './index.module.sass';

const Homepage = () => {

  return (
    <div>
      <ScreenSized className={styles.firstScreen}>
        <GlowingBorder className={styles.card} />
      </ScreenSized>
      <ScreenSized className={styles.secondScreen}>
        <GlowingTiles className={styles.tiles} />
      </ScreenSized>
    </div>
  );
};

export default Homepage;