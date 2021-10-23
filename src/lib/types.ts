type collection = {
  href: string;
  items: {
    data: {
      center: string;
      title: string;
      nasa_id: string;
    }[];
    href: string;
    links: {
      href: string;
      rel: string;
      render: string;
    }[];
  }[];
};

export interface NasaImageData {
  title: string;
  description: string;
  imageWidth?: number;
  imageHeight?: number;
  collection?: collection;
}

export interface NasaSearchData {
  title: string;
  description: string;
  collection?: collection;
}

export interface IdQuery {
  query: { id: string };
}

export interface Fetcher {
  queryParam: string;
}

export interface SearchQuery {
  query: { text: string };
}
