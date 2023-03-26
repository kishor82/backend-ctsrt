export interface ConfigTypes {
  logging: {
    silent: boolean;
    quiet: boolean;
    verbose: boolean;
    json: boolean;
    events: {};
    dest: string;
    filter: {};
    timezone: string;
    ops: {
      interval: number;
    };
  };
  mongo: {
    hosts: string[];
    database: string;
    username: string;
    password: string;
    debug: boolean;
    authSource: string;
    replicaSet: string;
    isLocal: boolean;
    server: {
      auto_reconnect: boolean;
      poolSize: number;
      socketOptions: {
        keepAlive: number;
      };
    };
  };
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      certificate: string;
      key: string;
      certificateAuthorities: never[];
    };
  };
  healthCheck: {
    delay: number;
  };
  jwt_secret_key: string;
}
