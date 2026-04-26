const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:pgId', protect, addReview);
router.get('/:pgId', getReviews);

module.exports = router;