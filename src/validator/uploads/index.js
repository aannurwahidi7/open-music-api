const { ImageHeadersSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UploadsValidator = {
  validateImageHeaders: (header) => {
    const validationResult = ImageHeadersSchema.validate(header);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
