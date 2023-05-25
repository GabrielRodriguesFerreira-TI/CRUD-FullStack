import fs from "fs";
import { LegacyStore, IncrementCallback } from "express-rate-limit";

class JsonFileStore implements LegacyStore {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async incr(key: string, cb: IncrementCallback) {
    const data = await this.readFile();
    if (!data[key]) {
      data[key] = { count: 0 };
    }
    data[key].count++;
    await this.writeFile(data);
    cb(undefined, data[key].count, undefined);
  }

  async decrement(key: string) {
    const data = await this.readFile();
    if (!data[key]) {
      return;
    }
    data[key].count--;
    await this.writeFile(data);
  }

  async resetKey(key: string) {
    const data = await this.readFile();
    delete data[key];
    await this.writeFile(data);
  }

  async resetAll() {
    await this.writeFile({});
  }

  async get(key: string, cb: Function) {
    const data = await this.readFile();
    const count = data[key] ? data[key].count : 0;
    cb(null, count);
  }

  async readFile() {
    return new Promise<any>((resolve, reject) => {
      fs.readFile(this.filePath, (err, data) => {
        if (err) {
          if (err.code === "ENOENT") {
            resolve({});
          } else {
            reject(err);
          }
        } else {
          try {
            const parsedData = JSON.parse(data.toString());
            resolve(parsedData);
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }

  async writeFile(data: any) {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default JsonFileStore;
