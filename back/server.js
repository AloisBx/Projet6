const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
	const port = parseInt(val, 10);
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}
	switch (error.code) {
		case "EACCES":
			console.error(error);
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(error);
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const server = http.createServer(app);
server.on("error", errorHandler);
server.on("listening", () => {
	console.log(
		"Listening on port " +
		port
	);
});
server.listen(port);