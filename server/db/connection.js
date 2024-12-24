const mongoose = require('mongoose');

const url = `mongodb+srv://admin:1234@espada.2bxqj.mongodb.net/?retryWrites=true&w=majority&appName=Espada`;

mongoose.connect(url).then(()=>console.log("Connected")).catch((e)=>console.log('Error: ',e));