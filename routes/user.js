const express = require('express');
const { updateUser, updatePassword, deleteUser, getUsers, getSingleUser } = require('../controllers/user');
const {verify, verifyAdmin} = require('../middleware/task');
const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getSingleUser);
router.put('/update-info', verify, updateUser);
router.put('/update-password', verify, updatePassword);
router.delete('/delete-user/:id', verifyAdmin, deleteUser);

module.exports = router;