let roleSelectInstance = null;
let citySelectInstance = null;

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Tom Select for User Role Dropdown
    roleSelectInstance = new TomSelect('#userRole', {
        create: false,
        controlInput: null,
        onChange: function (value) {
            handleRoleChange(value);
        }
    });

    // Initialize Tom Select for Dynamic City Dropdown
    citySelectInstance = new TomSelect('#userCity', {
        create: false,
        controlInput: null
    });
});

// Dynamic City and Counter Visibility Logic
function handleRoleChange(role) {
    const cityGroup = document.getElementById('cityGroup');
    const counterGroup = document.getElementById('counterGroup');

    let cities = [];

    if (role === 'Manager') {
        cities = ['Bholahat', 'Dhaka', 'Head Office'];
    } else if (role === 'Up Counter Man' || role === 'Down Counter Man') {
        cities = ['Bholahat', 'Chapainawabganj', 'Kansat', 'Rajshahi', 'Dhaka Kodomtoli'];
    }

    if (cities.length > 0) {
        cityGroup.classList.remove('hidden');
        if (counterGroup) counterGroup.classList.remove('hidden');

        // Update Dynamic Options in Tom Select Instance
        if (citySelectInstance) {
            citySelectInstance.clearOptions();
            citySelectInstance.addOptions(cities.map(c => ({ value: c, text: c })));
            citySelectInstance.setValue(cities[0]);
        }
    } else {
        cityGroup.classList.add('hidden');
        if (counterGroup) counterGroup.classList.add('hidden');
    }
}

// Password Visibility Toggle
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Form Submission Handler
function handleCreateUser(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value.trim();
    const role = document.getElementById('userRole').value;
    const city = document.getElementById('userCity') ? document.getElementById('userCity').value : '';
    const counter = document.getElementById('userCounter') ? document.getElementById('userCounter').value : '';
    const password = document.getElementById('userPassword').value;

    // ১. আগের সেভ হওয়া ইউজারদের তালিকা নিয়ে আসা (যদি থাকে)
    let users = JSON.parse(localStorage.getItem('system_users')) || [];

    // ২. চেক করা এই ফোন নম্বর দিয়ে ইতোমধ্যে কোনো ইউজার আছে কি না
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
        alert('এই ফোন নম্বর দিয়ে ইতোমধ্যে একটি ইউজার অ্যাকাউন্ট রয়েছে!');
        return;
    }

    // ৩. নতুন ইউজারের ডাটা অবজেক্ট তৈরি
    const newUser = {
        id: Date.now(),
        name: name,
        phone: phone,
        role: role,
        city: city,
        counter: counter,
        password: password
    };

    // ৪. অ্যারেতে নতুন ইউজার যোগ করা এবং LocalStorage এ সেভ করা
    users.push(newUser);
    localStorage.setItem('system_users', JSON.stringify(users));

    alert(`User ${name} created successfully as ${role}!`);

    // ৫. ফর্ম এবং ড্রপডাউনগুলো পুরোপুরি রিসেট করা
    document.getElementById('createUserForm').reset();
    if (roleSelectInstance) roleSelectInstance.clear();
    if (citySelectInstance) citySelectInstance.clear();
    
    // হাইড থাকা ফিল্ডগুলো আবার লুকিয়ে ফেলা
    document.getElementById('cityGroup').classList.add('hidden');
    document.getElementById('counterGroup').classList.add('hidden');
}
