// UrbanRoots Global Notification System
// Replaces browser alert() and confirm() with beautiful animated UI

(function () {
  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    /* Toast Notifications */
    #ur-toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .ur-toast {
      pointer-events: all;
      min-width: 280px;
      max-width: 380px;
      padding: 14px 18px;
      border-radius: 14px;
      background: #ffffff;
      border-left: 4px solid #10b981;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      animation: ur-toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
      font-family: 'Inter', sans-serif;
    }
    .ur-toast.hiding {
      animation: ur-toast-out 0.3s ease forwards;
    }
    .ur-toast-success { border-left-color: #10b981; }
    .ur-toast-success .ur-toast-icon { color: #10b981; }
    
    .ur-toast-error   { border-left-color: #ef4444; }
    .ur-toast-error .ur-toast-icon { color: #ef4444; }
    
    .ur-toast-info    { border-left-color: #3b82f6; }
    .ur-toast-info .ur-toast-icon { color: #3b82f6; }
    
    .ur-toast-warn    { border-left-color: #f59e0b; }
    .ur-toast-warn .ur-toast-icon { color: #f59e0b; }
    
    .ur-toast-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
    .ur-toast-body { flex: 1; }
    .ur-toast-title { font-weight: 800; font-size: 14px; color: #1e293b; margin-bottom: 2px; }
    .ur-toast-msg   { font-size: 13px; color: #475569; line-height: 1.4; font-weight: 500; }
    .ur-toast-close { 
      background: none; border: none; color: #64748b; cursor: pointer; font-size: 16px; 
      padding: 0; line-height: 1; flex-shrink: 0; transition: color 0.2s;
    }
    .ur-toast-close:hover { color: #f8fafc; }
    .ur-toast-bar {
      position: absolute; bottom: 0; left: 0; height: 3px; border-radius: 0 0 14px 14px;
      animation: ur-toast-bar 3s linear forwards;
    }
    .ur-toast { position: relative; overflow: hidden; }
    .ur-toast-success .ur-toast-bar { background: #10b981; }
    .ur-toast-error   .ur-toast-bar { background: #ef4444; }
    .ur-toast-info    .ur-toast-bar { background: #3b82f6; }
    .ur-toast-warn    .ur-toast-bar { background: #f59e0b; }

    @keyframes ur-toast-in  { from { opacity:0; transform: translateX(120%) scale(0.9); } to { opacity:1; transform: translateX(0) scale(1); } }
    @keyframes ur-toast-out { from { opacity:1; transform: translateX(0); }              to { opacity:0; transform: translateX(120%); } }
    @keyframes ur-toast-bar { from { width: 100%; } to { width: 0%; } }

    /* Confirm Dialog */
    #ur-confirm-overlay {
      position: fixed; inset: 0; z-index: 99998;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; padding: 20px;
      animation: ur-overlay-in 0.2s ease;
    }
    @keyframes ur-overlay-in { from { opacity:0; } to { opacity:1; } }
    #ur-confirm-box {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 1);
      border-radius: 24px;
      padding: 32px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 24px 64px rgba(0,0,0,0.1);
      font-family: 'Inter', sans-serif;
      animation: ur-confirm-in 0.35s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes ur-confirm-in { from { opacity:0; transform: scale(0.85) translateY(20px); } to { opacity:1; transform: scale(1) translateY(0); } }
    #ur-confirm-icon { font-size: 44px; text-align: center; margin-bottom: 12px; color: #10b981; }
    #ur-confirm-title { font-size: 22px; font-weight: 800; color: #064e3b; text-align: center; margin-bottom: 8px; font-family: 'Poppins', sans-serif; }
    #ur-confirm-msg { font-size: 14px; color: #475569; text-align: center; line-height: 1.6; font-weight: 500; margin-bottom: 24px; }
    #ur-confirm-btns { display: flex; gap: 12px; }
    #ur-confirm-btns button {
      flex: 1; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 700;
      cursor: pointer; border: none; transition: all 0.2s; font-family: 'Inter', sans-serif;
    }
    #ur-confirm-cancel {
      background: #f1f5f9; color: #64748b;
      border: 1px solid #e2e8f0 !important;
    }
    #ur-confirm-cancel:hover { background: #e2e8f0; color: #334155; }
    #ur-confirm-ok { background: #ef4444; color: #fff; box-shadow: 0 4px 15px rgba(239,68,68,0.25); }
    #ur-confirm-ok:hover { background: #dc2626; transform: scale(1.02); }
    #ur-confirm-ok.green { background: #10b981; box-shadow: 0 4px 15px rgba(16,185,129,0.3); }
    #ur-confirm-ok.green:hover { background: #059669; }
  `;
  document.head.appendChild(style);

  // Create toast container
  const toastContainer = document.createElement('div');
  toastContainer.id = 'ur-toast-container';
  document.body.appendChild(toastContainer);

  const icons = { success: '<i class="fa-solid fa-check"></i>', error: '<i class="fa-solid fa-xmark"></i>', info: 'ℹ️', warn: '⚠️' };
  const titles = { success: 'Success', error: 'Error', info: 'Info', warn: 'Warning' };

  window.showToast = function (message, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `ur-toast ur-toast-${type}`;
    toast.innerHTML = `
      <div class="ur-toast-icon">${icons[type] || 'ℹ️'}</div>
      <div class="ur-toast-body">
        <div class="ur-toast-title">${titles[type] || 'Notification'}</div>
        <div class="ur-toast-msg">${message}</div>
      </div>
      <button class="ur-toast-close" onclick="this.closest('.ur-toast').remove()">×</button>
      <div class="ur-toast-bar"></div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  window.showConfirm = function (message, onConfirm, { title = 'Are you sure?', icon = '🗑️', confirmText = 'Confirm', confirmClass = '' } = {}) {
    const overlay = document.createElement('div');
    overlay.id = 'ur-confirm-overlay';
    overlay.innerHTML = `
      <div id="ur-confirm-box">
        <div id="ur-confirm-icon">${icon}</div>
        <div id="ur-confirm-title">${title}</div>
        <div id="ur-confirm-msg">${message}</div>
        <div id="ur-confirm-btns">
          <button id="ur-confirm-cancel">Cancel</button>
          <button id="ur-confirm-ok" class="${confirmClass}">${confirmText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#ur-confirm-cancel').onclick = () => overlay.remove();
    overlay.querySelector('#ur-confirm-ok').onclick = () => { overlay.remove(); onConfirm(); };
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  };
})();
