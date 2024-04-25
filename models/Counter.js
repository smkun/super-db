const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: Number,
});

const Counter = mongoose.model('Counter', counterSchema, 'counters');

module.exports = Counter;