/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariatError = require('../exceptions/InvariantError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(userId, albumId) {
    const id = `likes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariatError('Likes gagal ditambahkan');
    }

    await this._cacheService.delete(`likes:${albumId}`);

    return result.rows[0].id;
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariatError('Likes gagal dihapus. User belum menyukai album ini');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) as likes FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result.rows[0]));

      return result.rows[0];
    }
  }

  async verifyUserAlbumLike(userId, albumId) {
    const query = {
      text: 'SELECT user_id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariatError('User telah menyukai Album ini.');
    }
  }
}

module.exports = UserAlbumLikesService;
