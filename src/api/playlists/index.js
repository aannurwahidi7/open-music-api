const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService,
    playlistSongsService,
    collaborationsService,
    playlistSongsActivitiesService,
    validator,
  }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      playlistSongsService,
      collaborationsService,
      playlistSongsActivitiesService,
      validator,
    );
    server.route(routes(playlistsHandler));
  },
};
