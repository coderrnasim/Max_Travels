let roleSelectInstance = null;
let citySelectInstance = null;

// ১. Up ও Down Counter Man-এর জন্য সিটির তালিকা (English)
const upCounterCities = [
    "Bholahat", 
    "Rohanpur", 
    "Kanshat", 
    "Shibganj", 
    "Chapainawabganj", 
    "Godagari", 
    "Rajshahi"
];

const downCounterCities = [
    "Kodomtoli", 
    "Atibazar", 
    "Dhaka", 
    "Chandura"
];

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Tom Select for User Role Dropdown
    if (document.getElementById('userRole')) {
        roleSelectInstance = new TomSelect('#userRole', {
            create: false,
            controlInput: null,
            onChange: function (value) {
                handleRoleChange(value);
            }
        });
    }

    // Initialize Tom Select for Dynamic City Dropdown
    if (document.getElementById('userCity')) {
        citySelectInstance = new TomSelect('#userCity', {
            create: false,
            controlInput: null
        });
    }

    // Attach Form Submit Listener
    const createUserForm = document.getElementById('createUserForm');
    if (createUserForm) {
        createUserForm.addEventListener('submit', handleCreateUser);
    }
});

// ২. Dynamic City and Counter Visibility Logic (Tom Select সামঞ্জস্যপূর্ণ)
function handleRoleChange(role) {
    const cityGroup = document.getElementById('cityGroup');
    const counterGroup = document.getElementById('counterGroup');

    let cities = [];

    // রোল অনুযায়ী নির্দিষ্ট সিটির লিস্ট সেট করা
    if (role === 'Up Counter Man') {
        cities = upCounterCities;
    } else if (role === 'Down Counter Man') {
        cities = downCounterCities;
    } else if (role === 'Manager') {
        cities = ['Volahat', 'Dhaka', 'Head Office'];
    }

    // সিটি এবং কাউন্টার গ্রুপ দেখানো অথবা লুকানো
    if (cities.length > 0) {
        if (cityGroup) cityGroup.classList.remove('hidden');
        if (counterGroup) counterGroup.classList.remove('hidden');

        // Tom Select Instance-এ অপশন আপডেট করা
        if (citySelectInstance) {
            citySelectInstance.clear();
            citySelectInstance.clearOptions();
            citySelectInstance.addOptions(cities.map(c => ({ value: c, text: c })));
            citySelectInstance.setValue(cities[0]);
        }
    } else {
        if (cityGroup) cityGroup.classList.add('hidden');
        if (counterGroup) counterGroup.classList.add('hidden');
        if (citySelectInstance) {
            citySelectInstance.clear();
            citySelectInstance.clearOptions();
        }
    }
}

// Password Visibility Toggle
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Form Submission Handler (Connected to Node.js Backend API)
async function handleCreateUser(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const role = document.getElementById('userRole').value;
    const city = document.getElementById('userCity') ? document.getElementById('userCity').value : '';
    const counter = document.getElementById('userCounter') ? document.getElementById('userCounter').value.trim() : '';
    const password = document.getElementById('userPassword').value;
    const profilePicInput = document.getElementById('profilePic');

    if (!name || !phone || !password || !role) {
        alert('অনুগ্রহ করে প্রয়োজনীয় সব তথ্য প্রদান করুন!');
        return;
    }

    // ব্যাকএন্ডে Multipart/Form-Data পাঠানোর জন্য FormData অবজেক্ট তৈরি
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('city', city);
    formData.append('counter_name', counter || 'Head Office');

    // ছবি সিলেক্ট করা থাকলে যুক্ত করা
    if (profilePicInput && profilePicInput.files[0]) {
        formData.append('profilePic', profilePicInput.files[0]);
    }

    try {
        const response = await fetch('http://localhost:5000/api/users/create', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert(`ব্যবহারকারী ${name} সফলভাবে তৈরি হয়েছে!`);

            // ফর্ম এবং ড্রপডাউন রিসেট করা
            document.getElementById('createUserForm').reset();
            if (roleSelectInstance) roleSelectInstance.clear();
            if (citySelectInstance) citySelectInstance.clear();

            // ফিল্ডগুলো লুকানো
            const cityGroup = document.getElementById('cityGroup');
            const counterGroup = document.getElementById('counterGroup');
            if (cityGroup) cityGroup.classList.add('hidden');
            if (counterGroup) counterGroup.classList.add('hidden');
        } else {
            alert(data.message || 'ব্যবহারকারী তৈরি করতে ব্যর্থ হয়েছে!');
        }
    } catch (error) {
        console.error('Create User Error:', error);
        alert('সার্ভারে যোগাযোগ করতে সমস্যা হচ্ছে! ব্যাকএন্ড সার্ভার চালু আছে কিনা নিশ্চিত করুন।');
    }
}