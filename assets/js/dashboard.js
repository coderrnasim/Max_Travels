/* =========================================================
   1. GLOBAL STATE & DOM INITIALIZATION
   ========================================================= */
let currentDateObj = new Date();
let calViewingDateObj = new Date();

// User Role Definition (Defaulting based on login session)
const currentUser = {
    role: "counterman",
    counterName: "Bholahat Counter"
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Today's Date Input Default Setup
    const todayStr = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('tripDate');
    if (dateInput) {
        dateInput.value = todayStr;
    }

    // 2. Load Profile Info
    await loadUserProfile();

    // 3. Sync UI State
    if (typeof updateUIState === 'function') {
        updateUIState();
    }
});

/* =========================================================
   2. USER PROFILE & DROPDOWN LOGIC
   ========================================================= */
async function loadUserProfile() {
    const token = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('loggedUser'));

    // ইউজার লগইন না থাকলে লগইন পেজে পাঠাবে
    if (!token && !savedUser) {
        window.location.href = '../../index.html';
        return;
    }

    try {
        let userData = savedUser;

        // ব্যাকএন্ড API থেকে লেটেস্ট তথ্য আনা (টোকেন থাকলে)
        if (token) {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    userData = result.data;
                    localStorage.setItem('loggedUser', JSON.stringify(userData));
                }
            }
        }

        // DOM-এ ইউজার ডাটা বসানো
        if (userData) {
            const userNameEl = document.getElementById('userName');
            const userRoleBadgeEl = document.getElementById('userRoleBadge');
            const userAvatarEl = document.getElementById('userAvatar');
            const userCounterEl = document.getElementById('userCounter');

            // নাম সেট করা
            if (userNameEl) {
                userNameEl.innerText = userData.name || userData.userName || 'User';
            }

            // রোল এবং লোকেশন হ্যান্ডেল করা
            const role = (userData.role || "").trim().toLowerCase();
            let displayLocation = userData.counter_name || userData.counter || userData.city || "Head Office";

            if (role === 'admin' || role === 'super admin' || role === 'superadmin') {
                displayLocation = "Head Office";
            }

            // নতুন সংশোধিত কোড (রোলের ব্যাজ হাইড থাকবে, শুধু নাম ও লোকেশন দেখাবে):
if (userRoleBadgeEl && userCounterEl) {
    // যেকোনো ইউজারের জন্যই রোলের ব্যাজ হাইড রাখা হলো
    userRoleBadgeEl.classList.add('hidden'); 
    
    // নিচে শুধু লোকেশন/কাউন্টারের নাম দেখাবে (যেমন: "শিবগঞ্জ Counter" বা "Shivganj")
    userCounterEl.innerText = displayLocation;
}

            // প্রোফাইল পিকচার সেট করা (Cloudinary URL / Local / Default UI Avatar)
            if (userAvatarEl) {
                const userSpecificAvatarKey = `permanent_avatar_${(userData.name || 'user').replace(/\s+/g, '_')}`;
                const permanentAvatar = localStorage.getItem(userSpecificAvatarKey);

                if (permanentAvatar) {
                    userAvatarEl.src = permanentAvatar;
                } else if (userData.profilePic || userData.avatarUrl) {
                    userAvatarEl.src = userData.profilePic || userData.avatarUrl;
                } else {
                    const encodedName = encodeURIComponent(userData.name || 'User');
                    userAvatarEl.src = `https://ui-avatars.com/api/?name=${encodedName}&background=70C844&color=fff&bold=true`;
                }
            }
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

function toggleUserDropdown(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function setActiveNav(element) {
    document.querySelectorAll('.glass-nav-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    const drawer = document.getElementById('mobileDrawer');
    if (drawer && !drawer.classList.contains('hidden')) {
        drawer.classList.add('hidden');
    }
}

function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    if (drawer) drawer.classList.toggle('hidden');
}

/* =========================================================
   3. DATE & CALENDAR MANAGEMENT
   ========================================================= */
function formatDateDisplay(date) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatInputValue(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy}`;
}

function updateUIState() {
    const formattedDisplay = formatDateDisplay(currentDateObj);
    const formattedInput = formatInputValue(currentDateObj);

    const currentDateDisplayEl = document.getElementById('currentDateDisplay');
    if (currentDateDisplayEl) currentDateDisplayEl.innerText = formattedDisplay;

    const tripDateDisplayInputEl = document.getElementById('tripDateDisplayInput');
    if (tripDateDisplayInputEl) tripDateDisplayInputEl.value = formattedInput;

    const tripDateEl = document.getElementById('tripDate');
    if (tripDateEl) tripDateEl.value = currentDateObj.toISOString().split('T')[0];

    document.querySelectorAll('.row-date-text').forEach(el => {
        const day = String(currentDateObj.getDate()).padStart(2, '0');
        const month = currentDateObj.toLocaleDateString('en-US', { month: 'short' });
        const year = currentDateObj.getFullYear();
        el.innerText = `${day} ${month}, ${year}`;
    });
}

function navigateDate(days) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let targetDate = new Date(currentDateObj);
    targetDate.setDate(targetDate.getDate() + days);

    // Role-based Date Access Permissions
    let diffTime = Math.abs(today - targetDate);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (targetDate < today) {
        if (currentUser.role === 'counterman' && diffDays > 1) {
            alert("কাউন্টারম্যানদের জন্য ১ দিনের বেশি পূর্বের তথ্য দেখা সংরক্ষিত।");
            return;
        } else if ((currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'manager') && diffDays > 30) {
            alert("এডমিন/ম্যানেজারগণ বিগত ৩০ দিনের বেশি তথ্য দেখতে পারবেন না।");
            return;
        }
    }

    currentDateObj = targetDate;
    calViewingDateObj = new Date(currentDateObj);
    updateUIState();
    renderGlassCalendar();
    searchTrips();
}

function selectToday() {
    currentDateObj = new Date();
    calViewingDateObj = new Date();
    updateUIState();
    renderGlassCalendar();
    searchTrips();
}

function toggleGlassCalendar(e) {
    if (e) e.stopPropagation();
    const cal = document.getElementById('glassCalendarPopup');
    if (!cal) return;

    if (cal.classList.contains('hidden')) {
        calViewingDateObj = new Date(currentDateObj);
        renderGlassCalendar();
        cal.classList.remove('hidden');
    } else {
        cal.classList.add('hidden');
    }
}

function changeCalMonth(offset) {
    calViewingDateObj.setMonth(calViewingDateObj.getMonth() + offset);
    renderGlassCalendar();
}

function renderGlassCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = calViewingDateObj.getFullYear();
    const month = calViewingDateObj.getMonth();

    const calMonthYearText = document.getElementById('calMonthYearText');
    if (calMonthYearText) calMonthYearText.innerText = `${monthNames[month]} ${year}`;

    const grid = document.getElementById('calDaysGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'glass-cal-day empty-day opacity-0';
        grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement('div');
        dayCell.innerText = day;
        dayCell.className = 'glass-cal-day flex items-center justify-center cursor-pointer p-1.5 rounded-lg hover:bg-green-100';

        const cellDate = new Date(year, month, day);

        if (cellDate.toDateString() === today.toDateString()) {
            dayCell.classList.add('border', 'border-[#0E2339]');
        }

        if (cellDate.toDateString() === currentDateObj.toDateString()) {
            dayCell.classList.add('bg-[#77C043]', 'text-[#0E2339]', 'font-bold');
        }

        dayCell.onclick = (e) => {
            e.stopPropagation();
            currentDateObj = new Date(year, month, day);
            updateUIState();
            searchTrips();
            const cal = document.getElementById('glassCalendarPopup');
            if (cal) cal.classList.add('hidden');
        };

        grid.appendChild(dayCell);
    }
}

/* =========================================================
   4. SEARCH & ACTION HANDLERS
   ========================================================= */
function searchTrips() {
    console.log(`Searching trips for date: ${formatInputValue(currentDateObj)}`);
}

function handleMobileSearch(e) {
    if (e) e.preventDefault();
    const mobileInput = document.getElementById('mobileSearchInput');
    const mobile = mobileInput ? mobileInput.value : '';
    if (mobile) {
        alert(`Searching records for mobile number: ${mobile}`);
    } else {
        alert('Please enter a mobile number to search.');
    }
}

function handlePnrSearch(e) {
    if (e) e.preventDefault();
    const pnrInput = document.getElementById('pnrSearchInput');
    const pnrVal = pnrInput ? pnrInput.value : '';
    if (!pnrVal) return alert('অনুগ্রহ করে PNR বা মোবাইল নম্বর লিখুন');
    alert(`PNR/মোবাইল নম্বর: ${pnrVal} দিয়ে যাত্রীর তথ্য খোঁজা হচ্ছে...`);
}

function openChallanModal(coachNo) {
    if (currentUser.role === 'counterman') {
        alert(`[${currentUser.counterName}] চালান দেখাচ্ছে:\nকোচ নম্বর: ${coachNo}\nশুধু আপনার কাউন্টার থেকে বিক্রি হওয়া টিকিটের বিবরণ দেখাচ্ছে।`);
    } else {
        alert(`[সকল কাউন্টার রিপোর্ট - ${currentUser.role.toUpperCase()}]\nকোচ নম্বর: ${coachNo}\nপুরো গাড়ির সম্পূর্ণ চালান রিপোর্ট ওপেন হচ্ছে...`);
    }
}

function openSeatSelection(coachNo) {
    alert(`কোচ নম্বর ${coachNo} এর সীট প্ল্যান প্যানেল ওপেন করা হচ্ছে... এখান থেকে টিকিট কাটুন।`);
}

/* =========================================================
   5. LOGOUT MODAL HANDLERS
   ========================================================= */
function openLogoutModal() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) userDropdown.classList.add('hidden');

    const modal = document.getElementById('logoutModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.glass-modal-card')?.classList.remove('scale-95');
    }, 10);
}

function handleLogout() {
    openLogoutModal();
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (!modal) return;

    modal.classList.add('opacity-0');
    modal.querySelector('.glass-modal-card')?.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function confirmLogout() {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.clear();
    window.location.href = '../../index.html';
}

/* =========================================================
   6. OUTSIDE CLICK LISTENER
   ========================================================= */
document.addEventListener('click', function (e) {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const calPopup = document.getElementById('glassCalendarPopup');
    const tripInputContainer = document.getElementById('tripDateDisplayInput') ? document.getElementById('tripDateDisplayInput').parentElement : null;

    if (userDropdown && !userDropdown.classList.contains('hidden') && userMenuBtn && !userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }

    if (calPopup && !calPopup.classList.contains('hidden') && tripInputContainer && !tripInputContainer.contains(e.target) && !calPopup.contains(e.target)) {
        calPopup.classList.add('hidden');
    }
});