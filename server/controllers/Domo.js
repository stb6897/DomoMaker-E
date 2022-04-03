const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.coolPoints) {
    return res.status(400).json({ error: 'Both name, age, and cool points are required!' });
  }

  if (req.body.name && req.body.age === -1 && req.body.coolPoints === -1) {
    DomoModel.findByOwnerAndName(req.session.account._id, req.body.name, (err, docs) => {
      docs.forEach((doc) => {
        DomoModel.deleteOne({ _id: doc._id, name: doc.name }, (err2) => {
          if (err2) console.log(err2);
          console.log('deleted');
        });
      });
    });

    return res.status(400).json({ error: `Deleted all ${req.body.name}` });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    coolPoints: req.body.coolPoints,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({
      name: newDomo.name,
      age: newDomo.age,
      coolPoints: newDomo.coolPoints,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occured.' });
  }
};

const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }

  return res.json({ domos: docs });
});

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
