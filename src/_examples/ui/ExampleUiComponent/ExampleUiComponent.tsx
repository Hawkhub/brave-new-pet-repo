import React from 'react';
import clsx from 'clsx';

import styles from './ExampleUiComponent.module.sass';

type ExampleUiComponentProps = {
    classname?: string;
    // Если нужен children, то указываем явно, не используем React.FC
    children?: React.ReactNode;
};

export const ExampleUiComponent = (props: ExampleUiComponentProps) => {
    const { classname, children } = props;

    return (
        <div
            className={clsx(styles.wrapper, classname)}
        >
            {children}
        </div>
    );
};
