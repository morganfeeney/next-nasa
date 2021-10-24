import { imageCollection, IdQuery } from 'lib/types';

export const getAnyImageExceptTif = (
  data: imageCollection['items'],
  query: IdQuery['query']
) =>
  data.filter((item) => item.href.split('/').pop() !== `${query.id}~orig.tif`);
