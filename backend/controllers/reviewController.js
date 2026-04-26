const Review = require('../models/Review');

// Add review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      pg: req.params.pgId,
      student: req.user._id,
      rating, comment
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a PG
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ pg: req.params.pgId })
      .populate('student', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getReviews };