declare global {
  namespace Express {
    interface Request {
      _startTime?: number;
    }
  }
}

export {};
