const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    service,
    validator,
    storageService,
    uploadValidator,
    usersService,
    userAlbumLikesService,
    cacheService,
  }) => {
    const albumsHandler = new AlbumsHandler(
      service,
      validator,
      storageService,
      uploadValidator,
      usersService,
      userAlbumLikesService,
      cacheService,
    );
    server.route(routes(albumsHandler));
  },
};
