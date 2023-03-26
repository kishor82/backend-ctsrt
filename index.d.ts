declare module 'hapi-rate-limit' {
  import Plugin from '@hapi/hapi';

  declare module '@hapi/hapi' {
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/hapi__hapi/index.d.ts#L97
    interface PluginSpecificConfiguration {
      'hapi-rate-limit'?: {
        /**
         * Any property or object with a key starting with `x-*` is included in the swagger definition (similar to `x-*` options in the `info` object).
         */
        [key: string]: any;
      };
    }
  }

  declare const hapiswagger: Plugin<{
    [key: string]: any;
  }>;
  export = hapiswagger;
}
