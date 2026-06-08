const usernameInput = document.getElementById('username');
const accountsContainer = document.getElementById('accounts-container');
const under30Checkbox = document.getElementById('under30');
const above30Checkbox = document.getElementById('above30');
const sortBySelect = document.getElementById('sortBy');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNumbersContainer = document.getElementById('pageNumbers');
const modalName = document.getElementById('modalName');
const modalHandle = document.getElementById('modalHandle');
const modalAge = document.getElementById('modalAge');
const modalEmail = document.getElementById('modalEmail');
const modalBalance = document.getElementById('modalBalance');
const modalStatus = document.getElementById('modalStatus');
const accountModal = document.getElementById('accountModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const addMoneyBtn = document.getElementById('addMoneyBtn');

const ACCOUNTS_DATA = [
  { "name": "Rahul Sharma", "age": 24, "handle": "@rahul_bank", "balance": 5000, "status": "This is a verified placeholder account profile." },
  { "name": "Amit Patel", "age": 35, "handle": "@amit_patel", "balance": 7500, "status": "Active user, exploring finance and tech." },
  { "name": "Anshul ", "age": 22, "handle": "@priya_singh", "balance": 3200000, "status": "Creative enthusiast sharing lifestyle content." },
  { "name": "Yash sir", "age": 42, "handle": "@sneha_r", "balance": 12000000, "status": "Mentor and guide in professional growth." },
  { "name": "Rohan Das", "age": 29, "handle": "@rohan_das", "balance": 4500, "status": "Tech-savvy coder and problem solver." },
  { "name": "Kartik", "age": 20, "handle": "@kartik_coder", "balance": 1500, "status": "Aspiring software engineer, learning daily." },
  { "name": "IMran sir", "age": 22, "handle": "@aisha_dev", "balance": 6000, "status": "Frontend developer passionate about design." },
  { "name": "Surjeet", "age": 19, "handle": "@rohan_codes", "balance": 85000000, "status": "Student coder experimenting with projects." },
  { "name": "Basmti", "age": 21, "handle": "@meera_designs", "balance": 273737900, "status": "Designer sharing creative portfolio work." },
  { "name": "Sanjay", "age": 45, "handle": "@sanjay_mentor", "balance": 15000, "status": "Experienced mentor guiding young professionals." },
  { "name": "Srinath", "age": 52, "handle": "@anita_writer", "balance": 93000000, "status": "Writer and storyteller with decades of experience." },
  { "name": "Shivam pareta", "age": 0, "handle": "@vikram_leader", "balance": -3000, "status": "Placeholder profile for leadership content." },
  { "name": "LAal kabutar", "age": 60, "handle": "@neelam_artist", "balance": 493939100, "status": "Artist showcasing creative works and ideas." },
  { "name": "Rajesh", "age": 55, "handle": "@rajesh_teacher", "balance": 8200, "status": "Educator inspiring students through knowledge." },
  { "name": "Garib", "age": 23, "handle": "@bhikhari-artist", "balance": 10, "status": "Emerging artist sharing raw and real content." }
];

let currentPage = 1;
const itemsPerPage = 4;
let activeAccount = null;

function updateStatusView() {
  if (activeAccount) {
    modalStatus.innerHTML = `
      <div class="space-y-1">
        <p>${activeAccount.status}</p>
        <p class="font-bold text-slate-800 mt-2 pt-2 border-t border-slate-200">Current Balance: ₹${activeAccount.balance}</p>
      </div>
    `;
  }
}

function openModal(account) {
  activeAccount = account;
  modalName.textContent = account.name;
  modalHandle.textContent = account.handle;
  modalAge.textContent = account.age;
  updateStatusView();
  accountModal.classList.remove('hidden');
}

function closeModal() {
  accountModal.classList.add('hidden');
  activeAccount = null;
}

function renderAccounts(accounts) {
  accountsContainer.textContent = "";

  if (accounts.length === 0) {
    accountsContainer.innerHTML = `
      <p class="text-gray-500 col-span-full text-center font-medium">
        No bank accounts match your filters.
      </p>`;
    return;
  }

  accounts.forEach((account) => {
    const card = document.createElement('div');
    card.className = "p-6 bg-white border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer";
    
    card.innerHTML = `
      <h3 class="text-lg font-bold text-slate-800">${account.name}</h3>
      <p class="text-sm text-orange-500 font-semibold mb-1">${account.handle}</p>
      <p class="text-xs text-slate-500">Age: <span class="font-bold text-slate-700">${account.age}</span></p>
    `;
    
    card.addEventListener('click', () => openModal(account));
    accountsContainer.appendChild(card);
  });
}

function filterBySearch(accounts, query) {
  if (!query) return accounts;
  const cleanQuery = query.toLowerCase().trim();
  
  return accounts.filter(({ name, handle }) => 
    name.toLowerCase().includes(cleanQuery) || 
    handle.toLowerCase().includes(cleanQuery)
  );
}

function filterByAge(accounts, isUnder30, isAbove30) {
  if (isUnder30 === isAbove30) return accounts;
  return accounts.filter(account => isUnder30 ? account.age < 30 : account.age >= 30);
}

function sortAccounts(accounts, criteria) {
  const strategies = {
    name: (a, b) => a.name.localeCompare(b.name),
    ageLow: (a, b) => a.age - b.age,
    ageHigh: (a, b) => b.age - a.age
  };

  const sortStrategy = strategies[criteria];
  return sortStrategy ? [...accounts].sort(sortStrategy) : accounts;
}

function renderPaginationControls(totalPages) {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  pageNumbersContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 
      ${isActive 
        ? 'bg-orange-400 text-slate-900 z-10 font-bold' 
        : 'bg-orange-200 text-gray-900 hover:bg-orange-300'}`;

    btn.addEventListener('click', () => {
      currentPage = i;
      handleFilterPipeline(); 
    });

    pageNumbersContainer.appendChild(btn);
  }
}

function handleFilterPipeline() {
  let processedData = [...ACCOUNTS_DATA];

  processedData = filterBySearch(processedData, usernameInput.value);
  processedData = filterByAge(processedData, under30Checkbox.checked, above30Checkbox.checked);
  processedData = sortAccounts(processedData, sortBySelect.value);

  const totalPages = Math.ceil(processedData.length / itemsPerPage) || 1;
  
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const itemsToDisplay = processedData.slice(startIndex, endIndex);

  renderAccounts(itemsToDisplay);
  renderPaginationControls(totalPages);
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    handleFilterPipeline();
  }
});

nextBtn.addEventListener('click', () => {
  currentPage++;
  handleFilterPipeline();
});

usernameInput.addEventListener('input', () => {
  currentPage = 1;
  handleFilterPipeline();
});

under30Checkbox.addEventListener('change', () => {
  currentPage = 1;
  handleFilterPipeline();
});

above30Checkbox.addEventListener('change', () => {
  currentPage = 1;
  handleFilterPipeline();
});

sortBySelect.addEventListener('change', handleFilterPipeline);

closeModalBtn.addEventListener('click', closeModal);

accountModal.addEventListener('click', (e) => {
  if (e.target === accountModal) closeModal();
});

addMoneyBtn.addEventListener('click', () => {
  if (activeAccount) {
    const amountStr = prompt("Enter amount to add:");
    const amount = parseFloat(amountStr);
    
    if (!isNaN(amount) && amount > 0) {
      activeAccount.balance += amount;
      updateStatusView();
    } else if (amountStr !== null) {
      alert("Please enter a valid positive number.");
    }
  }
});

handleFilterPipeline();