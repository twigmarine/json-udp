const dgram = require('dgram')
const _ = require('lodash/fp.js')
const { hexToBuff } = require('nori-can')

function getDataBuffer({ data, format }) {
  if (format === 'hex') return Buffer.from(hexToBuff(data))
  if (_.isString(data)) return Buffer.from(data)
  // Default assumes can be consumed by Buffer.from().
  return Buffer.from(data)
}

const sendUdp = _.curry((udpSocket, info) => {
  const { port, address } = info
  const data = getDataBuffer(info)
  udpSocket.send(data, 0, data.length, port, address, (err) => {
    if (err) {
      console.log('UDP ERR', err)
    } else {
      console.log('UDP TX', address, port, data.length)
    }
  })
})

function createSendUdp(portFrom = null, bcast = false, portTo = null) {
  const udpSocket = dgram.createSocket('udp4')
  if (portFrom) {
    console.log('createSendUdp', portFrom)
    udpSocket.bind({ port: portFrom }, () => {
      if (bcast) udpSocket.setBroadcast(true)
    })
  }
  return portTo ? sendUdp(udpSocket, portTo) : sendUdp(udpSocket)
}
module.exports = {
  createSendUdp,
}
