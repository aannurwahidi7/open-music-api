const ClientError = require('./ClientError');

class InvariatError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariatError';
  }
}

module.exports = InvariatError;
