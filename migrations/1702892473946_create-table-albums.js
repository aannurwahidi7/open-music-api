/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
  });

  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
  pgm.dropTable('songs');
};
