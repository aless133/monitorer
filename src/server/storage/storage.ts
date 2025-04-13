import dotenv from 'dotenv';
dotenv.config();

import jsonDB from '@/server/storage/json-db.ts';
import firestoreDB from '@/server/storage/firestore.ts';

function getDB() {
  switch (process.env.DATABASE) {
    case 'json':
      console.log('Using JSON database');
      return jsonDB;
    case 'firestore':
      console.log('Using Firestore database');
      return firestoreDB;
    default:
      throw new Error(`Invalid DATABASE environment variable: ${process.env.DATABASE}`);
  }
};

export default getDB;