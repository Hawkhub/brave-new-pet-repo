'use client';

import React, { useEffect, useState, useRef } from 'react';
import randomColor from 'randomcolor';
import anime from 'animejs';
import clsx from 'clsx';

import styles from './GlowingTiles.module.sass';

type GlowingTilesProps = {
  className?: string;
};

export const GlowingTiles = (props: GlowingTilesProps) => {
  const { className } = props;

  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [total, setTotal] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  const getGridSize = () => {
    if(!containerRef?.current) return;
    const columns = Math.floor(containerRef.current.offsetWidth / 50);
    const rows = Math.floor(containerRef.current.offsetHeight / 50);

    setRows(rows);
    setColumns(columns);
    setTotal(rows * columns);

    anime({
      targets: styles['grid-item'],
      backgroundColor: "#fff",
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
    
    anime({
      targets: ".grid-item",
      backgroundColor: randomColor(),
      delay: anime.stagger(50, { grid: [columns, rows], from: parseInt(index) })
    });
  };

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
              className="grid-item"
              key={i}
              data-index={i}
              onClick={handleStagger}
          />
          ))}
      </div>
  );
};
