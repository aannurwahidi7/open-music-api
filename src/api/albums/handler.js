/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const autoBind = require('auto-bind');
const config = require('../../utils/config');

class AlbumsHandler {
  constructor(
    service,
    validator,
    storageService,
    uploadValidator,
    usersService,
    userAlbumLikesService,
    cacheService,
  ) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this._uploadValidator = uploadValidator;
    this._usersService = usersService;
    this._userAlbumLikesService = userAlbumLikesService;
    this._cacheService = cacheService;

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
        songs: album.songs,
      },
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

  async postUserAlbumLikeHandler(request, h) {
    const { id } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._usersService.getUserById(id);
    await this._service.verifyAlbumId(albumId);
    await this._userAlbumLikesService.verifyUserAlbumLike(id, albumId);
    await this._userAlbumLikesService.addLike(id, albumId);

    const response = h.response({
      status: 'success',
      message: 'Anda menyukai album ini',
    });

    response.code(201);
    return response;
  }

  async deleteUserAlbumLikeHandler(request) {
    const { id } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._userAlbumLikesService.deleteLike(id, albumId);

    return {
      status: 'success',
      message: 'Anda telah batal menyukai album ini',
    };
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const check = await this._cacheService.check(`likes:${id}`);
    const { likes } = await this._userAlbumLikesService.getLikes(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(likes, 10),
      },
    });

    if (check === true) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumsHandler;
