import { RotatingCache } from '../../../hooks';
import { API } from '../../types';

type By = 'official' | 'collections' | 'search';

export interface Data {
  timeout: number;
  lastAlbum: boolean;
}

export interface Image {
  data: Blob;
  image_link: string;
  location_title?: string;
  user_name: string;
  user_link: string;
}

type Cache = RotatingCache<Image>;

export type Props = API<Data, Cache>;

export const defaultData: Data = {
  lastAlbum: false,
  timeout: 0,
};
