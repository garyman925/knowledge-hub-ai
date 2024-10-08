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

    // 根据当前页面执行特定的初始化
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'course-content':
            initCourseContent();
            break;
        // 其他页面的处理...
    }

    initNavbar();
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

    // 根据当前页面执行特定的初始化
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'course-content':
            initCourseContent();
            break;
        // 其他页面的处理...
    }

    initNavbar();
}

document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initPageSpecificFunctions();
});

function initSidebar() {
    const sidebarLinks = document.querySelectorAll('.nav-link[data-page]');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page === 'course-content') {
                loadCourseContent();
            } else {
                loadPage(page);
            }
        });
    });
}

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

function initPageSpecificFunctions() {
    initAudioPlayer();
    initImageModal();
    initTranscriptModal();

    // 根据当前页面执行特定的初始化
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'course-content':
            initCourseContent();
            break;
        // 其他页面的处理...
    }

    initNavbar();
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
        
        document.querySelectorAll('[data-toggle="modal"]').forEach(item => {
            item.addEventListener('click', event => {
                const imgSrc = event.target.getAttribute('src');
                modalImage.src = imgSrc;
                openModal('imageModal');
            });
        });
    }
}

function initTranscriptModal() {
    const showTranscriptButton = document.getElementById('showTranscript');
    const transcriptModal = document.getElementById('transcriptModal');
    const transcriptText = document.getElementById('transcriptText');

    if (showTranscriptButton && transcriptModal && transcriptText) {
        showTranscriptButton.addEventListener('click', function(e) {
            e.preventDefault();
            const transcript = `
                <h3 class="text-xl font-bold mb-2">Properties of Light and Related Concepts</h3>
                
                <p class="mb-2">Hello everyone, today we will learn about the properties of light and its related concepts.</p>

                <h4 class="text-lg font-semibold mb-1">1. Light Propagation</h4>
                <p class="mb-2">Light is a form of energy that travels in straight lines through air and other media. This characteristic is known as the straight-line propagation of light. We often use the ray model to describe the behavior of light, imagining light rays as narrow beams, pointing in the direction they travel.</p>

                <!-- ... 其余内容保持不变 ... -->

                <p class="mt-4">That concludes our revision for today. I hope everyone can better understand the properties of light and its related concepts. Thank you for listening!</p>
            `;
            
            transcriptText.innerHTML = transcript;
            openModal('transcriptModal');
        });
        console.log('Transcript button event listener added');
    } else {
        console.error('Transcript modal elements not found');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// 添加事件监听器来打开和关闭模态框
document.addEventListener('click', function(event) {
    if (event.target.hasAttribute('data-modal-target')) {
        const modalId = event.target.getAttribute('data-modal-target');
        openModal(modalId);
    }
    if (event.target.hasAttribute('data-modal-close')) {
        const modalId = event.target.closest('.modal').id;
        closeModal(modalId);
    }
});

// 初始加载首页
loadPage('home');

// 添加一个新函数来处理课程内容页面的特定功能
function initCourseContent() {
    console.log('初始化课程内容页面');
    // 这里可以添加课程内容页面的特定功能，比如展开/折叠内容、进度跟踪等
}

// 添加一个函数来获取当前页面
function getCurrentPage() {
    // 这里可以根据 URL 或其他方法来确定当前页面
    // 简单示例：
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'home';
}

// 添加一个函数来更新补充内容
function updateSupplementaryContent(page) {
    const supplementaryContent = document.getElementById('supplementaryContent');
    switch(page) {
        case 'home':
            supplementaryContent.innerHTML = ''; // 清空首页的右侧内容
            break;
        case 'courses':
            supplementaryContent.innerHTML = ''; // 清空课程列表页面的右侧内容
            break;
        case 'course-content':
            supplementaryContent.innerHTML = `
                <div class="bg-white shadow-md rounded-lg p-4 mb-4 relative">
                    <div class="absolute top-2 right-2">
                        <button class="text-gray-500 hover:text-gray-700 transition-colors duration-200" onclick="toggleAudioDropdown(event)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>
                        <div id="audioDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <div class="py-1">
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">下载音频</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">分享音频</a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="showTranscript(event)">查看文字稿</a>
                            </div>
                        </div>
                    </div>
                    <h2 class="text-xl font-semibold mb-4 text-custom-highlight">重點音频讲解</h2>
                    <audio controls class="w-full">
                        <source src="sound/podcast-demo.mp3" type="audio/mpeg">
                        您的浏览器不支持音频元素。
                    </audio>
                </div>
                <div class="bg-white shadow-md rounded-lg p-4 mb-4">
                    <h2 class="text-xl font-semibold mb-4 text-custom-highlight">相關的思维导图</h2>
                    <img src="chart/mindmap1-mylens.png" alt="思维导图预览" class="w-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                </div>
                <div class="bg-white shadow-md rounded-lg p-4 mb-4">
                    <h2 class="text-xl font-semibold mb-4 text-custom-highlight">学习工具</h2>
                    <ul class="list-disc list-inside text-custom-text">
                        <li>在线模拟实验</li>
                        <li>交互式图表</li>
                        <li>学习进度追踪器</li>
                    </ul>
                </div>
                <div class="bg-white shadow-md rounded-lg p-4">
                    <h2 class="text-xl font-semibold mb-4 text-custom-highlight">讨论区</h2>
                    <p class="text-custom-text">加入课程讨论，与其他学习者交流想法和问题。</p>
                    <a href="#" class="text-custom-highlight hover:underline">进入讨论区</a>
                </div>
            `;
            break;
        default:
            supplementaryContent.innerHTML = ''; // 清空其他页面的右侧内容
    }
}

function initNavbar() {
    const navLinks = document.querySelectorAll('nav a[data-content]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const content = this.getAttribute('data-content');
            loadContent(content);
            
            // 更新活动链接样式
            navLinks.forEach(l => l.classList.remove('border-indigo-500', 'text-gray-900'));
            navLinks.forEach(l => l.classList.add('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700'));
            this.classList.remove('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
            this.classList.add('border-indigo-500', 'text-gray-900');
        });
    });
}

function loadContent(content) {
    const mainContent = document.getElementById('mainContent');
    // 这里你可以根据 content 参数加载不同的内容
    // 例如，你可以使用 fetch 来加载不同的 HTML 文件，或者直接更新 innerHTML
    switch(content) {
        case 'overview':
            mainContent.innerHTML = '<h2 class="text-2xl font-bold mb-4">课程概览</h2><p>这里是课程的概览内容...</p>';
            break;
        case 'details':
            mainContent.innerHTML = '<h2 class="text-2xl font-bold mb-4">详细内容</h2><p>这里是课程的详细内容...</p>';
            break;
        case 'exercises':
            mainContent.innerHTML = '<h2 class="text-2xl font-bold mb-4">练习题</h2><p>这里是课程的练习题...</p>';
            break;
        case 'resources':
            mainContent.innerHTML = '<h2 class="text-2xl font-bold mb-4">相关资源</h2><p>这里是课程的相关资源...</p>';
            break;
        default:
            mainContent.innerHTML = '<h2 class="text-2xl font-bold mb-4">内容未找到</h2><p>请选择一个有效的导航项。</p>';
    }
}

// 替换原来的 showMoreAudio 函数
function toggleAudioDropdown(event) {
    event.stopPropagation(); // 阻止事件冒泡
    const dropdown = document.getElementById('audioDropdown');
    dropdown.classList.toggle('hidden');

    // 点击其他地方时关闭下拉菜单
    document.addEventListener('click', closeAudioDropdown);
}

function closeAudioDropdown(event) {
    const dropdown = document.getElementById('audioDropdown');
    if (!event.target.closest('.absolute')) {
        dropdown.classList.add('hidden');
        document.removeEventListener('click', closeAudioDropdown);
    }
}

function showTranscript(event) {
    event.preventDefault();
    const transcriptModal = document.getElementById('transcriptModal');
    const transcriptContent = document.getElementById('transcriptContent');
    
    transcriptContent.innerHTML = `
        <div class="space-y-4">
            <h2 class="text-2xl font-bold text-gray-800">Properties of Light and Related Concepts</h2>
            
            <p class="text-gray-600">Hello everyone, today we will learn about the properties of light and its related concepts.</p>

            <div class="ml-4">
                <h3 class="text-xl font-semibold text-gray-700 mb-2">1. Light Propagation</h3>
                <p class="text-gray-600">Light is a form of energy that travels in straight lines through air and other media. This characteristic is known as the straight-line propagation of light. We often use the ray model to describe the behavior of light, imagining light rays as narrow beams, pointing in the direction they travel.</p>
            </div>

            <div class="ml-4">
                <h3 class="text-xl font-semibold text-gray-700 mb-2">2. Types of Objects</h3>
                <ul class="list-disc list-inside text-gray-600">
                    <li>Luminous objects: Those that can emit their own light, such as the sun and light bulbs.</li>
                    <li>Non-luminous objects: Cannot emit light by themselves, like desks and mirrors; these objects need to rely on light from other sources to be seen.</li>
                </ul>
            </div>

            <div class="ml-4">
                <h3 class="text-xl font-semibold text-gray-700 mb-2">3. Shadows</h3>
                <p class="text-gray-600">When light is blocked by an object, a dark area forms behind the object, which we call a shadow. For example, when sunlight shines on a person, their body blocks some of the light, creating a shadow on the ground.</p>
            </div>

            <div class="ml-4">
                <h3 class="text-xl font-semibold text-gray-700 mb-2">4. Lenses</h3>
                <p class="text-gray-600">Lenses are objects that can change the path of light. For instance, a convex lens focuses parallel light rays to a single point, forming an image. The properties of these images depend on the distance of the object from the lens:</p>
                <ul class="list-disc list-inside text-gray-600 ml-4">
                    <li>When the object is close to the lens, the image formed is usually upright.</li>
                    <li>When the object is far from the lens, the image may be inverted.</li>
                </ul>
            </div>

            <div class="ml-4">
                <h3 class="text-xl font-semibold text-gray-700 mb-2">5. Experiment: Straight-line Propagation of Light</h3>
                <ol class="list-decimal list-inside text-gray-600 ml-4">
                    <li>Prepare a light source, such as a flashlight, and some opaque objects like books.</li>
                    <li>Place the light source at one end and block the light with the books.</li>
                    <li>Observe how light creates a shadow on the other side.</li>
                </ol>
                <p class="text-gray-600 mt-2">This experiment helps us understand the property of light traveling in straight lines.</p>
            </div>

            <p class="text-gray-600 mt-4">That concludes our revision for today. I hope everyone can better understand the properties of light and its related concepts. Thank you for listening!</p>
        </div>
    `;
    
    openModal('transcriptModal');
}

function closeTranscriptModal() {
    closeModal('transcriptModal');
}

document.addEventListener('DOMContentLoaded', function() {
    const courseList = document.getElementById('course-list');
    const contentDiv = document.getElementById('content');

    // 假设这是您的课程数据
    const courses = [
        { id: 1, title: '光的基本性質' },
        { id: 2, title: '影子的形成' },
        { id: 3, title: '光的反射' },
        // 添加更多课程...
    ];

    // 动态生成课程列表
    courses.forEach(course => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" class="text-custom-highlight hover:underline" data-course-id="${course.id}">${course.title}</a>`;
        courseList.appendChild(li);
    });

    // 添加课程点击事件监听器
    courseList.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const courseId = e.target.getAttribute('data-course-id');
            loadCourseContent(courseId);
        }
    });

    // 加载课程内容
    function loadCourseContent(courseId) {
        fetch('course-content.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const content = doc.querySelector('.space-y-4').innerHTML;
                contentDiv.innerHTML = `<h1 class="text-3xl font-bold mb-6">課程內容</h1>${content}`;
            })
            .catch(error => console.error('Error loading course content:', error));
    }
});

// 添加这个新函数来加载课程内容
function loadCourseContent() {
    const mainContent = document.getElementById('content');
    if (!mainContent) {
        console.error('Main content element not found');
        return;
    }
    
    fetch('course-content.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('.space-y-4').innerHTML;
            mainContent.innerHTML = `<h1 class="text-3xl font-bold mb-6">課程內容</h1>${content}`;
            updateSupplementaryContent('course-content');
            initPageSpecificFunctions();
        })
        .catch(error => {
            console.error('Error loading course content:', error);
            mainContent.innerHTML = `<h2 class="text-2xl font-bold mb-4">错误</h2>
                                     <p class="text-gray-600">无法加载课程内容。</p>`;
        });
}

// 修改 initSidebar 函数
function initSidebar() {
    const sidebarLinks = document.querySelectorAll('.nav-link[data-page]');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page === 'course-content') {
                loadCourseContent();
            } else {
                loadPage(page);
            }
        });
    });
}

// 其余函数保持不变
// ...

// 确保 updateSupplementaryContent 函数包含 'course-content' 的处理
function updateSupplementaryContent(page) {
    const supplementaryContent = document.getElementById('supplementaryContent');
    switch(page) {
        // ... 其他 case ...
        case 'course-content':
            supplementaryContent.innerHTML = `
                <div class="bg-white shadow-md rounded-lg p-4 mb-4 relative">
                    <!-- 音频播放器内容 -->
                </div>
                <div class="bg-white shadow-md rounded-lg p-4 mb-4">
                    <!-- 思维导图内容 -->
                </div>
                <!-- 其他补充内容 -->
            `;
            break;
        // ... 其他 case ...
    }
}

// 确保 initPageSpecificFunctions 函数包含 'course-content' 的处理
function initPageSpecificFunctions() {
    // ... 其他初始化 ...
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'course-content':
            initCourseContent();
            break;
        // ... 其他 case ...
    }
    // ... 其他初始化 ...
}

// 如果需要，添加 initCourseContent 函数
function initCourseContent() {
    console.log('初始化课程内容页面');
    // 这里可以添加课程内容页面的特定功能，比如展开/折叠内容、进度跟踪等
}

// 在文件的适当位置添加以下函数
function loadCourseContent() {
    fetch('course-content.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('course-content').innerHTML = data;
            document.getElementById('course-content-container').style.display = 'block';
        })
        .catch(error => console.error('加载课程内容时出错:', error));
}

// 修改现有的事件监听器或添加新的事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他现有代码 ...

    // 添加课程内容按钮的事件监听器
    document.getElementById('course-content-button').addEventListener('click', loadCourseContent);
});