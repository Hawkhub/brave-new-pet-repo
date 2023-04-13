import React from 'react';
import clsx from 'clsx';

import styles from './ScreenSized.module.sass';

type ScreenSizedProps = {
    children?: React.ReactNode;
    className?: string;
};

export const ScreenSized = (props: ScreenSizedProps) => {
    const { children, className } = props;

    return (
        <div
            className={clsx(styles.wrapper, className)}
        >
            {children}
        </div>
    );
};
