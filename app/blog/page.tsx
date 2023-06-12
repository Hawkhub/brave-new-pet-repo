import React from 'react'
import styles from './blog.module.sass';

import { FeedItem } from 'src/widgets/FeedItem';

const posts = [
  {
    'id': 1,
    'created': new Date('2023-06-11 14:23:26.284364+03'),
    'edited': false,
    'seen': 0,
    'title': 'abc',
    'content': 'abc',
  },
  {
    'id': 2,
    'created': new Date('2023-06-11 13:23:26.284364+03'),
    'edited': false,
    'seen': 0,
    'title': 'abc',
    'content': 'abc',
  },
  {
    'id': 3,
    'created': new Date('2023-06-11 12:23:26.284364+03'),
    'edited': false,
    'seen': 0,
    'title': 'abc',
    'content': 'abc',
  },
];

const TechBlog = () => {
  return (
    <div className={styles.page}>
      {posts.map(post => (
        <FeedItem
          {...post}
        />
      ))}
    </div>
  )
}

export default TechBlog