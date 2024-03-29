/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_album_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id)');
  pgm.addConstraint('user_album_likes', 'fk_album_likes.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id)');
};

exports.down = (pgm) => {
  pgm.dropTable('album_likes');
};
