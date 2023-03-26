export const to = async <T>(promise: Promise<T>): Promise<[null, T] | [Error, null]> => {
    try {
      return [null, await promise];
    } catch (err) {
      return [err as Error, null];
    }
  };
  