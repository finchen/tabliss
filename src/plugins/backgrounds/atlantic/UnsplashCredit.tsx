import React, { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';

import { UNSPLASH_UTM } from './constants';
import { Image } from './types';

interface Props {
  image: Image;
}

const UnsplashCredit: FC<Props> = ({ image }) => (
  <div className="credit">
    <span style={{ float: 'right' }}>{image.location_title}</span>
  </div>
);

export default memo(UnsplashCredit);
