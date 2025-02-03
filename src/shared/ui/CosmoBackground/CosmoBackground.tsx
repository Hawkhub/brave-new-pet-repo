import React from 'react';
import clsx from 'clsx';
import styles from './CosmoBackground.module.scss';

export const CosmoBackground = ({className}: {className?: string}) => {
  // Stolen from https://codepen.io/ArneSava/pen/BaWxOaR who forked it from https://codepen.io/keithclark/pen/ibEnk
  return (
    <div className={clsx(styles.wrapper, className)}>
        <div className={styles.stars} />
    </div>
  )
}
