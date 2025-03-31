import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import chatRouter from './routes/chatRouter'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors());
app.use(express.json());

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
})


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });

app.get('/', (req, res) => {
    res.send('hi')
});

app.use('/api/chat', chatRouter)

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('connected to db')
        server.listen(process.env.PORT, () => {
            console.log('server running at' + process.env.BACKEND_URL);
        })
    })