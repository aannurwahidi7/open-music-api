const InvariatError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('./schema');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariatError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
