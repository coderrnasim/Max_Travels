const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ইউজার/এডমিন লগইন এপিআই (রিয়েল ডাটাবেজ ভিত্তিক)
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // ১. ডাটাবেজে মোবাইল নম্বর দিয়ে ইউজার খোঁজা
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "ভুল ফোন নম্বর অথবা পাসওয়ার্ড!" 
            });
        }

        // ২. পাসওয়ার্ড হ্যাশ মিলিয়ে দেখা
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "ভুল ফোন নম্বর অথবা পাসওয়ার্ড!" 
            });
        }

        // ৩. JWT টোকেন জেনারেট করা
        const token = jwt.sign(
            { id: user._id, role: user.role, phone: user.phone },
            process.env.JWT_SECRET || 'max_travels_super_secret_key_2026',
            { expiresIn: '1d' }
        );

        // ৪. সফল রেসপন্স প্রদান
        return res.status(200).json({
            success: true,
            message: 'লগইন সফল হয়েছে!',
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                counter_name: user.counter_name,
                profilePicUrl: user.profilePicUrl
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'সার্ভার এরর, আবার চেষ্টা করুন!' 
        });
    }
};