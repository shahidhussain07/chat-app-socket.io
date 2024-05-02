import React, { useEffect, useMemo, useState } from "react"
import { Socket, io } from "socket.io-client"
import {
	Container,
	Typography,
	TextField,
	Button,
	Box,
	Stack,
} from "@mui/material"

const App = () => {
	const socket = useMemo(() => io("http://localhost:3000/"), [])

	const [message, setMessage] = useState("")
	const [room, setRoom] = useState("")
	const [socketID, SetSocketID] = useState("")
	const [messages, setMessages] = useState([])
	const [roomName, setRoomName] = useState("")

	const handleSubmit = (e) => {
		e.preventDefault()
		socket.emit("message", { message, room })
		setMessage("")
	}

	const joinRoomHandler = (e) => {
		e.preventDefault()
		socket.emit("join-room", roomName)
		setRoomName("")
	}

	useEffect(() => {
		socket.on("connect", () => {
			SetSocketID(socket.id)
			console.log(
				"connection",
				`time: ${new Date().toLocaleTimeString()}`
			)
		})

		socket.on("recieve-message", (msg) => {
			console.log(msg)
			setMessages((messages) => [...messages, msg])
		})

		socket.on("welcome", (msg) => {
			console.log({ msg }, `id: ${socket.id}`)
		})

		return () => {
			socket.disconnect()
		}
	}, [])

	return (
		<Container maxWidth="sm">
			<Box sx={{ height: 500 }} />
			<Typography variant="h5" component="div" gutterBottom>
				{socketID}
			</Typography>

			<form onSubmit={joinRoomHandler}>
				<h4>Join Room</h4>
				<TextField
					value={roomName}
					id="outlined-basic"
					label="RoomName"
					variant="outlined"
					onChange={(e) => setRoomName(e.target.value)}
				></TextField>
				<Button type="submit" variant="contained" color="primary">
					Join
				</Button>
			</form>

			<form onSubmit={handleSubmit}>
				<TextField
					value={message}
					id="outlined-basic"
					label="Message"
					variant="outlined"
					onChange={(e) => setMessage(e.target.value)}
				></TextField>
				<TextField
					value={room}
					id="outlined-basic"
					label="Room"
					variant="outlined"
					onChange={(e) => setRoom(e.target.value)}
				></TextField>
				<Button type="submit" variant="contained" color="primary">
					Send
				</Button>
			</form>
			<Stack>
				{messages.map((m, i) => (
					<Typography
						key={i}
						variant="h6"
						component="div"
						gutterBottom
					>
						{m}
					</Typography>
				))}
			</Stack>
		</Container>
	)
}

export default App
