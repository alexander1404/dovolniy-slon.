document.addEventListener('DOMContentLoaded', () => {
    // Элементы Welcome-экрана и звука
    const welcomeScreen = document.getElementById('welcome-screen');
    const sealButton = document.getElementById('seal-button');
    const mainHub = document.getElementById('main-hub');
    const audioPlayer = document.getElementById('audio-player');

    let isEnvelopeOpened = false;

    // --- 1. ЛОГИКА ВСКРЫТИЯ КОНВЕРТА ---
    sealButton.addEventListener('click', () => {
        if (isEnvelopeOpened) return;
        isEnvelopeOpened = true;

        // Запускаем звук пред-вечеринки и глухой кульминационный бум
        audioPlayer.src = 'assets/audio/welcome.mp3';
        audioPlayer.play().catch(error => {
            console.log("Автовоспроизведение заблокировано браузером:", error);
        });

        // Анимация визуального клика по печати
        sealButton.style.transform = 'scale(0.9) rotate(-5deg)';
        sealButton.style.opacity = '0.5';

        // Через 1.5 секунды плавно скрываем Welcome-экран и показываем главный HUB
        setTimeout(() => {
            welcomeScreen.style.opacity = '0';
            
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                mainHub.classList.remove('hidden');
                mainHub.style.opacity = '1';
            }, 800);

        }, 1500);
    });

    // --- 2. ЛОГИКА АУДИО-ПЛЕЕРА В ВИТРИНЕ ---
    const playButtons = document.querySelectorAll('.play-btn');
    let currentPlayingBtn = null;

    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const trackSrc = button.getAttribute('data-track');

            // Если нажат тот же трек, который сейчас играет — ставим на паузу
            if (currentPlayingBtn === button && !audioPlayer.paused) {
                audioPlayer.pause();
                button.textContent = '▶ Воспроизвести';
                currentPlayingBtn = null;
                return;
            }

            // Сбрасываем текст у предыдущей кнопки
            if (currentPlayingBtn) {
                currentPlayingBtn.textContent = '▶ Воспроизвести';
            }

            // Включаем новый трек
            audioPlayer.src = trackSrc;
            audioPlayer.play().then(() => {
                button.textContent = '⏸ Пауза';
                currentPlayingBtn = button;
            }).catch(err => {
                console.error("Ошибка воспроизведения трека:", err);
            });
        });
    });

    // Когда трек заканчивается — возвращаем кнопке исходный текст
    audioPlayer.addEventListener('ended', () => {
        if (currentPlayingBtn) {
            currentPlayingBtn.textContent = '▶ Воспроизвести';
            currentPlayingBtn = null;
        }
    });
});