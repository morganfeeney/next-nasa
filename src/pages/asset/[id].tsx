import { FC } from 'react';
import Head from 'next/head';
import { IMAGES_URL, ASSETS_URL } from 'lib/consts';

import styles from 'styles/Home.module.css';

import { NasaData } from '../types';

interface Query {
  query: { id: string };
}

interface AssetPageProps {
  data: NasaData;
  query: Query['query'];
}

const getAnyImageExceptTif = (data: NasaData, query: Query['query']) =>
  data.collection?.items.filter(
    (item) => item.href.split('/').pop() !== `${query.id}~orig.tif`
  );

const Id: FC<AssetPageProps> = ({ data, query }) => {
  console.log({ data });
  const title = data?.['XMP:Title'];
  const description = data?.['XMP:Description'];
  const imageWidth = data?.['File:ImageWidth'];
  const imageHeight = data?.['File:ImageHeight'];
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <p>{description}</p>
        <img
          className={styles.mainImage}
          src={getAnyImageExceptTif(data, query)?.[0].href}
          alt=""
          width={imageWidth}
          height={imageHeight}
        />
      </main>
      <footer className={styles.footer}>
        <h1>footer</h1>
      </footer>
    </div>
  );
};

export const getServerSideProps = async (context: Query) => {
  const { query } = context;
  if (query.id) {
    const imageUrl = `${IMAGES_URL}/asset/${encodeURIComponent(query.id)}`;
    const imageRes = await fetch(imageUrl);
    const imageData = await imageRes.json();
    console.log({ imageData });
    if (imageData.reason) {
      return {
        notFound: true,
      };
    }
    const metaUrl = `${ASSETS_URL}/image/${encodeURIComponent(
      query.id
    )}/metadata.json`;
    const metaRes = await fetch(metaUrl);
    const metaData = await metaRes.json();
    return {
      props: {
        query,
        data: { ...imageData, ...metaData },
      },
    };
  }
};

export default Id;
