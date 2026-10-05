const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedSuperAdmin = async () => {
    try {
        const adminExists = await User.findOne({ phone: "01777375744" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("max123", 10);
            await User.create({
                name: "Md. Nasim Haider",
                phone: "01777375744",
                password: hashedPassword,
                role: "Super Admin",
                counter_name: "Head Office"
            });
            console.log("Default Super Admin created in Database!");
        } else {
            console.log("Super Admin already exists in Database.");
        }
    } catch (error) {
        console.error("Error seeding Super Admin:", error.message);
    }
};

module.exports = seedSuperAdmin;