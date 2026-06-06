import ApiError from './ApiError.js';

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export default ForbiddenError;
