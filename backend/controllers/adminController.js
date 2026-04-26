const User = require('../models/User');
const PG = require('../models/PG');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete any user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all PGs (including pending)
const getAllPGsAdmin = async (req, res) => {
  try {
    const pgs = await PG.find().populate('owner', 'name email phone');
    res.json(pgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve PG
const approvePG = async (req, res) => {
  try {
    const pg = await PG.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject PG
const rejectPG = async (req, res) => {
  try {
    const pg = await PG.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete any PG
const deletePGAdmin = async (req, res) => {
  try {
    await PG.findByIdAndDelete(req.params.id);
    res.json({ message: 'PG deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, deleteUser, getAllPGsAdmin, approvePG, rejectPG, deletePGAdmin };