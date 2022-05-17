const _ = require('lodash/fp.js')
const Hapi = require('@hapi/hapi');
const { createSendUdp } = require('./udp.js')

const init = async () => {

  const sendUdp = createSendUdp(2000)

  let lastMsg = null

  const server = Hapi.server({
    port: 3000,
    // host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'UDP Forwarding Service';
    }
  });
  server.route({
    method: 'GET',
    path: '/last',
    handler: (request, h) => {
      return lastMsg;
    }
  });
  server.route({
    method: 'POST',
    path: '/',
    handler: (request, h) => {
      if (_.isObject(request.payload)) {
        lastMsg = { ...request.payload }
        if (lastMsg.udp) {
          sendUdp(lastMsg)
        }
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
