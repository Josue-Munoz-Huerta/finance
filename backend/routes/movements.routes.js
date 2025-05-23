const express = require('express');
const router = express.Router();
const movementsController = require('../controllers/movements.controller');

// Rutas
router.get('/', movementsController.getAll);
router.post('/', movementsController.create);
router.get('/:id', movementsController.getById);
router.put('/:id', movementsController.update);
router.delete('/:id', movementsController.delete);

module.exports = router;