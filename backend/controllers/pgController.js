const PG = require('../models/PG');

// Get all PGs
const getAllPGs = async (req, res) => {
  try {
    const { city, gender, minPrice, maxPrice } = req.query;
    let filter = {status: 'approved'};
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (gender) filter.gender = gender;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const pgs = await PG.find(filter).populate('owner', 'name email phone');
    res.json(pgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single PG
const getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id).populate('owner', 'name email phone');
    if (!pg) return res.status(404).json({ message: 'PG not found' });
    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create PG
const createPG = async (req, res) => {
  try {
    const { title, description, price, address, city, gender, amenities, phone } = req.body;
    const images = req.files ? req.files.map(f => f.path) : [];
    const pg = await PG.create({
      owner: req.user._id,
      title, description, price, address, city, gender,
      amenities: amenities ? amenities.split(',') : [],
      images, phone
    });
    res.status(201).json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update PG
const updatePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: 'PG not found' });
    if (pg.owner.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    const updated = await PG.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete PG
const deletePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: 'PG not found' });
    if (pg.owner.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    await pg.deleteOne();
    res.json({ message: 'PG removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get owner's PGs
const getMyPGs = async (req, res) => {
  try {
    const pgs = await PG.find({ owner: req.user._id });
    res.json(pgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllPGs, getPGById, createPG, updatePG, deletePG, getMyPGs };