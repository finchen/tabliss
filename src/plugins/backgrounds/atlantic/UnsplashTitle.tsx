import React, { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';

import { UNSPLASH_UTM } from './constants';
import { Image } from './types';

interface Props {
  image: Image;
}

const UnsplashTitle: FC<Props> = ({ image }) => (
  <div className="title">
    <span style={{ float: 'right' }}>{image.user_name}</span>
  </div>
);

export default memo(UnsplashTitle);
