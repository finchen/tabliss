import React, { FC } from 'react';

import { Props, defaultData } from './types';

const UnsplashSettings: FC<Props> = ({ data = defaultData, setData }) => (
  <div className="UnsplashSettings">
    <label>
      Show a new photo
      <select
        value={data.timeout}
        onChange={event =>
          setData({ ...data, timeout: Number(event.target.value) })
        }
      >
        <option value="0">Every new tab</option>
        <option value="300">Every 5 minutes</option>
        <option value="900">Every 15 minutes</option>
        <option value="3600">Every hour</option>
        <option value="86400">Every day</option>
        <option value={Number.MAX_SAFE_INTEGER}>Pause</option>
      </select>
    </label>

    <label>
      <input
        type="checkbox"
        checked={data.lastAlbum}
        onChange={event => setData({ ...data, lastAlbum: !data.lastAlbum })}
      />{' '}
      Last album only
    </label>

  </div>
);

export default UnsplashSettings;
