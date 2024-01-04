/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariatError = require('../../exceptions/InvariantError');

class PlaylistSongsActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivities(playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_songs_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariatError('Activities gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongsActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time
      FROM playlist_songs_activities psa
      LEFT JOIN songs s ON s.id = psa.song_id
      LEFT JOIN users u ON u.id = psa.user_id
      WHERE psa.playlist_id = $1 GROUP BY u.username, s.title, psa.action, psa.time
      ORDER BY psa.time`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistSongsActivitiesService;
