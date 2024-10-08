const lessons = [
    "第1课: HTML基础",
    "第2课: CSS样式",
    "第3课: JavaScript入门",
    "第4课: Bootstrap框架",
    "第5课: 响应式设计"
];

const mainContent = document.getElementById('mainContent');
const menuLinks = document.querySelectorAll('#menu a');
let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];

function loadPage(pageName) {
    fetch(`${pageName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html;
            if (pageName === 'home') {
                renderLessons();
                updateProgress();
            }
            initPageSpecificFunctions(); // 在頁面加載後初始化特定功能
        })
        .catch(error => {
            console.error('Error loading page:', error);
            mainContent.innerHTML = '<h1 class="text-center">页面加载错误</h1><p class="text-center">抱歉，无法加载请求的页面。</p>';
        });
}

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageName = e.currentTarget.getAttribute('data-page');
        loadPage(pageName);
    });
});

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = (completedLessons.length / lessons.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }
}

function toggleLesson(index) {
    const lessonIndex = completedLessons.indexOf(index);
    if (lessonIndex === -1) {
        completedLessons.push(index);
    } else {
        completedLessons.splice(lessonIndex, 1);
    }
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    renderLessons();
    updateProgress();
}

function renderLessons() {
    const lessonList = document.getElementById('lessonList');
    if (lessonList) {
        lessonList.innerHTML = '';
        lessons.forEach((lesson, index) => {
            const listItem = document.createElement('a');
            listItem.href = '#';
            listItem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center');
            if (completedLessons.includes(index)) {
                listItem.classList.add('completed');
            }
            listItem.innerHTML = `
                ${lesson}
                <span class="badge bg-primary rounded-pill">${completedLessons.includes(index) ? '已完成' : '未完成'}</span>
            `;
            listItem.addEventListener('click', (e) => {
                e.preventDefault();
                toggleLesson(index);
            });
            lessonList.appendChild(listItem);
        });
    }
}

// 初始加载首页
loadPage('home');

document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const seekSlider = document.getElementById('seek-slider');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    playPauseButton.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
        } else {
            audio.pause();
            playPauseButton.innerHTML = '<i class="bi bi-play-fill"></i>';
        }
    });

    audio.addEventListener('loadedmetadata', function() {
        seekSlider.max = Math.floor(audio.duration);
        durationSpan.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', function() {
        seekSlider.value = Math.floor(audio.currentTime);
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    });

    seekSlider.addEventListener('input', function() {
        currentTimeSpan.textContent = formatTime(this.value);
    });

    seekSlider.addEventListener('change', function() {
        audio.currentTime = this.value;
    });
});

// 在文件末尾添加以下代碼

function initPageSpecificFunctions() {
    initAudioPlayer();
    initImageModal();
    initImageSlider();
    initTranscriptModal(); // 確保這行存在
}

function initAudioPlayer() {
    const audio = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const seekSlider = document.getElementById('seek-slider');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');

    if (!audio || !playPauseButton || !seekSlider || !currentTimeSpan || !durationSpan) {
        console.log('Audio player elements not found');
        return;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    playPauseButton.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
        } else {
            audio.pause();
            playPauseButton.innerHTML = '<i class="bi bi-play-fill"></i>';
        }
    });

    audio.addEventListener('loadedmetadata', function() {
        seekSlider.max = Math.floor(audio.duration);
        durationSpan.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', function() {
        seekSlider.value = Math.floor(audio.currentTime);
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    });

    seekSlider.addEventListener('input', function() {
        currentTimeSpan.textContent = formatTime(this.value);
    });

    seekSlider.addEventListener('change', function() {
        audio.currentTime = this.value;
    });

    console.log('Audio player initialized');
}

function initImageModal() {
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        const modalImage = document.getElementById('modalImage');
        
        document.querySelectorAll('[data-bs-toggle="modal"]').forEach(item => {
            item.addEventListener('click', event => {
                const imgSrc = event.target.getAttribute('src');
                modalImage.src = imgSrc;
            });
        });

        imageModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const imgSrc = button.getAttribute('src');
            modalImage.src = imgSrc;
        });
    }
}

function initImageSlider() {
    const imageSlider = document.getElementById('imageSlider');
    if (imageSlider && typeof bootstrap !== 'undefined') {
        new bootstrap.Carousel(imageSlider, {
            interval: 5000,
            wrap: true
        });
    }
}

// 初始加載首頁
loadPage('home');

document.addEventListener('DOMContentLoaded', function() {
    initTranscriptModal();
});

function initTranscriptModal() {
    const showTranscriptButton = document.getElementById('showTranscript');
    const transcriptModal = new bootstrap.Modal(document.getElementById('transcriptModal'));
    const transcriptText = document.getElementById('transcriptText');

    if (showTranscriptButton) {
        showTranscriptButton.addEventListener('click', function(e) {
            e.preventDefault();
            const transcript = `
                <h3>Properties of Light and Related Concepts</h3>
 
                <p>Hello everyone, today we will learn about the properties of light and its related concepts.</p>

                <h4>1. Light Propagation</h4>
                <p>Light is a form of energy that travels in straight lines through air and other media. This characteristic is known as the straight-line propagation of light. We often use the ray model to describe the behavior of light, imagining light rays as narrow beams, pointing in the direction they travel.</p>

                <h4>2. Types of Objects</h4>
                <p>We categorize objects into two types:</p>
                <ul>
                    <li><strong>Luminous objects:</strong> Those that can emit their own light, such as the sun and light bulbs.</li>
                    <li><strong>Non-luminous objects:</strong> Cannot emit light by themselves, like desks and mirrors; these objects need to rely on light from other sources to be seen.</li>
                </ul>

                <h4>3. Shadows</h4>
                <p>In our daily lives, we often observe shadows. How are shadows formed? When light is blocked by an object, a dark area forms behind the object, which we call a shadow. For example, when sunlight shines on a person, their body blocks some of the light, creating a shadow on the ground.</p>

                <h4>4. Lenses</h4>
                <p>Lenses are objects that can change the path of light. For instance, a convex lens focuses parallel light rays to a single point, forming an image. The properties of these images depend on the distance of the object from the lens:</p>
                <ul>
                    <li>When the object is close to the lens, the image formed is usually upright.</li>
                    <li>When the object is far from the lens, the image may be inverted.</li>
                </ul>

                <h4>5. Experiment: Straight-line Propagation of Light</h4>
                <p>Let's conduct a small experiment to test the straight-line propagation of light:</p>
                <ol>
                    <li>Prepare a light source, such as a flashlight, and some opaque objects like books.</li>
                    <li>Place the light source at one end and block the light with the books.</li>
                    <li>Observe how light creates a shadow on the other side.</li>
                </ol>
                <p>This experiment helps us understand the property of light traveling in straight lines.</p>

                <p>That concludes our revision for today. I hope everyone can better understand the properties of light and its related concepts. Thank you for listening!</p>
            `;
            
            transcriptText.innerHTML = transcript;
            transcriptModal.show();
        });
        console.log('Transcript button event listener added');
    } else {
        console.error('showTranscript button not found');
    }
}

function initPageSpecificFunctions() {
    initAudioPlayer();
    initImageModal();
    initImageSlider();
    initTranscriptModal(); // 確保這行存在
}