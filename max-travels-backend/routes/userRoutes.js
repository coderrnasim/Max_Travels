const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { upload } = require('../config/cloudinary');

// ইউজার তৈরি করার রাউট (ছবি আপলোডসহ)
if (upload && upload.single) {
    router.post('/create', upload.single('profilePic'), userController.createUser);
} else {
    router.post('/create', userController.createUser);
}

// সকল ইউজার দেখার রাউট
router.get('/', userController.getUsers);

module.exports = router;