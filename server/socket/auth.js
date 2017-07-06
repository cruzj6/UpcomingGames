module.exports = {
	initWithSocket (socket) {
		exports.socket = socket;
		exports.socket.on('message', message => console.log({ MESSAGE: message }));
	}
}
