import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { IMAGES_URL } from 'lib/consts';
import Template from 'components/template/Template';
import styles from 'styles/Search.module.css';
import { NasaSearchData, Fetcher, SearchQuery } from 'lib/types';

interface SearchPageProps {
  query: SearchQuery['query'];
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
  const [currentPage, setCurrentPage] = useState(Number(query.page) || 1);

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

  useEffect(() => {
    router.push(searchQuery ? `?text=${searchQuery}&page=${currentPage}` : '');
    setClientQuery(searchQuery);
  }, [clientQuery, currentPage]);

  const items = searchData?.collection?.items;

  const hasPrevButton = searchData.collection.links?.find(
    (item) => item.rel === 'prev'
  );

  const hasNextButton = searchData.collection.links?.find(
    (item) => item.rel === 'next'
  );

  return (
    <Template title={data?.title}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setClientQuery(searchQuery);
          setCurrentPage(1);
        }}
      >
        <label className={styles.searchInputWrapper} htmlFor={'search'}>
          <span className={styles.visuallyHidden}>Search</span>
          <input
            id={'search'}
            className={styles.input}
            type="search"
            onChange={(event) => updateSearchQuery(event.target.value)}
          />
          <button
            className={classNames(styles.button, styles.buttonPrimary)}
            type={'submit'}
          >
            Search
          </button>
        </label>
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
      {items?.length > 0 && (hasPrevButton || hasNextButton) && (
        <aside className={styles.stickyPagination}>
          <p className={styles.paginationHeading}>
            You are currently viewing page {currentPage}
          </p>
          <div className={styles.paginationButtonsWrapper}>
            <button
              className={classNames(styles.button, styles.buttonDefault, {
                [styles.disabled]: !hasPrevButton,
              })}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev page
            </button>
            <button
              className={classNames(styles.button, styles.buttonDefault, {
                [styles.disabled]: !hasNextButton,
              })}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next page
            </button>
          </div>
        </aside>
      )}
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
      )}&page=${query.page || 1}`;
      const res = await fetch(url);
      const data = await res.json();

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
