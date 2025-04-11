import { ZodError } from "zod";

export class CustomError extends Error {
  constructor(
    message: string,
    public readonly data?: Record<string, unknown> | ZodError,
  ) {
    super(message);
    this.name = 'CustomError';
  }
}