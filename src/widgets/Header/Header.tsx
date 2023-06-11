'use client';

import React from 'react';
import clsx from 'clsx';

import { InteractiveLogo } from 'src/shared/ui/InteractiveLogo';
import { StyledNextLink } from 'src/shared/ui/StyledNextLink';

import styles from './Header.module.sass';

type HeaderProps = {
};

export const Header = (props: HeaderProps) => {

    return (
        <div
            className={clsx(styles.header)}
        >
            <div className={styles.leftPanel}>
                <InteractiveLogo classname={styles.logo} />
            </div>
            <div className={styles.rightPanel}>
                <StyledNextLink doubleUnderline href={'https://www.linkedin.com/in/didim-gersamia/'}>
                    LinkedIn
                </StyledNextLink>
            </div>
        </div>
    );
};
