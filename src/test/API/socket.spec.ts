import { io, Socket as ClientSocket } from 'socket.io-client'

describe('SocketIO server', () => {
  var client: ClientSocket
  beforeAll((done) => {
    //@ts-ignore
    client = new io(`http://localhost:${global.socketPort}`, {
      path: '/api/socket.io',
      transports: ['websocket', 'polling'],
    })
    done()
  })

  it('should be initialized...', () => {
    expect(global.socket).toBeDefined()
    expect(global.socket.io).toBeDefined()
  })

  it('should allow client to connect', (done) => {
    client.on('connect', () => {
      done()
    })
    client.connect()
  })

  it('should send a test event back', () => {
    expect(2)
    client.on('test', (data) => {
      if (data.message === 'A message to all sockets...')
        expect(data.message).toBeDefined()
      if (data.message === 'A message to all sockets...')
        expect(data.message).toBeDefined()
    })
    client.emit('test')
  })
})
