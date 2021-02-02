const express = require('express');
const mongoose = require('mongoose');

// create express server port 3001
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// server uses routes
app.use(require('./routes'));

// connection to mongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//use this to log mongo queries being executed
mongoose.set('debug',true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
