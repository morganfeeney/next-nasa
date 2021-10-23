import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IMAGES_URL } from 'lib/consts';
import Template from 'components/template/Template';
import styles from 'styles/Home.module.css';
import { NasaSearchData, Fetcher, SearchQuery } from 'lib/types';

interface SearchPageProps {
  query: { text: string };
  data: NasaSearchData;
}

const Home: FC<SearchPageProps> = ({ data, query }) => {
  const router = useRouter();

  // Initial query string used to fetch the data
  const [searchQuery, updateSearchQuery] = useState(query.text);

  // The data returned gets stored here, so it can be updated
  const [searchData, updateSearchData] = useState(data);

  // Final query used to submit the data to fetch via form submission
  const [clientQuery, setClientQuery] = useState(searchQuery);

  // Set up for pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async ({ queryParam }: Fetcher) => {
      if (queryParam === '' || searchQuery === undefined) {
        updateSearchData({} as NasaSearchData);
        return;
      }
      try {
        const res = await fetch(
          `${IMAGES_URL}/search?&media_type=image&q=${encodeURIComponent(
            searchQuery
          )}&page=${currentPage}`
        );
        const fetchData = await res.json();
        updateSearchData(fetchData);
      } catch (error) {
        console.log({ error });
      }
    };
    fetchData({ queryParam: searchQuery });
  }, [clientQuery, currentPage]);

  // console.log({ searchQuery, searchData, query });

  useEffect(() => {
    router.push(searchQuery ? `?text=${searchQuery}` : '');
    setClientQuery(searchQuery);
  }, [clientQuery]);

  const items = searchData?.collection?.items;
  console.log({ data, links: data?.collection?.links });
  return (
    <Template title={data?.title}>
      {data?.collection && (
        <>
          <p>You are currently viewing page {currentPage}</p>
          <button onClick={() => setCurrentPage(currentPage + 1)}>
            Next page
          </button>
          <button
            onClick={() =>
              setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
            }
          >
            Prev page
          </button>
        </>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setClientQuery(searchQuery);
        }}
      >
        <input
          className={styles.input}
          type="search"
          onChange={(event) => updateSearchQuery(event.target.value)}
        />
        <button className={styles.button} type={'submit'}>
          Search
        </button>
      </form>
      <section className={styles.results}>
        {items?.length === 0 ? (
          <h2 className={styles.noResultsHeading}>
            No results were found, please search again
          </h2>
        ) : (
          items?.map(({ data, links }) => {
            const nasaLink = links[0];
            const nasaData = data[0];
            return (
              <Link
                key={nasaLink?.href}
                href={`/asset/${encodeURIComponent(nasaData?.nasa_id)}`}
              >
                <a className={styles.thumbWrapper}>
                  <img
                    className={styles.thumb}
                    alt={nasaData?.title}
                    loading={'lazy'}
                    height={1000}
                    width={1000}
                    src={nasaLink?.href}
                  />
                </a>
              </Link>
            );
          })
        )}
      </section>
    </Template>
  );
};

export const getServerSideProps = async (context: SearchQuery) => {
  const { query } = context;
  const title = 'Nasa Search';
  if (query.text) {
    try {
      const url = `${IMAGES_URL}/search?&media_type=image&q=${encodeURIComponent(
        query.text
      )}&page=1`;
      const res = await fetch(url);
      const data = await res.json();
      console.log({ url, data });
      return {
        props: {
          title,
          query,
          data: {
            ...data,
            title,
          },
        },
      };
    } catch (error) {
      console.log({ error });
      return {
        props: {
          title,
          query,
          error: true,
          data: {
            title,
          },
        },
      };
    }
  }
  return {
    props: {
      title,
      query,
      data: {
        title,
      },
    },
  };
};

export default Home;
