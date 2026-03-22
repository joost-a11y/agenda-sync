const express = require('express');
const {
  addICSSource,
  getICSSources,
  updateICSSource,
  deleteICSSource,
  syncNow,
  getSyncLogs,
} = require('../controllers/icsController');

const router = express.Router();

router.post('/sources', addICSSource);
router.get('/sources', getICSSources);
router.put('/sources/:id', updateICSSource);
router.delete('/sources/:id', deleteICSSource);
router.post('/sync', syncNow);
router.get('/logs', getSyncLogs);

module.exports = router;
