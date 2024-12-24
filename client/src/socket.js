import { io } from 'socket.io-client';
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000';
const SERVER = "http://127.0.0.1:8000";

export const socket = io(SERVER, {
  autoConnect: true
});
