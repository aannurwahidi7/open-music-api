/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const autoBind = require('auto-bind');
const config = require('../../utils/config');

class AlbumsHandler {
  constructor(service, validator, storageService, uploadValidator) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this._uploadValidator = uploadValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    let { cover } = album.album;
    if (cover !== null) {
      cover = `http://${config.app.host}:${config.app.port}/albums/${id}/covers/${album.album.cover}`;
    }
    const result = {
      album: {
        id: album.album.id,
        name: album.album.name,
        year: album.album.year,
        coverUrl: cover,
      },
      songs: album.songs,
    };

    return {
      status: 'success',
      data: result,
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumImageCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._uploadValidator.validateImageHeaders(cover.hapi.headers);

    const check = await this._service.verifyCoverImageAlbum(id);

    if (check !== null) {
      this._storageService.deleteFile(check);
    }

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    await this._service.addCoverImageAlbum(id, filename);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
