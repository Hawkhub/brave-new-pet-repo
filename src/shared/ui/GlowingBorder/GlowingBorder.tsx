import React from 'react';
import clsx from 'clsx';

import styles from './GlowingBorder.module.sass';

type GlowingBorderProps = {
    children?: React.ReactNode;
    className?: string;
    thin?: boolean;
};

export const GlowingBorder = (props: GlowingBorderProps) => {
    const { children, className, thin } = props;

    return (
        <div
            className={clsx(styles.container, className, {
                [styles.thin]: thin,
            })}
        >
            {children}
        </div>
    );
};
