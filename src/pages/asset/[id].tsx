import { FC } from 'react';
import { IMAGES_URL, ASSETS_URL } from 'lib/consts';
import Template from 'components/template/Template';
import styles from 'styles/Home.module.css';

import { getAnyImageExceptTif } from 'lib/utils';
import type { IdQuery, NasaImageData } from 'lib/types';

interface AssetPageProps {
  data: NasaImageData;
  query: IdQuery['query'];
}

const Id: FC<AssetPageProps> = ({ data, query }) => {
  console.log({ data });
  return (
    <Template title={data?.title}>
      <p>{data?.description}</p>
      <img
        className={styles.mainImage}
        src={getAnyImageExceptTif(data, query)?.[0].href}
        alt=""
        width={data?.imageWidth}
        height={data?.imageHeight}
      />
    </Template>
  );
};

export const getServerSideProps = async (context: IdQuery) => {
  const { query } = context;

  if (query.id) {
    const imageUrl = `${IMAGES_URL}/asset/${encodeURIComponent(query.id)}`;
    const imageRes = await fetch(imageUrl);
    const imageData = await imageRes.json();

    if (imageData.reason || !imageData) {
      return {
        notFound: true,
      };
    }

    const metaUrl = `${ASSETS_URL}/image/${encodeURIComponent(
      query.id
    )}/metadata.json`;
    const metaRes = await fetch(metaUrl);
    const metaData = await metaRes.json();

    const title = metaData?.['XMP:Title'];
    const description = metaData?.['XMP:Description'];
    const imageWidth = metaData?.['File:ImageWidth'];
    const imageHeight = metaData?.['File:ImageHeight'];

    return {
      props: {
        title,
        description,
        query,
        data: {
          ...imageData,
          title,
          description,
          imageWidth: imageWidth || null,
          imageHeight: imageHeight || null,
        },
      },
    };
  }
};

export default Id;
