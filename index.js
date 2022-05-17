const Hapi = require('@hapi/hapi');
const { createSendUdp } = require('./udp.js')

const init = async () => {

  const sendUdp = createSendUdp(2000)

  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

      return 'Hello World!';
    }
  });
  server.route({
    method: 'POST',
    path: '/',
    handler: (request, h) => {
      const payload = request.payload;
      if (payload.udp) {
        sendUdp(payload)
      }
      return {ok: true};
    }
  });
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
