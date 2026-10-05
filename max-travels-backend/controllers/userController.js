const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ১. নতুন কাউন্টার ইউজার/স্টাফ তৈরি করা (ছবিসহ)
exports.createUser = async (req, res) => {
    try {
        const { name, phone, password, role, counter_name } = req.body;

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "এই ফোন নম্বর দিয়ে ইতিপূর্বে একাউন্ট খোলা হয়েছে!" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePicUrl = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
        if (req.file && req.file.path) {
            profilePicUrl = req.file.path;
        }

        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            role: role || "Counter Master",
            counter_name,
            profilePicUrl
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "নতুন ব্যবহারকারী সফলভাবে তৈরি হয়েছে!",
            user: {
                id: newUser._id,
                name: newUser.name,
                phone: newUser.phone,
                role: newUser.role,
                counter_name: newUser.counter_name,
                profilePicUrl: newUser.profilePicUrl
            }
        });

    } catch (error) {
        console.error("Create User Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "সার্ভার এরর!", 
            error: error.message 
        });
    }
};

// ২. সকল ইউজারের তালিকা পাওয়া
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "সার্ভার এরর!" });
    }
};