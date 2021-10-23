import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IMAGES_URL } from 'lib/consts';
import styles from 'styles/Home.module.css';
import { NasaData } from './types';

interface Fetcher {
  queryParam: string;
}

interface Query {
  query: { text: string };
}

interface SearchPageProps {
  query: { text: string };
  data: NasaData;
}

const Home: FC<SearchPageProps> = ({ data, query }) => {
  const router = useRouter();

  // Initial query string used to fetch the data
  const [searchQuery, updateSearchQuery] = useState(query.text);

  // The data returned gets stored here, so it can be updated
  const [searchData, updateSearchData] = useState(data);

  // Final query used to submit the data to fetch via form submission
  const [clientQuery, setClientQuery] = useState(searchQuery);

  useEffect(() => {
    const fetchData = async ({ queryParam }: Fetcher) => {
      if (queryParam === '' || searchQuery === undefined) {
        updateSearchData({} as NasaData);
        return;
      }
      const url = `${IMAGES_URL}/search?&media_type=image&q=${encodeURIComponent(
        queryParam
      )}&page=1`;
      const res = await fetch(url);
      const data = await res.json();
      updateSearchData(data);
    };
    fetchData({ queryParam: searchQuery });
  }, [clientQuery]);

  console.log({ searchQuery, searchData, query });

  useEffect(() => {
    router.push(searchQuery ? `?text=${searchQuery}` : '');
    setClientQuery(searchQuery);
  }, [clientQuery]);

  const items = searchData?.collection?.items;

  return (
    <div className={styles.container}>
      <Head>
        <title>Nasa search</title>
        <meta name="description" content="Nasa search page" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Nasa Search</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setClientQuery(searchQuery);
          }}
        >
          <input
            type="search"
            onChange={(event) => updateSearchQuery(event.target.value)}
          />
          <button type={'submit'}>Search</button>
        </form>
        <section className={styles.results}>
          {items?.length === 0 ? (
            <h1>No results were found, please search again</h1>
          ) : (
            items?.map(({ data, href, links }) => {
              const nasaLink = links[0];
              const nasaData = data[0];
              return (
                <Link
                  key={nasaLink?.href}
                  href={`/asset/${encodeURIComponent(nasaData?.nasa_id)}`}
                >
                  <a>
                    <img
                      alt={nasaData?.title}
                      loading={'lazy'}
                      height={100}
                      width={100}
                      src={nasaLink?.href}
                    />{' '}
                  </a>
                </Link>
              );
            })
          )}
        </section>
      </main>
      <footer className={styles.footer}>
        <h1>footer</h1>
      </footer>
    </div>
  );
};

export const getServerSideProps = async (context: Query) => {
  const { query } = context;
  if (query.text) {
    const url = `${IMAGES_URL}/search?&media_type=image&q=${encodeURIComponent(
      query.text
    )}&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    return {
      props: {
        query,
        data,
      },
    };
  }
  return {
    props: {
      query,
      data: null,
    },
  };
};

export default Home;