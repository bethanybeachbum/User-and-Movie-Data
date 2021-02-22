const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);


router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});


router.post('/', async (req, res) => {
    const { error } = genreValidate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    const genre = new Genre({ name: req.body.name });
    const result = await genre.save();

    res.send(result);
});


router.put('/:id', async (req, res) => {
    const { error } = genreValidate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if(!genre) return res.status(400).send('The requested movie was not found');

    res.send(genre);
});


router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) return res.status(400).send('The requested movie was not found');

    res.send(genre);
});


router.get('/:id', async (req, res) => {
    const genre = await Genre.find(req.params.id);
    if(!genre) return res.status(404).send('Could not find genre with that ID');
    res.send(genre);
});



function genreValidate(movie){
    const schema = Joi.object({
        name: Joi.string().min(1).required()
    });
    return schema.validate(genre, schema);
};


module.exports = router;


