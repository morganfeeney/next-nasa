export interface NasaData {
  title: string;
  description: string;
  imageWidth?: number;
  imageHeight?: number;
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
