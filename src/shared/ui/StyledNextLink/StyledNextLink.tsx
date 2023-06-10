import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import styles from './StyledNextLink.module.sass';

type StyledNextLinkProps = {
    classname?: string;
    doubleUnderline?: boolean;
} & React.ComponentProps<typeof Link>;

export const StyledNextLink = (props: StyledNextLinkProps) => {
    const { classname, doubleUnderline, children, ...rest } = props;

    return (
        <Link
            className={clsx(styles.link, classname, {
                [styles.doubleUnderline]: doubleUnderline,
            })}
            {...rest}
        >
            {children}
        </Link>
    );
};
