// ==========================================
// 1. LOGIN FORM HANDLER
// ==========================================
function handleLogin(event) {
    event.preventDefault();

    const phoneInput = document.getElementById('phone').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    // LocalStorage থেকে 'system_users' কী (Key) রিড করা
    const users = JSON.parse(localStorage.getItem('system_users')) || [];

    // ফোন নম্বর ও পাসওয়ার্ড যাচাই করা
    const matchedUser = users.find(u => u.phone === phoneInput && u.password === passwordInput);

    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    const modalTitle = alertModal ? alertModal.querySelector('h3') : null;
    const alertOkBtn = document.getElementById('alertOkBtn');

    if (matchedUser) {
        // লগইন সফল হলে কারেন্ট ইউজার সেভ করা
        localStorage.setItem('loggedUser', JSON.stringify(matchedUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        if (alertModal && alertMessage) {
            if (modalTitle) modalTitle.innerText = 'Login Successful';
            alertMessage.innerText = `স্বাগতম, ${matchedUser.name}! আপনার ড্যাশবোর্ড লোড হচ্ছে...`;
            if (alertOkBtn) alertOkBtn.style.display = 'none';

            alertModal.classList.remove('hidden');
            setTimeout(() => {
                alertModal.classList.remove('opacity-0');
            }, 10);

            // ৩ সেকেন্ড পর ড্যাশবোর্ডে রিডাইরেক্ট হবে
            setTimeout(() => {
                window.location.href = 'views/dashboard/dashboard.html';
            }, 3000);
        } else {
            window.location.href = 'views/dashboard/dashboard.html';
        }
    } else {
        // লগইন ব্যর্থ হলে
        if (modalTitle) modalTitle.innerText = 'Login Failed';
        if (alertMessage) {
            alertMessage.innerText = 'ভুল ফোন নম্বর অথবা পাসওয়ার্ড! দয়া করে সঠিক তথ্য দিন।';
        }
        if (alertOkBtn) alertOkBtn.style.display = 'block';

        if (alertModal) {
            alertModal.classList.remove('hidden');
            setTimeout(() => {
                alertModal.classList.remove('opacity-0');
            }, 10);
        } else {
            alert('ভুল ফোন নম্বর অথবা পাসওয়ার্ড!');
        }
    }
}

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

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

// Close Custom Alert Modal
function closeAlertModal() {
    const alertModal = document.getElementById('alertModal');
    if (alertModal) {
        alertModal.classList.add('hidden');
    }
}

// ==========================================
// 3. AUTO INITIALIZE DEFAULT SUPER ADMIN
// ==========================================
// যদি কোনো ইউজার না থাকে তবে অটোমেটিক Super Admin ক্রিয়েট হবে
document.addEventListener('DOMContentLoaded', () => {
    let users = JSON.parse(localStorage.getItem('system_users')) || [];
    if (users.length === 0) {
        const defaultAdmin = {
            id: Date.now(),
            name: "Md. Nasim Haider",
            phone: "01777375744",
            role: "Super Admin",
            city: "Head Office",
            counter: "Head Office",
            password: "max123"
        };
        users.push(defaultAdmin);
        localStorage.setItem('system_users', JSON.stringify(users));
        console.log("Default Super Admin created successfully!");
    }
});