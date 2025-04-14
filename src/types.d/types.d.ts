declare module 'express-session' {
  interface SessionData {
    auth: boolean;
  }
}

export {}; //need to be module