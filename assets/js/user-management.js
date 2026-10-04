// Mock Database (পরবর্তীতে ব্যাকএন্ড API বা Database দিয়ে রিপ্লেস হবে)
const existingPhoneNumbers = ['01712335898', '01800000000'];

function handleCreateUser(event) {
  event.preventDefault();
  
  const phoneInput = document.getElementById('regPhone').value;
  const phoneError = document.getElementById('phoneError');

  // Unique Mobile Number Check
  if (existingPhoneNumbers.includes(phoneInput)) {
    phoneError.classList.remove('hidden');
    return;
  } else {
    phoneError.classList.add('hidden');
  }

  const formData = {
    counterManName: document.getElementById('counterManName').value,
    counterName: document.getElementById('counterName').value,
    city: document.getElementById('city').value,
    userRole: document.getElementById('userRole').value,
    phone: phoneInput
  };

  console.log('New User Account Created:', formData);
  alert(`নতুন ${formData.userRole} আইডি সফলভাবে ক্রিয়েট হয়েছে!`);
  
  // ফর্ম ক্লিয়ার করা
  document.getElementById('createUserForm').reset();
}