const express = require('express');
const router = express.Router();
const {
  getAllUsers, deleteUser,
  getAllPGsAdmin, approvePG, rejectPG, deletePGAdmin
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/pgs', getAllPGsAdmin);
router.put('/pgs/:id/approve', approvePG);
router.put('/pgs/:id/reject', rejectPG);
router.delete('/pgs/:id', deletePGAdmin);

module.exports = router;