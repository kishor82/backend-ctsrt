import { ConfigTypes } from './config_types';

export = {
  logging: {
    silent: false,
    quiet: false,
    verbose: false,
    json: true,
    events: {},
    // Provide destination name starting from the root directory.
    dest: 'stdout',
    filter: {},
    timezone: 'UTC',
    ops: { interval: 5000 },
  },
  mongo: {
    hosts: ['localhost:27017'],
    database: 'cutshort',
    username: '',
    password: '',
    debug: true,
    authSource: '',
    replicaSet: '',
    isLocal: true,
    server: {
      auto_reconnect: true,
      poolSize: 10,
      socketOptions: {
        keepAlive: 1,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 7782,
    ssl: {
      enabled: false,
      certificate: '',
      key: '',
      certificateAuthorities: [],
    },
  },
  healthCheck: {
    delay: 5000,
  },
  jwt_secret_key: '=Bu^%A@^F#SwsYhF3&kSR6!FA*C2U6nz',
} as ConfigTypes;
