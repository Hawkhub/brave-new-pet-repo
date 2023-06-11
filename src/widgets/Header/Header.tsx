'use client';

import React from 'react';
import clsx from 'clsx';

import { StyledNextLink } from 'src/shared/ui/StyledNextLink';
import Link from 'next/link';
import Logo from 'src/shared/assets/icons/ddm-logo.svg'

import styles from './Header.module.sass';

type HeaderProps = {
};

export const Header = (props: HeaderProps) => {

    return (
        <div
            className={clsx(styles.header)}
        >
            <div className={styles.leftPanel}>
                <Link href={'https://didim.dev'}>
                    <Logo
                        className={styles.logo}
                    />
                </Link>
            </div>
            <div className={styles.rightPanel}>
                <StyledNextLink doubleUnderline href={'https://www.linkedin.com/in/didim-gersamia/'}>
                    LinkedIn
                </StyledNextLink>
            </div>
        </div>
    );
};
