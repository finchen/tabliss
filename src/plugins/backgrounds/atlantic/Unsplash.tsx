import React, { FC } from 'react';

import { useObjectUrl, useRotatingCache } from '../../../hooks';
import Backdrop from '../../../views/shared/Backdrop';
import { getImage } from './api';
import { Props, defaultData } from './types';
import UnsplashCredit from './UnsplashCredit';
import './Unsplash.sass';
import UnsplashTitle from './UnsplashTitle';

const Unsplash: FC<Props> = ({
  cache,
  data = defaultData,
  loader,
  setCache,
}) => {
  const cacheArea = { cache, setCache };
  const image = useRotatingCache(
    () => getImage(data, loader),
    cacheArea,
    data.timeout * 10000,
    [data.lastAlbum],
  );

  let url = '';

  if (image) {
    url = image.image_link;
    console.log('background', url);
  }

  if (!url) return null;

  return (
    <div className="Unsplash fullscreen">

      <Backdrop
        className="image fullscreen"
        style={{ backgroundImage: url && `url(${url})` }}
      />
      {cache && <UnsplashTitle image={cache.now} />}
      {cache && <UnsplashCredit image={cache.now} />}
    </div>
  );
};

export default Unsplash;
