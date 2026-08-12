document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const sealButton = document.getElementById('seal-button');
    const mainHub = document.getElementById('main-hub');
    const audioPlayer = document.getElementById('audio-player');

    // Элементы единого плеера
    const globalToggleBtn = document.getElementById('global-toggle-btn');
    const globalVolume = document.getElementById('global-volume');
    const playerTrackTitle = document.getElementById('player-track-title');

    let currentCardBtn = null;
    let isOpened = false;

    // Начальная громкость 80%
    audioPlayer.volume = 0.8;

    // Функция обновления состояния кнопок
    const syncControlsState = (isPlaying, title) => {
        if (title) playerTrackTitle.textContent = title;
        globalToggleBtn.textContent = isPlaying ? '⏸ Пауза' : '▶ Играть';
    };

    // --- 1. ВСКРЫТИЕ КОНВЕРТА (СТАРТ WELCOME-ЗВУКА) ---
    const handleOpen = (e) => {
        if (e) e.preventDefault();
        if (isOpened) return;
        isOpened = true;

        // Включаем welcome.mp3 через единый плеер
        audioPlayer.src = 'assets/audio/welcome.mp3';
        audioPlayer.play().then(() => {
            syncControlsState(true, 'Приветствие: Довольный Слон');
        }).catch(err => console.log("Автозвук заблокирован:", err));

        // Анимация печати
        const stamp = sealButton.querySelector('.seal-stamp');
        if (stamp) {
            stamp.style.transform = 'scale(0.85) rotate(-8deg)';
            stamp.style.opacity = '0.4';
        }

        // Переход на главный экран
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

    // --- 4. КАРТОЧКИ ВИТРИНЫ ---
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach(btn => {
        const toggleTrack = (e) => {
            if (e) e.preventDefault();

            const src = btn.getAttribute('data-track');
            const cardTitle = btn.parentElement.querySelector('h3').textContent;

            // Если нажата та же кнопка — ставим на паузу
            if (currentCardBtn === btn && !audioPlayer.paused) {
                audioPlayer.pause();
                btn.textContent = '▶ Воспроизвести';
                syncControlsState(false);
                currentCardBtn = null;
                return;
            }

            // Сбрасываем подсвеченную кнопку
            if (currentCardBtn) {
                currentCardBtn.textContent = '▶ Воспроизвести';
            }

            // Переключаем трек в едином плеере
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

    // Когда трек заканчивается
    audioPlayer.addEventListener('ended', () => {
        if (currentCardBtn) {
            currentCardBtn.textContent = '▶ Воспроизвести';
            currentCardBtn = null;
        }
        syncControlsState(false, 'Выберите трек для прослушивания');
    });
});