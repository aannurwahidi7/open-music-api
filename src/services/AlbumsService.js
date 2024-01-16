/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariatError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year, cover = null }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, cover],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariatError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const querySong = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    const resultSong = await this._pool.query(querySong);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return {
      album: result.rows[0],
      songs: resultSong.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyAlbumId(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async addCoverImageAlbum(id, filename) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [filename, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Sampul album gagal di-upload. Album tidak ditemukan');
    }
  }

  async verifyCoverImageAlbum(id) {
    const query = {
      text: 'SELECT cover FROM albums WHERE id = $1 AND cover IS NOT NULL',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return null;
    }

    return result.rows[0];
  }
}

module.exports = AlbumsService;
