document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const sealButton = document.getElementById('seal-button');
    const mainHub = document.getElementById('main-hub');
    const audioPlayer = document.getElementById('audio-player');

    let isEnvelopeOpened = false;

    // --- 1. ЛОГИКА ВСКРЫТИЯ КОНВЕРТА С АДАПТАЦИЕЙ ПОД МОБИЛЬНЫЕ ---
    const openEnvelope = () => {
        if (isEnvelopeOpened) return;
        isEnvelopeOpened = true;

        // Воспроизводим звук моментально при касании пальцем
        audioPlayer.src = 'assets/audio/welcome.mp3';
        
        // Запуск аудио
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Мобильный браузер ограничил автозвук, продолжаем без звука:", error);
            });
        }

        // Анимация визуального клика по печати
        sealButton.style.transform = 'scale(0.85) rotate(-8deg)';
        sealButton.style.opacity = '0.4';

        // Плавный переход к главному экрану
        setTimeout(() => {
            welcomeScreen.style.opacity = '0';
            
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                mainHub.classList.remove('hidden');
                mainHub.style.opacity = '1';
            }, 600);

        }, 1200);
    };

    // Поддерживаем и обычный клик, и быстрое касание на смартфоне (touchstart)
    sealButton.addEventListener('click', openEnvelope);
    sealButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Предотвращаем задержку двойного тапа на смартфонах
        openEnvelope();
    }, { passive: false });


    // --- 2. ЛОГИКА АУДИО-ПЛЕЕРА В ВИТРИНЕ ---
    const playButtons = document.querySelectorAll('.play-btn');
    let currentPlayingBtn = null;

    playButtons.forEach(button => {
        const handleTrackPlay = (e) => {
            if (e.type === 'touchstart') e.preventDefault();

            const trackSrc = button.getAttribute('data-track');

            // Пауза, если нажат тот же трек
            if (currentPlayingBtn === button && !audioPlayer.paused) {
                audioPlayer.pause();
                button.textContent = '▶ Воспроизвести';
                currentPlayingBtn = null;
                return;
            }

            // Сброс предыдущей кнопки
            if (currentPlayingBtn) {
                currentPlayingBtn.textContent = '▶ Воспроизвести';
            }

            // Включение нового трека
            audioPlayer.src = trackSrc;
            audioPlayer.play().then(() => {
                button.textContent = '⏸ Пауза';
                currentPlayingBtn = button;
            }).catch(err => {
                console.error("Ошибка воспроизведения трека:", err);
            });
        };

        button.addEventListener('click', handleTrackPlay);
        button.addEventListener('touchstart', handleTrackPlay, { passive: false });
    });

    // Возврат текста кнопки по окончании трека
    audioPlayer.addEventListener('ended', () => {
        if (currentPlayingBtn) {
            currentPlayingBtn.textContent = '▶ Воспроизвести';
            currentPlayingBtn = null;
        }
    });
});