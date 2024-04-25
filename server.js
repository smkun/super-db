const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Superhero = require('./models/Superhero');
const methodOverride = require('method-override');
const { getNextSequence} = require('./utils/sequence');

require('dotenv').config();
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect(process.env.MONGODB_URI, {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// INDEX route
app.get('/', async (req, res) => {
  try {
    const superheroes = await Superhero.find();
    res.render('index', { superheroes });
  } catch (error) {
    console.error('Error fetching superheroes:', error);
    res.status(500).send('Internal Server Error');
  }
});

// NEW route
app.get('/new', (req, res) => {
  res.render('new');
});

// CREATE route
app.post('/', async (req, res) => {
  try {
    const superhero = new Superhero({
      _id: await getNextSequence('superheroID'),
      ...req.body,
    });

    await superhero.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error creating superhero:', error);
    res.status(500).send('Internal Server Error');
  }
});

// SHOW route
app.get('/:id', async (req, res) => {
  try {
    const superhero = await Superhero.findById(req.params.id);
    res.render('show', { superhero });
  } catch (error) {
    console.error('Error fetching superhero:', error);
    res.status(500).send('Internal Server Error');
  }
});

// EDIT route
app.get('/:id/edit', async (req, res) => {
  try {
    const superhero = await Superhero.findById(req.params.id);
    res.render('edit', { superhero });
  } catch (error) {
    console.error('Error fetching superhero:', error);
    res.status(500).send('Internal Server Error');
  }
});

// UPDATE route
app.put('/:id', async (req, res) => {
  try {
    await Superhero.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/${req.params.id}`);
  } catch (error) {
    console.error('Error updating superhero:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE route
app.delete('/:id', async (req, res) => {
  try {
    await Superhero.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting superhero:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});