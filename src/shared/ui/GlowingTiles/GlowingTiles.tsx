'use client';

import React, { useEffect, useState, useRef } from 'react';
import randomColor from 'randomcolor';
import anime from 'animejs';
import clsx from 'clsx';

import { throttlify } from 'src/shared/lib/helpers/throttle';
import styles from './GlowingTiles.module.sass';

type GlowingTilesProps = {
  className?: string;
  eventType?: 'mousemove' | 'click';
  startColor?: string;
  colorSuccession?: string[];
  throttleDuration?: number;
};

export const GlowingTiles = (props: GlowingTilesProps) => {
  const {
    className,
    eventType = 'click',
    colorSuccession,
    startColor = '#fff',
    throttleDuration = 1500,
  } = props;

  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [total, setTotal] = useState(1);
  const [currentColorIndex, setCurrentColorIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const getGridSize = () => {
    if(!containerRef?.current) return;
    const columns = Math.floor(containerRef.current.offsetWidth / 50);
    const rows = Math.floor(containerRef.current.offsetHeight / 50);

    setRows(rows);
    setColumns(columns);
    setTotal(rows * columns);

    anime({
      targets: '.' + styles['grid-item'],
      backgroundColor: colorSuccession?.length ? colorSuccession[currentColorIndex] : startColor,
      duration: 0,
      easing: "linear"
    });
  };

  const handleStagger: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!(event.target instanceof HTMLDivElement)) {
      return;
    }

    const index = event.target.dataset.index;

    if(index === undefined) return;

    let chooseColor = () => {
      if(!colorSuccession?.length) return randomColor();

      let nextIndex = currentColorIndex + 1;

      if(nextIndex >= colorSuccession.length) nextIndex = 0;
      
      setCurrentColorIndex(nextIndex);
      return colorSuccession[nextIndex];
    };

    anime({
      targets: '.' + styles['grid-item'],
      backgroundColor: chooseColor(),
      delay: anime.stagger(50, { grid: [columns, rows], from: parseInt(index) })
    });
  };

  const handleClick = () => {
    if(eventType !== 'click') return;
    return handleStagger;
  }

  const handleMousemove = () => {
    if(eventType !== 'mousemove') return;
    return throttlify(handleStagger, throttleDuration);
  }

  useEffect(() => {
    getGridSize();
    window.addEventListener('resize', getGridSize);
    return () => {
      window.removeEventListener('resize', getGridSize);
    };
  }, []);

  return (
      <div
          className={clsx(styles.grid, className)}
          ref={containerRef}
      >
          {[...Array(total)].map((x, i) => (
          <div
              className={clsx(styles['grid-item'], {
                [styles.hover]: eventType === 'click',
              })}
              key={i}
              data-index={i}
              onClick={handleClick()}
              onMouseMove={handleMousemove()}
          />
          ))}
      </div>
  );
};
