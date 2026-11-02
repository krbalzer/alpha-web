import * as migration_20261102_222550_initial from './20261102_222550_initial';

export const migrations = [
  {
    up: migration_20261102_222550_initial.up,
    down: migration_20261102_222550_initial.down,
    name: '20261102_222550_initial'
  },
];
