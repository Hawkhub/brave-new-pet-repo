import React from 'react';
import clsx from 'clsx';

import styles from './ExampleUiComponent.sass';

type ExampleUiComponentProps = {
    color?: 'black' | 'green';
    // Если нужен children, то указываем явно, не используем React.FC
    children?: React.ReactNode;
};

export const ExampleUiComponent = (props: ExampleUiComponentProps) => {
    const { color, children } = props;

    return (
        <div
            className={clsx(styles.wrapper, {
                [styles.green]: color === 'green',
                [styles.black]: color === 'black',
            })}
        >
            {children}
        </div>
    );
};
