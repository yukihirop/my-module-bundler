class BaseError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlreadyImplementedError)
    }
  }
}

export class AlreadyImplementedError extends BaseError {
  constructor(...params) {
    super(...params);
    this.name = 'AlreadyImplementedError'
  }
}

export class NotFoundError extends BaseError {
  constructor(...params) {
    super(...params);
    this.name = 'NotFoundError'
  }
}
