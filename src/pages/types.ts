export interface NasaData {
  'XMP:Title': string;
  'XMP:Description': string;
  collection?: {
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
}
