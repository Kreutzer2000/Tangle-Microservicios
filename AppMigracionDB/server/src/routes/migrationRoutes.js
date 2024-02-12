const express = require('express');
const migrationController = require('../controllers/migrationController');
const router = express.Router();

router.post('/start', migrationController.startMigration);

module.exports = router;
