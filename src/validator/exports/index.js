const InvariatError = require('../../exceptions/InvariantError');
const ExportPlaylistPayloadSchema = require('./schema');

const ExportsValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariatError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
