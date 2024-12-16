import { storage } from "@neutralinojs/lib";
import { isNeutralino } from "@/util/neu";

type AppStorage = {
  readonly length: number;
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  key: (index: number) => Promise<string | null>;
  clear: () => Promise<void>;
};

const keyRegex = new RegExp("^[a-zA-Z-_0-9]{1,50}$");
const keyError =
  "Invalid storage key format. The key should match regex: ^[a-zA-Z-_0-9]{1,50}$";
const keyCheck = (key: string) => {
  if (!key.match(keyRegex)) {
    throw keyError;
  }
};

class NeutralinoStorageClass {
  #length: number;

  get length() {
    return this.#length;
  }
  constructor(resolve: (value: AppStorage | PromiseLike<AppStorage>) => void) {
    this.#length = 0;
    storage
      .getKeys()
      .then((keys) => {
        this.#length = keys.length;
        resolve(this);
      })
      .catch(() => {
        resolve(this);
      });
  }
  async setItem(key: string, value: string) {
    keyCheck(key);
    await storage.setData(key, value);
    const keys = await storage.getKeys();
    this.#length = keys.length;
  }
  async removeItem(key: string) {
    keyCheck(key);
    await storage.setData(key, undefined!);
    const keys = await storage.getKeys();
    this.#length = keys.length;
  }
  async getItem(key: string) {
    keyCheck(key);
    try {
      return await storage.getData(key);
    } catch (e) {
      return null;
    }
  }
  async key(index: number): Promise<string | null> {
    try {
      const keys = await storage.getKeys();
      return keys[index] ?? null;
    } catch (e) {
      return null;
    }
  }
  async clear() {
    const keys = await storage.getKeys();
    await Promise.all(keys.map((key) => storage.setData(key, undefined!)));
    this.#length = keys.length;
  }
}

const LocalStorage = {
  async removeItem(key: string) {
    return localStorage.removeItem(key);
  },
  async getItem(key: string) {
    keyCheck(key);
    return localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    keyCheck(key);
    localStorage.setItem(key, value);
  },
  async key(index: number) {
    return localStorage.key(index);
  },
  async clear() {
    return localStorage.clear();
  },
  get length() {
    return localStorage.length;
  },
};

const AppStorage: AppStorage = await new Promise((resolve) => {
  if (isNeutralino) {
    new NeutralinoStorageClass(resolve);
  } else {
    resolve(LocalStorage);
  }
});

declare global {
  var appStorage: AppStorage;
}

globalThis.appStorage = AppStorage;

export default AppStorage;
