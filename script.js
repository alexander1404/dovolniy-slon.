document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const sealButton = document.getElementById('seal-button');
    const mainHub = document.getElementById('main-hub');
    const audioPlayer = document.getElementById('audio-player');

    // --- ПРОВЕРКА ВОЗВРАТА ИЗ ДЕМО (ПРОПУСК WELCOME) ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from_demo') === 'true' || window.location.hash === '#invitations-catalog') {
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (mainHub) {
            mainHub.classList.remove('hidden');
            mainHub.style.opacity = '1';
        }
    }

    // Элементы единого плеера
    const globalToggleBtn = document.getElementById('global-toggle-btn');
    const globalVolume = document.getElementById('global-volume');
    const playerTrackTitle = document.getElementById('player-track-title');

    let currentCardBtn = null;
    let isOpened = false;

    // Начальная громкость 80%
    audioPlayer.volume = 0.8;

    // Функция обновления состояния кнопок плеера
    const syncControlsState = (isPlaying, title) => {
        if (title) playerTrackTitle.textContent = title;
        globalToggleBtn.textContent = isPlaying ? '⏸ Пауза' : '▶ Играть';
    };

    // --- 1. ВСКРЫТИЕ КОНВЕРТА (СТАРТ WELCOME-ЗВУКА) ---
    const handleOpen = (e) => {
        if (e) e.preventDefault();
        if (isOpened) return;
        isOpened = true;

        audioPlayer.src = 'assets/audio/welcome.mp3';
        audioPlayer.play().then(() => {
            syncControlsState(true, 'Приветствие: Довольный Слон');
        }).catch(err => console.log("Автозвук заблокирован:", err));

        const stamp = sealButton.querySelector('.seal-stamp');
        if (stamp) {
            stamp.style.transform = 'scale(0.85) rotate(-8deg)';
            stamp.style.opacity = '0.4';
        }

        setTimeout(() => {
            welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                mainHub.classList.remove('hidden');
            }, 800);
        }, 1200);
    };

    sealButton.addEventListener('click', handleOpen);
    sealButton.addEventListener('touchstart', handleOpen, { passive: false });

    // --- 2. ЕДИНАЯ КНОПКА ПАУЗЫ / СТАРТА ---
    globalToggleBtn.addEventListener('click', () => {
        if (!audioPlayer.src) return;

        if (!audioPlayer.paused) {
            audioPlayer.pause();
            syncControlsState(false);
            if (currentCardBtn) currentCardBtn.textContent = '▶ Воспроизвести';
        } else {
            audioPlayer.play();
            syncControlsState(true);
            if (currentCardBtn) currentCardBtn.textContent = '⏸ Пауза';
        }
    });

    // --- 3. РЕГУЛЯТОР ГРОМКОСТИ ---
    globalVolume.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value;
    });

    // --- 4. КАРТОЧКИ АУДИО-ВИТРИНЫ ---
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach(btn => {
        const toggleTrack = (e) => {
            if (e) e.preventDefault();

            const src = btn.getAttribute('data-track');
            const cardTitle = btn.parentElement.querySelector('h3').textContent;

            if (currentCardBtn === btn && !audioPlayer.paused) {
                audioPlayer.pause();
                btn.textContent = '▶ Воспроизвести';
                syncControlsState(false);
                currentCardBtn = null;
                return;
            }

            if (currentCardBtn) {
                currentCardBtn.textContent = '▶ Воспроизвести';
            }

            audioPlayer.src = src;
            audioPlayer.play().then(() => {
                btn.textContent = '⏸ Пауза';
                currentCardBtn = btn;
                syncControlsState(true, `Сейчас играет: ${cardTitle}`);
            }).catch(err => console.error("Ошибка трека:", err));
        };

        btn.addEventListener('click', toggleTrack);
        btn.addEventListener('touchstart', toggleTrack, { passive: false });
    });

    audioPlayer.addEventListener('ended', () => {
        if (currentCardBtn) {
            currentCardBtn.textContent = '▶ Воспроизвести';
            currentCardBtn = null;
        }
        syncControlsState(false, 'Выберите трек для прослушивания');
    });

    // --- 5. ФИЛЬТРАЦИЯ КАТАЛОГА ПО КАТЕГОРИЯМ ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sampleCards = document.querySelectorAll('.sample-card');

    tabBtns.forEach(tab => {
        tab.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tab.classList.add('active');

            const selectedCategory = tab.getAttribute('data-category');

            sampleCards.forEach(card => {
                const cardCategory = card.getAttribute('data-cat');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 6. МОДАЛЬНОЕ ОКНО ПРЕДПРОСМОТРА С ГАЛЕРЕЕЙ И ДЕМО ---
    const templatesData = {
        wedding: {
            title: "Шаблон «Gold & Velvet»",
            badge: "💍 Свадебное приглашение",
            desc: "Элегантный золотой стиль с музыкой, анимированной сургучной печатью и формой подтверждения присутствия.",
            images: [
                "assets/images/envelope-bg.webp",
                "assets/images/seal-stamp.png",
                "assets/images/envelope-bg.webp"
            ],
            features: [
                "🎵 Фоновое романтическое аудио",
                "👗 Палитра дресс-кода для гостей",
                "⏳ Тайминг свадебного дня",
                "📍 Карта и адрес локации",
                "💌 RSVP-форма подтверждения присутствия"
            ],
            demoUrl: "#"
        },
        anniversary: {
            title: "Шаблон «Grand Jubilee»",
            badge: "🥂 Приглашение на Юбилей",
            desc: "Статусный дизайн с фотохроникой памятных событий и обратным отсчетом.",
            images: [
                "assets/images/envelope-bg.webp",
                "assets/images/seal-stamp.png"
            ],
            features: [
                "📜 История юбиляра в фотографиях",
                "🎥 Видео-обращение к гостям",
                "🎁 Вишлист и форма пожеланий"
            ],
            demoUrl: "anniversary-demo.html"
        },
        genderparty: {
            title: "Шаблон «Boy or Girl?»",
            badge: "👶 Gender Reveal",
            desc: "Интерактивный формат для интригующего вечера раскрытия пола будущего ребенка.",
            images: [
                "assets/images/envelope-bg.webp",
                "assets/images/seal-stamp.png"
            ],
            features: [
                "🗳 Голосование гостей (Мальчик/Девочка)",
                "⏳ Таймер обратного отсчета",
                "📍 Карта и адрес проведения"
            ],
            demoUrl: "#"
        },
        birthday: {
            title: "Шаблон «Party Night»",
            badge: "🎂 День рождения",
            desc: "Яркий веб-пригласительный для незабываемой вечеринки с друзьями.",
            images: [
                "assets/images/envelope-bg.webp",
                "assets/images/seal-stamp.png"
            ],
            features: [
                "🎶 Плейлист от гостей",
                "🎁 Список желаемых подарков (вишлист)",
                "⏰ Дресс-код и тайминг вечера"
            ],
            demoUrl: "#"
        },
        b2b: {
            title: "Шаблон «Corporate Event»",
            badge: "💼 B2B & Корпоративы",
            desc: "Строгий деловой стиль для деловых презентаций, форумов и корпоративов.",
            images: [
                "assets/images/envelope-bg.webp",
                "assets/images/seal-stamp.png"
            ],
            features: [
                "📋 Программа спикеров и выступлений",
                "🎫 QR-код участника для входа",
                "🚌 Трансфер и схема проезда"
            ],
            demoUrl: "#"
        },
        custom: {
            title: "Шаблон «Custom Concept»",
            badge: "🎭 Особые события",
            desc: "Индивидуальная разработка дизайна и интерактива под эксклюзивную концепцию.",
            images: [
                "assets/images/envelope-bg.webp",
                "assets/images/seal-stamp.png"
            ],
            features: [
                "🎨 Уникальная стилистика и графика",
                "🔊 Авторский звуковой дизайн",
                "⚡ Персональная механика взаимодействия"
            ],
            demoUrl: "#"
        }
    };

    const modal = document.getElementById('demo-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    document.querySelectorAll('.open-demo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const demoType = btn.getAttribute('data-demo');
            const data = templatesData[demoType] || templatesData['wedding'];

            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-badge').textContent = data.badge;
            document.getElementById('modal-description').textContent = data.desc;

            const galleryGrid = document.getElementById('modal-gallery-grid');
            galleryGrid.innerHTML = data.images.map(img => `<img src="${img}" class="gallery-item" alt="Превью">`).join('');

            const featuresList = document.getElementById('modal-features-list');
            featuresList.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

            document.getElementById('modal-demo-link').href = data.demoUrl;

            modal.classList.remove('hidden-modal');
        });
    });

    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden-modal'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden-modal');
    });
});