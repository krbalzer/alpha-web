import * as migration_20261102_222550_initial from './20261102_222550_initial';
import * as migration_20261102_233535_blob_fields from './20261102_233535_blob_fields';

export const migrations = [
  {
    up: migration_20261102_222550_initial.up,
    down: migration_20261102_222550_initial.down,
    name: '20261102_222550_initial',
  },
  {
    up: migration_20261102_233535_blob_fields.up,
    down: migration_20261102_233535_blob_fields.down,
    name: '20261102_233535_blob_fields'
  },
];
