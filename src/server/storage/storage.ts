import dotenv from 'dotenv';
dotenv.config();

import jsonDB from '@/server/storage/json-db.ts';

function getDB() {
  switch (process.env.DATABASE) {
    case 'json':
      console.log('Using JSON database');
      return jsonDB;
    // case 'firestore':
    //   console.log('Using Firestore database');
    //   return firestoreDb;
    default:
      throw new Error(`Invalid DATABASE environment variable: ${process.env.DATABASE}`);
  }
};

export default getDB;