// import PocketBase from 'pocketbase';
import React from 'react';
import Link from 'next/link';
import styles from './nodes.module.scss';
import CreateNode from './CreateNode';

// export const dynamic = 'auto',
//   dynamicParams = true,
//   revalidate = 0,
//   fetchCache = 'auto',
//   runtime = 'nodejs',
//   preferredRegion = 'auto'


async function getNodes() {
  // const db = new PocketBase('http://127.0.0.1:8090');
  // const result = await db.records.getList('nodes');
  const res = await fetch('http://127.0.0.1:8090/api/collections/nodes/records?page=1&perPage=30', { cache: 'no-store' });
  const data = await res.json();
  return data?.items as any[];
}

export default async function NodesPage() {
  const nodes = await getNodes();

  return(
    <div>
      <h1>Nodes</h1>
      <div className={styles.grid}>
        {nodes?.map((node) => {
          return <Node key={node.id} node={node} />;
        })}
      </div>

      <CreateNode />
    </div>
  );
}

function Node({ node }: any) {
  const { id, title, content, created } = node || {};

  return (
    <Link href={`/nodes/${id}`}>
      <div className={styles.node}>
        <h2>{title}</h2>
        <h5>{content}</h5>
        <p>{created}</p>
      </div>
    </Link>
  );
}
