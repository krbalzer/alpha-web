import * as migration_20261102_222550_initial from './20261102_222550_initial';
import * as migration_20261102_233535_blob_fields from './20261102_233535_blob_fields';
import * as migration_20261103_185429_location_copy from './20261103_185429_location_copy';
import * as migration_20261103_190052_location_leads from './20261103_190052_location_leads';
import * as migration_20261104_010546_portfolio_facts from './20261104_010546_portfolio_facts';
import * as migration_20261107_003536_location_hero_video from './20261107_003536_location_hero_video';
import * as migration_20261107_010725_video_renditions from './20261107_010725_video_renditions';
import * as migration_20261107_014948_pages_legal_leads from './20261107_014948_pages_legal_leads';
import * as migration_20261109_194524_episode_audience from './20261109_194524_episode_audience';
import * as migration_20261109_225411_location_google_place from './20261109_225411_location_google_place';
import * as migration_20261111_231533_inside_gallery from './20261111_231533_inside_gallery';
import * as migration_20261111_233205_inside_title from './20261111_233205_inside_title';
import * as migration_20261112_001903_location_name_chapter from './20261112_001903_location_name_chapter';
import * as migration_20261112_152919_location_order from './20261112_152919_location_order';
import * as migration_20261112_153419_treatments from './20261112_153419_treatments';
import * as migration_20261113_031223_location_google_snapshot from './20261113_031223_location_google_snapshot';

export const migrations = [
  {
    up: migration_20261102_222550_initial.up,
    down: migration_20261102_222550_initial.down,
    name: '20261102_222550_initial',
  },
  {
    up: migration_20261102_233535_blob_fields.up,
    down: migration_20261102_233535_blob_fields.down,
    name: '20261102_233535_blob_fields',
  },
  {
    up: migration_20261103_185429_location_copy.up,
    down: migration_20261103_185429_location_copy.down,
    name: '20261103_185429_location_copy',
  },
  {
    up: migration_20261103_190052_location_leads.up,
    down: migration_20261103_190052_location_leads.down,
    name: '20261103_190052_location_leads',
  },
  {
    up: migration_20261104_010546_portfolio_facts.up,
    down: migration_20261104_010546_portfolio_facts.down,
    name: '20261104_010546_portfolio_facts',
  },
  {
    up: migration_20261107_003536_location_hero_video.up,
    down: migration_20261107_003536_location_hero_video.down,
    name: '20261107_003536_location_hero_video',
  },
  {
    up: migration_20261107_010725_video_renditions.up,
    down: migration_20261107_010725_video_renditions.down,
    name: '20261107_010725_video_renditions',
  },
  {
    up: migration_20261107_014948_pages_legal_leads.up,
    down: migration_20261107_014948_pages_legal_leads.down,
    name: '20261107_014948_pages_legal_leads',
  },
  {
    up: migration_20261109_194524_episode_audience.up,
    down: migration_20261109_194524_episode_audience.down,
    name: '20261109_194524_episode_audience',
  },
  {
    up: migration_20261109_225411_location_google_place.up,
    down: migration_20261109_225411_location_google_place.down,
    name: '20261109_225411_location_google_place',
  },
  {
    up: migration_20261111_231533_inside_gallery.up,
    down: migration_20261111_231533_inside_gallery.down,
    name: '20261111_231533_inside_gallery',
  },
  {
    up: migration_20261111_233205_inside_title.up,
    down: migration_20261111_233205_inside_title.down,
    name: '20261111_233205_inside_title',
  },
  {
    up: migration_20261112_001903_location_name_chapter.up,
    down: migration_20261112_001903_location_name_chapter.down,
    name: '20261112_001903_location_name_chapter',
  },
  {
    up: migration_20261112_152919_location_order.up,
    down: migration_20261112_152919_location_order.down,
    name: '20261112_152919_location_order',
  },
  {
    up: migration_20261112_153419_treatments.up,
    down: migration_20261112_153419_treatments.down,
    name: '20261112_153419_treatments',
  },
  {
    up: migration_20261113_031223_location_google_snapshot.up,
    down: migration_20261113_031223_location_google_snapshot.down,
    name: '20261113_031223_location_google_snapshot'
  },
];
