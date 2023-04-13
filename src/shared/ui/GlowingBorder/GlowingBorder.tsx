import React from 'react';
import clsx from 'clsx';

import styles from './GlowingBorder.module.sass';

type GlowingBorderProps = {
    children?: React.ReactNode;
    className?: string;
};

export const GlowingBorder = (props: GlowingBorderProps) => {
    const { children, className } = props;

    return (
        <div
            className={clsx(styles.container, className)}
        >
            {children}
        </div>
    );
};
