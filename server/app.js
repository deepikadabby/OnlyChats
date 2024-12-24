const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
const http = require('http').createServer(app);
const STATIC_CHANNELS = [{
    name: 'Global chat',
    participants: 0,
    id: 1,
    sockets: []
}, {
    name: 'Funny',
    participants: 0,
    id: 2,
    sockets: []
}];

require('./db/connection');


const userss = require('./models/users')
const GallBatt = require('./models/conversation');
const Massage = require('./models/messages');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const port = process.env.PORT || 8000;



app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/api/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: 'Please fill in all fields' });
        } else {
            const IsAlready = await userss.findOne({ email });
            if (IsAlready) {
                return res.status(400).send({ message: 'Email already exists' });
            } else {
                const newUser = new userss({ name, email });
                bcryptjs.hash(password, 5, (err, hashedPassword) => {
                    newUser.set('password', hashedPassword);
                    newUser.save();

                });

                return res.status(200).json("Registered Successfully");
            }

        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
})

app.post('/api/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: 'Please fill in all fields' });
        } else {
            const user = await userss.findOne({ email });
            if (!user) {
                return res.status(400).send({ message: 'Email not found' });
            } else {
                const isMatch = await bcryptjs.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).send({ message: 'Invalid password' });
                } else {
                    const paylod = {
                        userId: user.id,
                        email: user.email
                    }
                    const JWT_Key = process.env.JWT_Key || "PRIV8-KEY";
                    jwt.sign(paylod, JWT_Key, { expiresIn: 84600 }, async (err, token) => {
                        await userss.updateOne({ _id: user._id }, {
                            $set: { token }
                        });
                        user.save();
                        return res.status(200).json({ user: { id: user._id, email: user.email, name: user.name }, token: token });
                    })


                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
})


app.post('/api/conversation', async (req, res, next) => {
    try {
        const { SenderId, ReceiverId } = req.body;
        const newConversation = new GallBatt({ members: [SenderId, ReceiverId] });
        await newConversation.save();
        res.status(200).send('conversation created successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
})

app.get('/api/conversation/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const conversation = await GallBatt.find({ members: { $in: [userID] } });
        const YaarBeli = await Promise.all(conversation.map(async (conversation) => {
            const members = await conversation.members.find((member) => member != userID);
            const child = await userss.findById(members);
            return { child: { ReceiverId: child._id, name: child.name, email: child.email }, conversationId: conversation._id }
        }))
        res.status(200).json(await YaarBeli);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
})

app.post('/api/message', async (req, res) => {
    try {
        const { ConvoID, SenderID, Message, ReceiverId = '' } = req.body;
        // console.log({ ConvoID, SenderID, Message, ReceiverId })
        if (!SenderID || !Message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (ConvoID === 'new' && ReceiverId) {
            const NewConvo = new GallBatt({ members: [SenderID, ReceiverId] });
            await NewConvo.save();
            const newMassage = new Massage({ ConvoID: NewConvo._id, SenderID, Message });
            await newMassage.save();
            return res.status(200).send("message sent successfully");
        } else if (!ConvoID && !ReceiverId) {
            return res.status(400).send("Please Fill out all required fields");
        }
        const newMessage = new Massage({ ConvoID, SenderID, Message });
        await newMessage.save();
        res.status(200).send('message sent successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Something went wrong' });

    }
})

app.get('/api/message/:ConvoID', async (req, res) => {
    try {
        const checkKro = async (ConvoID) => {
            const message = await Massage.find({ ConvoID });
            const Chaat = await Promise.all(message.map(async (message) => {
                const sender = await userss.findById(message.SenderID);
                return { sender: { id: sender._id, name: sender.name, email: sender.email }, message: message.Message }
            }));
            res.status(200).json(await Chaat);
        }
        const ConvoID = req.params.ConvoID;
        if (ConvoID === 'new') {
            const checkConvoo = await GallBatt.find({ members: { $all: [req.query.senderID, req.query.ReceiverId] } });
            if (checkConvoo.length > 0) {
                checkKro(checkConvoo[0]._id);
            } else {
                return res.status(200).json([]);

            }
        } else {
            checkKro(ConvoID)

        }


    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
})

app.get('/api/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await userss.find({ _id: { $ne: userId } });
        const userVal = await Promise.all(users.map(async (user) => {
            return { user: { name: user.name, email: user.email, ReceiverId: user._id } }
        }));
        res.status(200).json(await userVal);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
})

const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    // console.log('new client connected');
    socket.emit('connection', null);
    socket.on('channel-join', id => {
        // console.log('channel join', id);
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });

        return id;
    });
    socket.on('send-message', message => {
        // console.log('-----sendMessage------', message);
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        STATIC_CHANNELS.forEach(c => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.participants--;
                io.emit('channel', c);
            }
        });
    });

});
