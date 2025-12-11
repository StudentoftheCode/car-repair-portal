// public/js/admin/dashboard.js

// Toggle Add Job form
const btnAddJob = document.getElementById('btnAddJob');
const addJobForm = document.getElementById('addJobForm');
if (btnAddJob && addJobForm) {
  btnAddJob.addEventListener('click', () => {
    const show = addJobForm.style.display !== 'block';
    addJobForm.style.display = show ? 'block' : 'none';
    if (show) { addJobForm.classList.add('fade-in'); }
  });
}

// Toggle Search form
const btnSearchJob = document.getElementById('btnSearchJob');
const searchJobForm = document.getElementById('searchJobForm');
if (btnSearchJob && searchJobForm) {
  btnSearchJob.addEventListener('click', () => {
    const show = searchJobForm.style.display !== 'block';
    searchJobForm.style.display = show ? 'block' : 'none';
    if (show) { searchJobForm.classList.add('fade-in'); }
    // hide the add job if search opens
    if (show && addJobForm) addJobForm.style.display = 'none';
  });
}

// Modal view button hooking (safe-guard if elements exist)
const viewButtons = document.querySelectorAll('.view-btn');
const modal = document.getElementById('jobModal');
const closeModal = document.getElementById('closeModal');
if (viewButtons && modal) {
  viewButtons.forEach(btn => btn.addEventListener('click', () => {
    document.getElementById('modalCustomer').innerText = btn.dataset.customer || '';
    document.getElementById('modalPhone').innerText = btn.dataset.phone || '';
    document.getElementById('modalVIN').innerText = btn.dataset.vin || '';
    document.getElementById('modalMake').innerText = btn.dataset.make || '';
    document.getElementById('modalModel').innerText = btn.dataset.model || '';
    document.getElementById('modalYear').innerText = btn.dataset.year || '';
    document.getElementById('modalDate').innerText = btn.dataset.date || '';
    document.getElementById('modalStatus').innerText = btn.dataset.status || '';
    modal.style.display = 'block';
  }));
}
if (closeModal && modal) closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });