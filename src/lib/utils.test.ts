import { getAnyImageExceptTif } from './utils';

describe('Utils test suite', () => {
  const data = [
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/200907160019HQ~orig.tif',
    },
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/200907160019HQ~large.jpg',
    },
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/200907160019HQ~medium.jpg',
    },
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/200907160019HQ~small.jpg',
    },
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/200907160019HQ~thumb.jpg',
    },
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/metadata.json',
    },
  ];
  const result = [
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/200907160019HQ~large.jpg',
    },
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/200907160019HQ~medium.jpg',
    },
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/200907160019HQ~small.jpg',
    },
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/200907160019HQ~thumb.jpg',
    },
    {
      href: 'http://images-assets.nasa.gov/image/200907160019HQ/metadata.json',
    },
  ];
  it('will not output a URL that contains a .tif file extension', function () {
    expect(getAnyImageExceptTif(data, { id: '200907160019HQ' })).toStrictEqual(
      result
    );
  });
});
