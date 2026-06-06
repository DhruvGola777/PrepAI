import ApiError from './ApiError.js';

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', errors = null) {
    super(400, message, errors);
  }
}

export default BadRequestError;
