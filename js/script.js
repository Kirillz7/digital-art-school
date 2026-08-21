// ============================================
// 1. ГАМБУРГЕР
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

// ============================================
// 2. ТЕМА
// ============================================
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ============================================
// 3. ЗАЯВКИ
// ============================================
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!name || !phone) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }
    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    const newApp = {
        id: Date.now(),
        name,
        phone,
        date: new Date().toLocaleString('ru-RU'),
        status: 'new',
        reply: ''
    };
    applications.push(newApp);
    localStorage.setItem('applications', JSON.stringify(applications));
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Отправлено!';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        this.reset();
        alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
    }, 1500);
});

// ============================================
// 4. ВИДЕО – МОДАЛКА И РЕДИРЕКТ НА video.html
// ============================================
const modal = document.getElementById('videoAccessModal');
const closeModal = document.getElementById('modalClose');
const freeLessonsBtn = document.getElementById('freeLessonsBtn');
const freeLessonsBtn2 = document.getElementById('freeLessonsBtn2');

function openModal() {
    modal.classList.add('active');
}
function closeModalHandler() {
    modal.classList.remove('active');
}

freeLessonsBtn.addEventListener('click', openModal);
freeLessonsBtn2.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalHandler);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalHandler();
});

// Обработка формы доступа – сохраняем и редиректим
document.getElementById('accessForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('accessEmail').value.trim();
    if (email) {
        localStorage.setItem('videoAccess', 'true');
        localStorage.setItem('videoAccessEmail', email);
        closeModalHandler();
        // Перенаправляем на страницу видео
        window.location.href = 'video.html';
    } else {
        alert('Введите email.');
    }
});

// ============================================
// 5. ПЛАВНЫЙ СКРОЛЛ
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ============================================
// 6. ТЕНЬ НА ХЕДЕРЕ
// ============================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 20) {
        header.style.boxShadow = '0 4px 40px rgba(0,0,0,0.4)';
    } else {
        header.style.boxShadow = 'none';
    }
});

console.log('🚀 Сайт «Цифровое Искусство» загружен!');