import React from 'react';
import clsx from 'clsx';

import styles from './GlowingBorder.module.sass';

type GlowingBorderProps = {
    children?: React.ReactNode;
    className?: string;
    thin?: boolean;
    noRotation?: boolean;
};

export const GlowingBorder = (props: GlowingBorderProps) => {
    const { children, className, thin, noRotation } = props;

    return (
        <div
            className={clsx(styles.container, className, {
                [styles.thin]: thin,
                [styles.noRotation]: noRotation,
            })}
        >
            {children}
        </div>
    );
};
