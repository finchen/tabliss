import { API } from '../../types';
import { officialCollection, UNSPLASH_API_KEY } from './constants';
import { Image, Data } from './types';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getImage = async function (
  settings: Pick<Data, 'lastAlbum'>,
  loader: API['loader'],
): Promise<Image> {
  // Setup
  const { lastAlbum } = settings;
  const headers = new Headers();
  const parser = new DOMParser();

  const feedUrl = 'http://cdn.townapp.nz/corsme.php?url=http://feeds.feedburner.com/theatlantic/infocus?format=xml';

  let cachedFeed: { time: number, feed: string } = JSON.parse(localStorage.getItem('atlanticFeed') || '{}');

  let parsedXml: Document;

  if (!cachedFeed || !('time' in cachedFeed) || cachedFeed.time + 8 * 60 * 60 * 1000 < new Date().getTime()) {
    const resFeed = await (await fetch(feedUrl, { headers })).text();
    parsedXml = parser.parseFromString(resFeed, 'text/html');
    localStorage.setItem('atlanticFeed', JSON.stringify({ time: new Date().getTime(), feed: resFeed }));
  } else {
    console.log('rss from cache');
    parsedXml = parser.parseFromString(cachedFeed.feed, 'text/html');
  }

  let albums: HTMLCollectionOf<Element> = parsedXml.getElementsByTagName("feedburner:origLink");

  // whatever the top cache is doing we still cache per day the  atlantic url call

  // option? last album, random album
  const randomAlbum = lastAlbum === true ? 0 : getRandomInt(1, albums.length);

  const itemTag = albums[randomAlbum].parentElement as HTMLElement;
  const albumtitle = itemTag.getElementsByTagName('title')[0].textContent;

  // Build search url
  //let url = 'http://cdn.townapp.nz/corsme.php?url=https://www.theatlantic.com/photo/2019/08/photos-of-the-week-pikachu-outbreak-dinosaur-crossing-ducky-derby/595804/';
  let originalUrl = albums[randomAlbum].textContent || 'https://www.theatlantic.com/photo/2019/08/photos-of-the-week-pikachu-outbreak-dinosaur-crossing-ducky-derby/595804/'; //first one

  let cachedAlbum: { album: string } = JSON.parse(localStorage.getItem(originalUrl) || '{}');

  console.log("Latest album: ", originalUrl, albumtitle);
  const url = 'http://cdn.townapp.nz/corsme.php?url=' + originalUrl;

  // Fetch from API
  loader.push();

  let res;
  let parsedHtml;

  if (!cachedAlbum || !('album' in cachedAlbum)) {
    res = await (await fetch(url, { headers })).text();
    localStorage.setItem(originalUrl, JSON.stringify({ time: new Date().getTime(), album: res }));
    parsedHtml = parser.parseFromString(res, 'text/html');
  } else {
    console.log('album from cache');
    parsedHtml = parser.parseFromString(cachedAlbum.album, 'text/html');
  }

  let pictures = parsedHtml.getElementsByTagName("picture");

  console.log('pictures', pictures);

  const randomIndex = getRandomInt(1, pictures.length);
  const picture = pictures[randomIndex];

  if (randomIndex && picture) {
    loader.push();

    if (picture.firstElementChild) {
      let pictureurl = picture.firstElementChild.getAttribute('data-srcset');
      console.log(pictureurl);

      let caption: string = '';
      if (pictures[randomIndex].parentNode) {
        console.log(pictures[1].parentNode);
      }
      if (picture.parentNode && picture.parentNode.nextSibling && picture.parentNode.nextSibling.nextSibling) {
        caption = picture.parentNode.nextSibling.nextSibling.textContent || '';
      }
      loader.pop();

      if (pictureurl) {
        return {
          data: new Blob(), // do not use
          image_link: pictureurl,
          location_title: caption,
          user_name: albumtitle || '',
          user_link: originalUrl,
        };
      }
    }

  }

  return Promise.reject();

};
