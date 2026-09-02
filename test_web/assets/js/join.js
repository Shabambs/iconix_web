window.addEventListener('DOMContentLoaded', () => {
    // Initialize Particles for background
    if (typeof ParticleEngine !== 'undefined') {
        new ParticleEngine('bg-canvas');
    }

    // Check for Discord OAuth redirects
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('login_success')) {
        setTimeout(() => showToast('✅ ' + urlParams.get('login_success').replace(/\+/g, ' ')), 500);
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.has('login_error')) {
        setTimeout(() => showToast('❌ ' + urlParams.get('login_error').replace(/\+/g, ' ')), 500);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

/* TOAST NOTIFICATION */
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
