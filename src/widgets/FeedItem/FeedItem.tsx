import React from 'react';
import clsx from 'clsx';

import { GlowingBorder } from 'src/shared/ui/GlowingBorder';
import { BlogPost } from 'src/entities/blogPost/model/types';

import styles from './FeedItem.module.sass';

type BlogPostProps = {
    classname?: string;
} & BlogPost;

export const FeedItem = (props: BlogPostProps) => {
    const {
        classname = '',
        created,
        title,
        edited,
        seen,
        content,
    } = props;

    return (
        <GlowingBorder
            thin
            className={clsx(styles.container, classname)}
        >
            {title}

            {content}

            <div className={styles.created}>
                { created.toDateString() }
            </div>
        </GlowingBorder>
    );
};
