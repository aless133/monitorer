// declare module 'express-session' {
//   interface SessionData {
//     auth: boolean;
//   }
// }


// declare module 'cookie-session' {
//   interface SessionData {
//     auth: boolean;
//   }
// }

// import 'express'; // Extends Express types

// declare global {
//   namespace Express {
//     interface Request {
//       session: {
//         auth?: boolean;  // Your custom session data
//         [key: string]: any; // Allow other properties
//       } | null;
//     }
//   }
// }

export {}; //need to be module