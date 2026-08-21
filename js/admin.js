document.addEventListener('DOMContentLoaded', function() {

    // ===== ТЕМА (для админки) =====
    const themeToggle = document.getElementById('adminThemeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            this.textContent = isLight ? '☀️' : '🌙';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // ===== ВХОД / ПАРОЛЬ =====
    const loginPage = document.getElementById('loginPage');
    const adminContent = document.getElementById('adminContent');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const loginMsg = document.getElementById('loginMessage');

    function hash(pwd) { return btoa(pwd); }

    const stored = localStorage.getItem('adminPasswordHash');

    if (!stored) {
        loginMsg.textContent = 'Установите пароль';
        loginBtn.textContent = 'Установить';
        loginBtn.onclick = function() {
            const pwd = passwordInput.value.trim();
            if (pwd.length < 4) { loginError.textContent = 'Минимум 4 символа'; return; }
            localStorage.setItem('adminPasswordHash', hash(pwd));
            loginError.textContent = '';
            loginMsg.textContent = 'Пароль установлен! Войдите.';
            loginBtn.textContent = 'Войти';
            passwordInput.value = '';
            loginBtn.onclick = doLogin;
        };
    } else {
        loginMsg.textContent = 'Введите пароль';
        loginBtn.textContent = 'Войти';
        loginBtn.onclick = doLogin;
    }

    function doLogin() {
        const pwd = passwordInput.value.trim();
        if (hash(pwd) === localStorage.getItem('adminPasswordHash')) {
            loginPage.style.display = 'none';
            adminContent.style.display = 'block';
            // Загружаем данные
            renderApplications();
            renderVideos();
        } else {
            loginError.textContent = 'Неверный пароль';
            passwordInput.value = '';
        }
    }

    // ===== ОТОБРАЖЕНИЕ ЗАЯВОК =====
    window.renderApplications = function() {
        const container = document.getElementById('applicationsList');
        const apps = JSON.parse(localStorage.getItem('applications')) || [];

        console.log('📩 Заявок найдено:', apps.length); // отладка

        if (apps.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">Заявок пока нет. Отправьте тестовую заявку на главной.</p>';
            return;
        }

        container.innerHTML = apps.map(app => `
            <div class="admin-item" data-id="${app.id}">
                <div class="info">
                    <strong>${app.name}</strong>
                    <span class="meta">${app.phone} • ${app.date}</span>
                    <span class="status-badge status-${app.status}">${statusLabel(app.status)}</span>
                    ${app.reply ? `<div style="margin-top:6px; font-size:14px; color: var(--cyan);">📨 Ответ: ${app.reply}</div>` : ''}
                    <div class="reply-box" id="replyBox-${app.id}">
                        <textarea rows="2">${app.reply || ''}</textarea>
                        <button class="save-reply" data-id="${app.id}">Сохранить ответ</button>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn-processed" data-id="${app.id}">✅ Обработано</button>
                    <button class="btn-reply" data-id="${app.id}">✉️ Ответить</button>
                    <button class="btn-delete" data-id="${app.id}">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');

        // Обработчики
        document.querySelectorAll('.btn-processed').forEach(b => b.onclick = function() {
            const id = Number(this.dataset.id);
            let apps = JSON.parse(localStorage.getItem('applications'));
            apps = apps.map(a => { if (a.id === id) a.status = 'processed'; return a; });
            localStorage.setItem('applications', JSON.stringify(apps));
            renderApplications();
        });
        document.querySelectorAll('.btn-reply').forEach(b => b.onclick = function() {
            const id = Number(this.dataset.id);
            const box = document.getElementById('replyBox-' + id);
            box.style.display = box.style.display === 'block' ? 'none' : 'block';
        });
        document.querySelectorAll('.save-reply').forEach(b => b.onclick = function() {
            const id = Number(this.dataset.id);
            const text = this.parentElement.querySelector('textarea').value.trim();
            if (text) {
                let apps = JSON.parse(localStorage.getItem('applications'));
                apps = apps.map(a => { if (a.id === id) { a.reply = text; a.status = 'replied'; } return a; });
                localStorage.setItem('applications', JSON.stringify(apps));
                renderApplications();
            }
        });
        document.querySelectorAll('.btn-delete').forEach(b => b.onclick = function() {
            if (confirm('Удалить заявку?')) {
                const id = Number(this.dataset.id);
                let apps = JSON.parse(localStorage.getItem('applications'));
                apps = apps.filter(a => a.id !== id);
                localStorage.setItem('applications', JSON.stringify(apps));
                renderApplications();
            }
        });
    };

    function statusLabel(s) {
        const map = { 'new': '🆕 Новая', 'processed': '✅ Обработана', 'replied': '✉️ Ответ отправлен' };
        return map[s] || s;
    }

    // ===== ВИДЕО =====
    window.renderVideos = function() {
        const container = document.getElementById('videoList');
        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        if (videos.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted);">Видео пока нет.</p>';
            return;
        }
        container.innerHTML = videos.map((v, i) => `
            <div class="admin-item">
                <div class="info">
                    <strong>${v.title}</strong>
                    <span class="meta"><a href="${v.url}" target="_blank">${v.url}</a></span>
                </div>
                <div class="actions">
                    <button class="btn-delete" data-index="${i}">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');
        document.querySelectorAll('#videoList .btn-delete').forEach(b => b.onclick = function() {
            const idx = Number(this.dataset.index);
            if (confirm('Удалить видео?')) {
                let videos = JSON.parse(localStorage.getItem('videos'));
                videos.splice(idx, 1);
                localStorage.setItem('videos', JSON.stringify(videos));
                renderVideos();
            }
        });
    };

    document.getElementById('videoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('videoTitle').value.trim();
        const url = document.getElementById('videoURL').value.trim();
        if (title && url) {
            let videos = JSON.parse(localStorage.getItem('videos')) || [];
            videos.push({ title, url });
            localStorage.setItem('videos', JSON.stringify(videos));
            renderVideos();
            this.reset();
            alert('Видео добавлено!');
        }
    });

    // Выход
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('adminPasswordHash');
        location.reload();
    });

});