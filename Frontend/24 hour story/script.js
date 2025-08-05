class StoriesApp {
    constructor() {
        this.stories = [];
        this.currentStoryIndex = 0;
        this.isViewing = false;
        this.progressInterval = null;
        
        this.init();
    }

    init() {
        this.loadStories();
        this.renderStories();
        this.setupEventListeners();
        this.cleanupExpiredStories();
    }

    // Storage Management
    loadStories() {
        try {
            const stored = localStorage.getItem('stories');
            if (stored) {
                this.stories = JSON.parse(stored);
                // Filter out expired stories
                this.stories = this.stories.filter(story => story.expiresAt > Date.now());
            }
        } catch (error) {
            console.error('Error loading stories:', error);
            this.stories = [];
        }
    }

    saveStories() {
        try {
            localStorage.setItem('stories', JSON.stringify(this.stories));
        } catch (error) {
            console.error('Error saving stories:', error);
        }
    }

    cleanupExpiredStories() {
        const now = Date.now();
        this.stories = this.stories.filter(story => story.expiresAt > now);
        this.saveStories();
        this.renderStories();
    }

    // Image Processing
    async processImage(file) {
        return new Promise((resolve, reject) => {
            // Validate file
            if (!file.type.startsWith('image/')) {
                reject(new Error('Please select a valid image file'));
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                reject(new Error('Image file size must be less than 10MB'));
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                const maxWidth = 1080;
                const maxHeight = 1920;

                let { width, height } = img;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    // Landscape image
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                } else {
                    // Portrait or square image
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw the resized image
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(base64);
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Story Management
    async addStory(imageData) {
        const story = {
            id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            imageData,
            createdAt: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        this.stories.push(story);
        this.saveStories();
        this.renderStories();
    }

    // Rendering
    renderStories() {
        const storiesList = document.getElementById('storiesList');
        
        // Clear existing stories
        storiesList.innerHTML = '';
        
        // Re-add the add story button
        const addStoryDiv = document.createElement('div');
        addStoryDiv.className = 'story-item add-story';
        addStoryDiv.innerHTML = `
            <label for="imageUpload" class="add-story-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </label>
            <input type="file" id="imageUpload" accept="image/*" style="display: none;">
        `;
        storiesList.appendChild(addStoryDiv);

        // Render stories
        this.stories.forEach((story, index) => {
            const storyElement = this.createStoryElement(story, index);
            storiesList.appendChild(storyElement);
        });
    }

    createStoryElement(story, index) {
        const storyDiv = document.createElement('div');
        storyDiv.className = 'story-item';
        storyDiv.dataset.index = index;

        const img = document.createElement('img');
        img.src = story.imageData;
        img.alt = 'Story';
        img.loading = 'lazy';

        storyDiv.appendChild(img);
        return storyDiv;
    }

    // Story Viewer
    openStoryViewer(startIndex = 0) {
        if (this.stories.length === 0) return;

        this.currentStoryIndex = startIndex;
        this.isViewing = true;

        const viewer = document.getElementById('storyViewer');
        viewer.classList.add('active');

        this.renderProgressBars();
        this.showCurrentStory();
        this.startProgressTimer();
        this.setupSwipeNavigation();
    }

    closeStoryViewer() {
        this.isViewing = false;
        this.stopProgressTimer();
        
        const viewer = document.getElementById('storyViewer');
        viewer.classList.remove('active');
        
        // Reset progress bars
        const progressContainer = document.getElementById('progressContainer');
        progressContainer.innerHTML = '';
    }

    renderProgressBars() {
        const progressContainer = document.getElementById('progressContainer');
        progressContainer.innerHTML = '';

        this.stories.forEach((_, index) => {
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            
            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);
        });
    }

    showCurrentStory() {
        const story = this.stories[this.currentStoryIndex];
        const storyImage = document.getElementById('storyImage');
        storyImage.src = story.imageData;

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentStoryIndex === 0;
        nextBtn.disabled = this.currentStoryIndex === this.stories.length - 1;

        // Reset and start progress for current story
        this.resetProgressBars();
        this.startProgressTimer();
    }

    resetProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            bar.classList.remove('active');
            if (index < this.currentStoryIndex) {
                bar.style.width = '100%';
            } else if (index === this.currentStoryIndex) {
                bar.style.width = '0%';
            } else {
                bar.style.width = '0%';
            }
        });
    }

    startProgressTimer() {
        this.stopProgressTimer();
        
        const currentProgressBar = document.querySelectorAll('.progress-fill')[this.currentStoryIndex];
        if (currentProgressBar) {
            currentProgressBar.classList.add('active');
        }

        this.progressInterval = setTimeout(() => {
            this.nextStory();
        }, 3000);
    }

    stopProgressTimer() {
        if (this.progressInterval) {
            clearTimeout(this.progressInterval);
            this.progressInterval = null;
        }
    }

    nextStory() {
        if (this.currentStoryIndex < this.stories.length - 1) {
            this.currentStoryIndex++;
            this.showCurrentStory();
        } else {
            this.closeStoryViewer();
        }
    }

    previousStory() {
        if (this.currentStoryIndex > 0) {
            this.currentStoryIndex--;
            this.showCurrentStory();
        }
    }

    // Swipe Navigation
    setupSwipeNavigation() {
        const viewer = document.getElementById('storyViewer');
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Check if it's a horizontal swipe (more horizontal than vertical)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next story
                    this.nextStory();
                } else {
                    // Swipe right - previous story
                    this.previousStory();
                }
            }
        };

        viewer.addEventListener('touchstart', handleTouchStart, { passive: true });
        viewer.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Store cleanup function
        this.cleanupSwipe = () => {
            viewer.removeEventListener('touchstart', handleTouchStart);
            viewer.removeEventListener('touchend', handleTouchEnd);
        };
    }

    // Event Listeners
    setupEventListeners() {
        // File upload - use event delegation since the input is recreated
        document.addEventListener('change', async (e) => {
            if (e.target.id === 'imageUpload') {
                const file = e.target.files[0];
                if (!file) return;

                try {
                    const imageData = await this.processImage(file);
                    await this.addStory(imageData);
                } catch (error) {
                    alert(error.message);
                }

                // Reset input
                e.target.value = '';
            }
        });

        // Story list clicks
        const storiesList = document.getElementById('storiesList');
        storiesList.addEventListener('click', (e) => {
            const storyItem = e.target.closest('.story-item');
            if (storyItem && !storyItem.classList.contains('add-story')) {
                const index = parseInt(storyItem.dataset.index);
                this.openStoryViewer(index);
            }
        });

        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const closeBtn = document.getElementById('closeBtn');

        prevBtn.addEventListener('click', () => {
            this.previousStory();
        });

        nextBtn.addEventListener('click', () => {
            this.nextStory();
        });

        closeBtn.addEventListener('click', () => {
            this.closeStoryViewer();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isViewing) return;

            switch (e.key) {
                case 'ArrowLeft':
                    this.previousStory();
                    break;
                case 'ArrowRight':
                    this.nextStory();
                    break;
                case 'Escape':
                    this.closeStoryViewer();
                    break;
            }
        });

        // Click outside to close
        const storyViewer = document.getElementById('storyViewer');
        storyViewer.addEventListener('click', (e) => {
            if (e.target === storyViewer) {
                this.closeStoryViewer();
            }
        });
    }

    // Cleanup
    cleanup() {
        this.stopProgressTimer();
        if (this.cleanupSwipe) {
            this.cleanupSwipe();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.storiesApp = new StoriesApp();
});

// Cleanup expired stories periodically
setInterval(() => {
    if (window.storiesApp) {
        window.storiesApp.cleanupExpiredStories();
    }
}, 60000); // Check every minute 