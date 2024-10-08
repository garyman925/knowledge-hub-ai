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

function loadPage(page) {
    const mainContent = document.getElementById('mainContent');
    const supplementaryContent = document.getElementById('supplementaryContent');
    if (!mainContent || !supplementaryContent) {
        console.error('Content elements not found');
        return;
    }
    
    fetch(`${page}.html`)
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html;
            updateSupplementaryContent(page);
            initPageSpecificFunctions();
        })
        .catch(error => {
            console.error('Error loading page:', error);
            mainContent.innerHTML = `<h2 class="text-2xl font-bold mb-4">错误</h2>
                                     <p class="text-gray-600">无法加载 ${page} 页面。</p>`;
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
    // 初始化成績單模態框
    initTranscriptModal();

    // 初始化音頻播放器
    initAudioPlayer();

    // 初始化圖片模態框
    initImageModal();

    // 其他初始化代碼...
});

function initTranscriptModal() {
    const transcriptModal = document.getElementById('transcriptModal');
    const transcriptContent = document.getElementById('transcriptContent');
    
    if (!transcriptModal || !transcriptContent) {
        console.warn('Transcript modal elements not found');
        return;
    }

    // 這裡放置成績單模態框的相關代碼
}

function initAudioPlayer() {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const seekSlider = document.getElementById('seek-slider');
    
    if (!audioPlayer || !playPauseButton || !seekSlider) {
        console.warn('Audio player elements not found');
        return;
    }

    // 這裡放置音頻播放器的相關代碼
}

function initImageModal() {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (!imageModal || !modalImage) {
        console.warn('Image modal elements not found');
        return;
    }

    // 這裡放置圖片模態框的相關代碼
}

// 其他函數...