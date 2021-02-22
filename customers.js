const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    isGold: Boolean,
    phone: String,
});

const Customer = mongoose.model('Customer', customerSchema);


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});


router.post('/', async (req, res) => {
    const { error } = genreValidate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    const customer = new Customer({ name: req.body.name });
    const result = await customer.save();

    res.send(result);
});


router.put('/:id', async (req, res) => {
    const { error } = genreValidate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if(!customer) return res.status(400).send('The requested movie was not found');

    res.send(customer);
});


router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) return res.status(400).send('The requested movie was not found');

    res.send(customer);
});


router.get('/:id', async (req, res) => {
    const customer = await Customer.find(req.params.id);
    if(!customer) return res.status(404).send('Could not find genre with that ID');
    res.send(customer);
});


function genreValidate(movie){
    const schema = Joi.object({
        name: Joi.string().min(1).required()
    });
    return schema.validate(genre, schema);
};


module.exports = router;
