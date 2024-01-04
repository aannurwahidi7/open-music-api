const InvariatError = require('../../exceptions/InvariantError');
const { PostPlaylistPayloadSchema, PostSongToPlaylistPayloadSchema } = require('./schema');

const PlaylistValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariatError(validationResult.error.message);
    }
  },

  validatePostSongToPlaylistPayload: (payload) => {
    const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariatError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
