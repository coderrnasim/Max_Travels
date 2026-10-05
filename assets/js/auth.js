// ==========================================
// 1. BACKEND API LOGIN HANDLER (WITH FULL-FRAME AVATAR)
// ==========================================
async function handleLogin(event) {
    event.preventDefault();

    const phoneInput = document.getElementById('phone').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    const modalTitle = alertModal ? alertModal.querySelector('h3') : null;
    const alertOkBtn = document.getElementById('alertOkBtn');
    
    // মডালের প্রোফাইল পিকচার বা লোগোর ট্যাগ (HTML এর সাথে মিল রেখে)
    const loginModalAvatar = document.getElementById('loginModalAvatar') || document.getElementById('successUserAvatar');
    const defaultLogo = 'assets/images/MaxLogoIcon.png';

    try {
        // ১. ব্যাকএন্ড সার্ভারে লগইন রিকোয়েস্ট পাঠানো
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phoneInput,
                password: passwordInput
            })
        });

        const data = await response.json();

        // ২. লগইন সফল হলে (Status 200)
        if (response.ok && data.success) {
            // সিকিউর টোকেন ও ইউজার ডাটা সেভ রাখা
            localStorage.setItem('token', data.token);
            localStorage.setItem('loggedUser', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');

            // ইউজার নির্দিষ্ট কাস্টম অ্যাভাটার কী (Key)
            const userSpecificAvatarKey = `permanent_avatar_${(data.user.name || 'user').replace(/\s+/g, '_')}`;
            const permanentAvatar = localStorage.getItem(userSpecificAvatarKey);

            // ডায়নামিক প্রোফাইল পিকচার সেট (পুরো এরিয়া জুড়েই বড় আকারে দেখাবে)
            if (loginModalAvatar) {
                // পুরানো কোনো ব্যাকগ্রাউন্ড বা প্যাডিং বর্ডার ক্লাস থাকলে সরিয়ে পুরো জায়গা কভার করার ক্লাস যুক্ত করা
                loginModalAvatar.className = "w-full h-full object-cover rounded-full block";

                if (permanentAvatar) {
                    loginModalAvatar.src = permanentAvatar;
                } else if (data.user && (data.user.profilePic || data.user.avatarUrl)) {
                    loginModalAvatar.src = data.user.profilePic || data.user.avatarUrl;
                } else {
                    const encodedName = encodeURIComponent(data.user.name || 'User');
                    loginModalAvatar.src = `https://ui-avatars.com/api/?name=${encodedName}&background=70C844&color=fff&bold=true`;
                }

                // ছবি লোড হতে সমস্যা হলে ব্যাকআপ লোগো দেখাবে
                loginModalAvatar.onerror = function() {
                    this.src = defaultLogo;
                    this.className = "w-full h-full object-contain p-2";
                };
            }
            
            // সাকসেস মডাল শো করা
            if (alertModal && alertMessage) {
                if (modalTitle) modalTitle.innerText = 'Login Successful';
                alertMessage.innerText = `স্বাগতম, ${data.user.name}! আপনার ড্যাশবোর্ড লোড হচ্ছে...`;
                if (alertOkBtn) alertOkBtn.style.display = 'none';

                alertModal.classList.remove('hidden');
                setTimeout(() => {
                    alertModal.classList.remove('opacity-0');
                }, 10);

                // ৩ সেকেন্ড পর ড্যাশবোর্ডে রিডাইরেক্ট
                setTimeout(() => {
                    window.location.href = 'views/dashboard/dashboard.html';
                }, 3000);
            } else {
                window.location.href = 'views/dashboard/dashboard.html';
            }

        } else {
            // ৩. ব্যাকএন্ড থেকে ভুল ফোন/পাসওয়ার্ড আসলে
            throw new Error(data.message || 'ভুল ফোন নম্বর অথবা পাসওয়ার্ড!');
        }

    } catch (error) {
        // ৪. লগইন ব্যর্থ বা সার্ভার অফ থাকলে
        if (loginModalAvatar) {
            loginModalAvatar.src = defaultLogo;
            loginModalAvatar.className = "w-full h-full object-contain p-2";
        }

        if (modalTitle) modalTitle.innerText = 'Login Failed';
        if (alertMessage) {
            alertMessage.innerText = error.message || 'সার্ভারে সমস্যা হচ্ছে, অনুগ্রহ করে আবার চেষ্টা করুন!';
        }
        if (alertOkBtn) alertOkBtn.style.display = 'block';

        if (alertModal) {
            alertModal.classList.remove('hidden');
            setTimeout(() => {
                alertModal.classList.remove('opacity-0');
            }, 10);
        } else {
            alert(error.message);
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