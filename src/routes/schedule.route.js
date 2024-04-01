const ScheduleController = require('../controllers/schedule.controller');

const router = require('express').Router();

router.get('/', ScheduleController.Get);
router.get('/:id/schedule', ScheduleController.GetByID);
router.post('/post', ScheduleController.Post);
router.patch('/:id/schedule-update', ScheduleController.Update);
router.delete('/:id/schedule-delete', ScheduleController.Deleted);

module.exports = router;