import ApiError from './ApiError.js';

class ValidationError extends ApiError {
  constructor(message = 'Validation failed', errors = null) {
    super(400, message, errors);
  }
}

export default ValidationError;
