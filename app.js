const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config/keys');

const app = express();

const PORT = process.env.PORT || 5000;

mongoose.connect(
    MONGO_URI,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
);
mongoose.promise = global.promise;

app.use(express.json());

app.use(require('./api/routes/auth'));
app.use(require('./api/routes/post'));
app.use(require('./api/routes/user'));

if(process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*", (req, res, next) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

app.listen(PORT, () => {
    console.log(`Server is running in PORT: ${PORT}`);
});

