import React from 'react';
import clsx from 'clsx';

import Link from 'next/link';
import Logo from 'src/shared/assets/icons/ddm-logo.svg';

import styles from './InteractiveLogo.module.sass';

type InteractiveLogoProps = {
    classname?: string;
};

export const InteractiveLogo = (props: InteractiveLogoProps) => {
    const { classname } = props;

    return (
        <Link
            className={clsx(styles.logoLink, classname)}
            href={'/'}
        >
            <Logo
                className={styles.logo}
            />
        </Link>
    );
};
