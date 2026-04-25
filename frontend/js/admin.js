// js/admin.js

let adminData = null;

async function initAdminDashboard() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch admin data');
    adminData = await res.json();

    // Update Counts
    document.getElementById('admin-users-count').textContent = adminData.users.length;
    document.getElementById('admin-gardens-count').textContent = adminData.gardens.length;
    document.getElementById('admin-posts-count').textContent = adminData.posts.length;

    // Default Tab
    switchAdminTab('users');
  } catch (e) {
    showToast(e.message, 'error');
  }
}

function switchAdminTab(tabName) {
  // Update Buttons
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('bg-emerald-500', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-600');
    } else {
      btn.classList.remove('bg-emerald-500', 'text-white', 'shadow-md');
      btn.classList.add('bg-white', 'text-slate-600');
    }
  });

  // Render Table
  renderAdminTable(tabName);
}

function renderAdminTable(tabName, searchTerm = '') {
  const tbody = document.getElementById('admin-table-body');
  const thead = document.getElementById('admin-table-head');
  tbody.innerHTML = '';

  const term = searchTerm.toLowerCase();

  if (tabName === 'users') {
    thead.innerHTML = `<tr><th class="px-4 py-3 text-left">Name</th><th class="px-4 py-3 text-left">Email</th><th class="px-4 py-3 text-left">Role</th><th class="px-4 py-3 text-left">Joined</th></tr>`;
    const filtered = adminData.users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    tbody.innerHTML = filtered.map(u => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="px-4 py-3 font-bold text-slate-800">${u.name}</td>
        <td class="px-4 py-3 text-slate-600">${u.email}</td>
        <td class="px-4 py-3"><span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-bold uppercase">${u.role}</span></td>
        <td class="px-4 py-3 text-slate-500 text-sm">${new Date(u.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('') || `<tr><td colspan="4" class="text-center py-6 text-slate-500">No users found.</td></tr>`;
  }

  else if (tabName === 'gardens') {
    thead.innerHTML = `<tr><th class="px-4 py-3 text-left">Garden Name</th><th class="px-4 py-3 text-left">Owner</th><th class="px-4 py-3 text-left">Type</th><th class="px-4 py-3 text-right">Actions</th></tr>`;
    const filtered = adminData.gardens.filter(g => g.name.toLowerCase().includes(term) || (g.owner?.name || '').toLowerCase().includes(term));
    tbody.innerHTML = filtered.map(g => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="px-4 py-3 font-bold text-slate-800">${g.name}</td>
        <td class="px-4 py-3 text-slate-600">${g.owner?.name || 'Unknown'} (${g.owner?.email || 'N/A'})</td>
        <td class="px-4 py-3"><span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-bold uppercase">${g.type}</span></td>
        <td class="px-4 py-3 text-right"><button onclick="promptDelete('garden', '${g._id}')" class="text-xs bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-colors">Delete</button></td>
      </tr>
    `).join('') || `<tr><td colspan="4" class="text-center py-6 text-slate-500">No gardens found.</td></tr>`;
  }

  else if (tabName === 'posts') {
    thead.innerHTML = `<tr><th class="px-4 py-3 text-left">Author</th><th class="px-4 py-3 text-left">Content</th><th class="px-4 py-3 text-left">Date</th><th class="px-4 py-3 text-right">Actions</th></tr>`;
    const filtered = adminData.posts.filter(p => p.content.toLowerCase().includes(term) || (p.creator?.name || '').toLowerCase().includes(term));
    tbody.innerHTML = filtered.map(p => {
      let mediaHtml = '';
      if (p.media && p.media.length > 0) {
        mediaHtml = `<div class="mt-2 flex gap-2 overflow-x-auto pb-1 pl-1">` + p.media.map(m => `<img src="${m}" onclick="window.open('${m}', '_blank')" class="h-10 w-10 object-cover rounded shadow-sm border border-slate-200 cursor-pointer hover:scale-110 transition-transform" title="Click to view full size">`).join('') + `</div>`;
      }
      return `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="px-4 py-3 font-bold text-slate-800">${p.creator?.name || 'Unknown'}<br><span class="text-[12px] text-slate-800 font-medium">${p.creator?.email || ''}</span></td>
        <td class="px-4 py-3 text-slate-600">
          <div class="truncate max-w-xs">${p.content}</div>
          ${mediaHtml}
        </td>
        <td class="px-4 py-3 text-slate-500 text-sm">${new Date(p.createdAt).toLocaleDateString()}</td>
        <td class="px-4 py-3 text-right"><button onclick="promptDelete('post', '${p._id}')" class="text-xs bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-colors">Delete</button></td>
      </tr>
      `;
    }).join('') || `<tr><td colspan="4" class="text-center py-6 text-slate-500">No posts found.</td></tr>`;
  }

  else if (tabName === 'plants') {
    thead.innerHTML = `<tr><th class="px-4 py-3 text-left">Plant Name</th><th class="px-4 py-3 text-left">Seller</th><th class="px-4 py-3 text-left">Price</th><th class="px-4 py-3 text-right">Actions</th></tr>`;
    const filtered = adminData.plants.filter(p => p.name.toLowerCase().includes(term) || (p.seller?.name || '').toLowerCase().includes(term));
    tbody.innerHTML = filtered.map(p => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="px-4 py-3 font-bold text-slate-800">${p.name}</td>
        <td class="px-4 py-3 font-bold text-slate-800">${p.seller?.name || 'Unknown'}<br><span class="text-[12px] text-slate-500 font-medium">${p.seller?.email || ''}</span></td>
        <td class="px-4 py-3 text-emerald-600 font-bold">₹${p.price}</td>
        <td class="px-4 py-3 text-right"><button onclick="promptDelete('plant', '${p._id}')" class="text-xs bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-colors">Delete</button></td>
      </tr>
    `).join('') || `<tr><td colspan="4" class="text-center py-6 text-slate-500">No plants found.</td></tr>`;
  }

  else if (tabName === 'events') {
    thead.innerHTML = `<tr><th class="px-4 py-3 text-left">Event Title</th><th class="px-4 py-3 text-left">Host</th><th class="px-4 py-3 text-left">Date</th><th class="px-4 py-3 text-right">Actions</th></tr>`;
    const filtered = adminData.events.filter(e => e.title.toLowerCase().includes(term) || (e.creator?.name || '').toLowerCase().includes(term));
    tbody.innerHTML = filtered.map(e => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="px-4 py-3 font-bold text-slate-800">${e.title}</td>
        <td class="px-4 py-3 font-bold text-slate-800">${e.creator?.name || 'Unknown'}<br><span class="text-[12px] text-slate-500 font-medium">${e.creator?.email || ''}</span></td>
        <td class="px-4 py-3 text-slate-500 text-sm">${new Date(e.date).toLocaleDateString()}</td>
        <td class="px-4 py-3 text-right"><button onclick="promptDelete('event', '${e._id}')" class="text-xs bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-colors">Delete</button></td>
      </tr>
    `).join('') || `<tr><td colspan="4" class="text-center py-6 text-slate-500">No events found.</td></tr>`;
  }
}

// Attach Search Listener
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('admin-search');
  const suggestionBox = document.getElementById('admin-search-suggestions');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      const activeTab = document.querySelector('.admin-tab-btn.bg-emerald-500').dataset.tab;
      renderAdminTable(activeTab, val);

      if (!val || !adminData) {
        if (suggestionBox) suggestionBox.classList.add('hidden');
        return;
      }

      // Generate suggestions globally
      let suggestions = [];

      adminData.users.forEach(u => {
        if (u.name.toLowerCase().includes(val) || u.email.toLowerCase().includes(val))
          suggestions.push({ type: 'User', text: u.name, sub: u.email, tab: 'users' });
      });
      adminData.gardens.forEach(g => {
        if (g.name.toLowerCase().includes(val))
          suggestions.push({ type: 'Garden', text: g.name, sub: g.owner?.name, tab: 'gardens' });
      });
      adminData.posts.forEach(p => {
        if (p.content.toLowerCase().includes(val))
          suggestions.push({ type: 'Post', text: p.content.substring(0, 30) + '...', sub: p.creator?.name, tab: 'posts' });
      });
      adminData.plants.forEach(p => {
        if (p.name.toLowerCase().includes(val))
          suggestions.push({ type: 'Marketplace', text: p.name, sub: p.seller?.name, tab: 'plants' });
      });
      adminData.events.forEach(ev => {
        if (ev.title.toLowerCase().includes(val))
          suggestions.push({ type: 'Event', text: ev.title, sub: ev.creator?.name, tab: 'events' });
      });

      suggestions = suggestions.slice(0, 8); // Top 8 suggestions

      if (suggestionBox) {
        if (suggestions.length > 0) {
          suggestionBox.innerHTML = suggestions.map(s => `
            <div class="px-4 py-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                 onclick="selectSuggestion('${s.tab}', '${s.text.replace(/'/g, "\\'")}')">
              <div class="flex justify-between items-center gap-2">
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-slate-800 truncate">${s.text}</p>
                  <p class="text-xs text-slate-500 truncate">${s.sub || ''}</p>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg shrink-0">${s.type}</span>
              </div>
            </div>
          `).join('');
          suggestionBox.classList.remove('hidden');
        } else {
          suggestionBox.innerHTML = '<div class="px-4 py-3 text-sm text-slate-500 text-center font-medium">No matches found</div>';
          suggestionBox.classList.remove('hidden');
        }
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (suggestionBox && e.target !== searchInput && !suggestionBox.contains(e.target)) {
        suggestionBox.classList.add('hidden');
      }
    });
  }
});

function selectSuggestion(tab, text) {
  const searchInput = document.getElementById('admin-search');
  if (searchInput) searchInput.value = text;

  const suggestionBox = document.getElementById('admin-search-suggestions');
  if (suggestionBox) suggestionBox.classList.add('hidden');

  switchAdminTab(tab);
  renderAdminTable(tab, text);
}

let currentDeleteTarget = { type: null, id: null };

function promptDelete(type, id) {
  currentDeleteTarget = { type, id };
  document.getElementById('adminDeleteModal').classList.remove('hidden');
  document.getElementById('adminDeleteReason').value = '';
}

function closeDeleteModal() {
  document.getElementById('adminDeleteModal').classList.add('hidden');
  currentDeleteTarget = { type: null, id: null };
}

async function confirmAdminDelete() {
  const reason = document.getElementById('adminDeleteReason').value.trim();
  if (!reason) {
    showToast('Please provide a reason for deletion.', 'warn');
    return;
  }

  const { type, id } = currentDeleteTarget;
  const token = localStorage.getItem('token');
  const btn = document.getElementById('adminConfirmDeleteBtn');
  const origText = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';
  btn.disabled = true;

  try {
    const res = await fetch(`/api/admin/delete/${type}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    showToast(data.message || 'Deleted successfully', 'success');
    closeDeleteModal();
    // Refresh admin data
    await initAdminDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.innerHTML = origText;
    btn.disabled = false;
  }
}
