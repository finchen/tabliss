import { API } from '../../types';
import { officialCollection, UNSPLASH_API_KEY } from './constants';
import { Image, Data } from './types';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getImage = async function (
  settings: Pick<Data, 'by' | 'collections' | 'featured' | 'search'>,
  loader: API['loader'],
): Promise<Image> {
  // Setup
  const { by, collections, featured, search } = settings;
  const headers = new Headers();


  // Build search url
  let url = 'http://cdn.townapp.nz/corsme.php?url=https://www.theatlantic.com/photo/2019/08/photos-of-the-week-pikachu-outbreak-dinosaur-crossing-ducky-derby/595804/';

  // Fetch from API
  loader.push();
  const res = await (await fetch(url, { headers })).text();

  let parser = new DOMParser();
  let parsedHtml = parser.parseFromString(res, 'text/html');
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
          user_name: 'as',
          user_link: pictureurl,
        };
      }
    }

  }

  return Promise.reject();

};
