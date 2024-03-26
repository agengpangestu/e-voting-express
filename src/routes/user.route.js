const UserController = require('../controllers/user.controller');

const router = require('express').Router();

router.get('/', UserController.Get);
router.get('/:id/user', UserController.GetByID);
router.post('/post', UserController.Post);
router.patch('/:id/user-update', UserController.Update);
router.delete('/:id/user-delete', UserController.Deleted);

module.exports = router;