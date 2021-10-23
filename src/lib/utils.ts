import { NasaImageData, IdQuery } from 'lib/types';

export const getAnyImageExceptTif = (
  data: NasaImageData,
  query: IdQuery['query']
) =>
  data.collection?.items.filter(
    (item) => item.href.split('/').pop() !== `${query.id}~orig.tif`
  );
