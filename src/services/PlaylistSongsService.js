/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariatError = require('../exceptions/InvariantError');

class PlaylistSongsService {
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
  }

  async addSongToPlaylist(songId, playlistId) {
    await this._songsService.getSongById(songId);

    const id = `playlistSongs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariatError('Lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  async getSongsFromPlaylist(playlistId) {
    const querySongs = {
      text: `SELECT s.id, s.title, s.performer FROM playlist_songs ps
      LEFT JOIN songs s ON ps.song_id = s.id
      WHERE ps.playlist_id = $1 GROUP BY s.id`,
      values: [playlistId],
    };

    const result = await this._pool.query(querySongs);

    return result.rows;
  }

  async deleteSongFromPlaylist(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariatError('Lagu gagal dihapus dari playlist');
    }
  }
}

module.exports = PlaylistSongsService;
