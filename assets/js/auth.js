// Login Form Handler
// Login Form Handler
function handleLogin(event) {
    event.preventDefault();

    const phoneInput = document.getElementById('phone').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    // LocalStorage থেকে ইউজার লিস্ট নিয়ে আসা
    const users = JSON.parse(localStorage.getItem('system_users')) || [];

    // ইউজার ও পাসওয়ার্ড ম্যাচ করা
    const matchedUser = users.find(u => u.phone === phoneInput && u.password === passwordInput);

    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    const modalTitle = alertModal ? alertModal.querySelector('h3') : null;
    const alertOkBtn = document.getElementById('alertOkBtn');

    if (matchedUser) {
        // সফল হলে কারেন্ট ইউজার ও লগইন স্টেট সেভ করুন
        localStorage.setItem('currentUser', JSON.stringify(matchedUser));
        localStorage.setItem('loggedUser', JSON.stringify(matchedUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        if (alertModal && alertMessage) {
            if (modalTitle) modalTitle.innerText = 'Login Successful';
            alertMessage.innerText = `স্বাগতম, ${matchedUser.name}! আপনার ড্যাশবোর্ড লোড হচ্ছে...`;
            
            // সফল লগইনে ওকে (OK) বাটনটি হাইড করে দেওয়া হলো
            if (alertOkBtn) alertOkBtn.style.display = 'none';

            alertModal.classList.remove('hidden');
            setTimeout(() => {
                alertModal.classList.remove('opacity-0');
            }, 10);

            // ৫ সেকেন্ড অপেক্ষা করে ড্যাশবোর্ডে রিডাইরেক্ট হবে
            setTimeout(() => {
                window.location.href = 'views/dashboard/dashboard.html';
            }, 3000);
        } else {
            window.location.href = 'views/dashboard/dashboard.html';
        }
    } else {
        // ভুল হলে মডালের টাইটেল, মেসেজ এবং ওকে বাটন দৃশ্যমান করা
        if (modalTitle) modalTitle.innerText = 'Login Failed';
        if (alertMessage) {
            alertMessage.innerText = 'ভুল ফোন নম্বর অথবা পাসওয়ার্ড! দয়া করে সঠিক তথ্য দিন।';
        }
        
        // ভুল পাসওয়ার্ড দিলে OK বাটনটি আবার শো করবে
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

// Password Visibility Toggle for Login Page
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

// Password Visibility Toggle for Login Page
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