export enum DBMode {
  readonly = "readonly",
  readwrite = "readwrite",
}

interface Options {
  storeName: string;
  dbMode: IDBTransactionMode;
  error: (e: Event) => any;
  complete: (e: Event) => any;
  abort?: any;
}

export function createDatabaseTransaction(
  database: IDBDatabase,
  mode: DBMode,
  storeName: string,
  resolve: (e?: any) => void,
  reject: (e: Event) => void
) {
  const options = optionsGenerator(mode, storeName, reject, resolve);
  const transaction: IDBTransaction = createTransaction(database, options);
  return transaction;
}

function createTransaction(db: IDBDatabase, options: Options): IDBTransaction {
  const trans: IDBTransaction = db.transaction(
    options.storeName,
    options.dbMode
  );
  trans.onerror = options.error;
  trans.oncomplete = options.complete;
  trans.onabort = options.abort;
  return trans;
}

function optionsGenerator(
  type: any,
  storeName: any,
  reject: (e: Event) => void,
  resolve: (e?: Event) => void
): Options {
  return {
    storeName: storeName,
    dbMode: type,
    error: (e: Event) => {
      reject(e);
    },
    complete: () => {
      resolve();
    },
    abort: (e: Event) => {
      reject(e);
    },
  };
}
