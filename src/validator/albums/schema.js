const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().options({ convert: false }).required(),
});

module.exports = { AlbumPayloadSchema };
