type searchCollection = {
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
  links: {
    href: string;
    rel: string;
    prompt: string;
  }[];
};

type imageCollection = {
  href: string;
  items: {
    href: string;
  }[];
};

export interface NasaImageData {
  title: string;
  description: string;
  imageWidth?: number;
  imageHeight?: number;
  collection: imageCollection;
}

export interface NasaSearchData {
  error?: boolean;
  title: string;
  description: string;
  collection: searchCollection;
}

export interface IdQuery {
  query: { id: string };
}

export interface Fetcher {
  queryParam: string;
}

export interface SearchQuery {
  query: { text: string; page?: number };
}
