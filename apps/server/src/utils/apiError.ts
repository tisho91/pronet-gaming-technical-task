export class ApiError {
  code: number;
  message: string | string[];

  constructor({ message, code = 500 }: { message: string | string[]; code: number }) {
    this.code = code;
    this.message = message;
  }
}
