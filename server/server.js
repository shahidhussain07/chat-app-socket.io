const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")

const app = express()
const server = createServer(app)

const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
})

io.on("connection", (socket) => {
	socket.on("message", (data) => {
		console.log({ data })
		socket.to(data.room).emit("recieve-message", data.message)
	})

	socket.on("disconnect", () => {
		console.log("user disconnected", "id:", socket.id)
	})

	socket.on("join-room", (room) => {
		socket.join(room)
	})
})

server.listen(3000, () => {
	console.log("server running at Port:3000")
})
