const socket = require('socket.io-client')(
  process.env.SOCKET_URL || 'http://localhost:4000'
);

export class SocketService {
  async sendToSocket(data, event) {
    try {
      console.log('sendToSocket::', data, event);
      socket.emit(event, {data});
    } catch (error) {
      console.log('sendToSocket::error', error);
    }
  }

  createSocketData(user, content, transaction) {
    return {
      user: user,
      content: content,
      transaction: transaction,
    };
  }
}
