export = {
  logging: {
    silent: false,
    quiet: false,
    verbose: false,
    json: true,
    events: {},
    // Provide destination name starting from the root directory.
    dest: process.env.DEST,
    filter: {},
    timezone: 'UTC',
    ops: { interval: process.env.LOG_INTERVAL },
  },
  mongo: {
    hosts: process.env.HOSTS,
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    debug: false,
    authSource: process.env.AUTH_SOURCE,
    replicaSet: process.env.REPLICA_SET,
    isLocal: process.env.IS_LOCAL,
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
    port: process.env.SERVER_PORT,
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
  jwt_secret_key: process.env.JWT_SECRET,
};
