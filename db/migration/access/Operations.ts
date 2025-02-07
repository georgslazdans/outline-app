// Bunch of operations copied and simplified from react-indexeddb-hook, to be used for migrations

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

  const getByID = (id: string | number) =>
    new Promise<T>((resolve, reject) => {
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = function (event: Event) {
        resolve((event.target as any).result as T);
      };
    });

  const deleteRecord = (key: string | number) =>
    new Promise<any>((resolve, reject) => {
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = (event) => resolve(event);
    });

  return {
    getAll: getAll,
    update: update,
    add: add,
    getByID: getByID,
    deleteRecord: deleteRecord,
  };
};

export default using;
