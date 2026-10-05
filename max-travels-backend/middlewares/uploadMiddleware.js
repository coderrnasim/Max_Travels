const multer = require('multer');

// মেমোরিতে ফাইল সাময়িকভাবে স্টোর করে ক্লাউডিনারিতে পাঠাবে
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // সর্বোচ্চ ৫ মেগাবাইট
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('শুধুমাত্র ছবি আপলোড করতে পারবেন!'), false);
        }
    }
});

module.exports = upload;