// Bunch of operations copied and simplified from react-indexeddb-hook, to be used for migrations

enum DBMode {
  readonly = "readonly",
  readwrite = "readwrite",
}

const using = <T>(
  db: IDBDatabase,
  transaction: IDBTransaction,
  storeName: string
) => {
  const update = (value: T, key?: any) =>
    new Promise<any>((resolve, reject) => {
      const store = transaction.objectStore(storeName);

      transaction.oncomplete = (event) => resolve(event);

      store.put(value, key);
    });

  const getAll = () =>
    new Promise<T[]>((resolve, reject) => {
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = (error) => reject(error);

      request.onsuccess = function ({ target: { result } }: any) {
        resolve(result as T[]);
      };
    });

  const add = (value: T, key?: any) =>
    new Promise<number>((resolve, reject) => {
      const store = transaction.objectStore(storeName);
      const request = store.add(value, key);

      request.onsuccess = (evt: any) => {
        key = evt.target.result;
        resolve(key);
      };

      request.onerror = (error) => reject(error);
    });

  return {
    getAll: getAll,
    update: update,
    add: add,
  };
};

export default using;
