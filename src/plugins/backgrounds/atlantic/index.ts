import { Config } from '../../types';
import Unsplash from './Unsplash';
import UnsplashSettings from './UnsplashSettings';

const config: Config = {
  key: 'background/atlantic',
  name: 'Atlantic',
  description: 'Photo of the week',
  dashboardComponent: Unsplash,
  settingsComponent: UnsplashSettings,
  supportsBackdrop: true,
};

export default config;
