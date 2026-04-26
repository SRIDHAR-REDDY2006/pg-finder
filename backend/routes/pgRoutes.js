const express = require('express');
const router = express.Router();
const { getAllPGs, getPGById, createPG, updatePG, deletePG, getMyPGs } = require('../controllers/pgController');
const { protect, ownerOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllPGs);
router.get('/mypgs', protect, ownerOnly, getMyPGs);
router.get('/:id', getPGById);
router.post('/', protect, ownerOnly, upload.array('images', 5), createPG);
router.put('/:id', protect, ownerOnly, updatePG);
router.delete('/:id', protect, ownerOnly, deletePG);

module.exports = router;