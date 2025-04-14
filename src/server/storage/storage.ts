import getJsonDB from '@/server/storage/json-db.ts';
import getFirestoreDB from '@/server/storage/firestore.ts';

type TDb = ReturnType<typeof getJsonDB>;

class Storage {
  private static _instance: TDb;
  public static getInstance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = this.getDBInternal();
    return this._instance;
  }
  public static getDBInternal() {
    switch (process.env.DATABASE) {
      case 'json':
        console.log('Using JSON database');
        return getJsonDB();
      case 'firestore':
        console.log('Using Firestore database');
        return getFirestoreDB();
      default:
        throw new Error(`Invalid DATABASE environment variable: ${process.env.DATABASE}`);
    }
  };  
}

function getDb() {
  return Storage.getInstance();
}

export default getDb;
