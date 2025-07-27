const store = new Map();

export const get = jest.fn(async (key: string) => store.get(key));
export const set = jest.fn(async (key: string, value: any) => store.set(key, value));
export const del = jest.fn(async (key: string) => store.delete(key));