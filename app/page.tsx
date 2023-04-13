import React from 'react';
import { ScreenSized } from 'src/shared/ui/ScreenSized/ScreenSized';
import { GlowingBorder } from 'src/shared/ui/GlowingBorder/GlowingBorder';

import styles from './index.module.sass';

const Homepage = () => {

  return (
    <div>
      <ScreenSized className={styles.firstScreen}>
        <GlowingBorder className={styles.card} />
      </ScreenSized>
    </div>
  );
};

export default Homepage;