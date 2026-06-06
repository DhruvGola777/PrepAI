import ApiError from './ApiError.js';

class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export default NotFoundError;
