const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');


mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB..'))
    .catch(err => console.log('Error', err));


app.listen(3000, () => console.log('Listening on port 3000'));
app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/cusomers', customers);
app.use('/', home);



