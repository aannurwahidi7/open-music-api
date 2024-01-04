/* eslint-disable camelcase */
const mapSongToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

// const mapSongsToModel = (book) => ({
//   id: book.id,
//   title: book.title,
//   performer: book.performer,
// });

module.exports = { mapSongToModel };
