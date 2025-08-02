class GitHubRepositoryFinder {
    constructor() {
        this.currentLanguage = '';
        this.currentRepository = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showEmptyState();
    }

    bindEvents() {
        const languageSelect = document.getElementById('language-select');
        const retryBtn = document.getElementById('retry-btn');
        const refreshBtn = document.getElementById('refresh-btn');

        languageSelect.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            if (selectedLanguage) {
                this.currentLanguage = selectedLanguage;
                this.fetchRandomRepository(selectedLanguage);
            } else {
                this.showEmptyState();
            }
        });

        retryBtn.addEventListener('click', () => {
            if (this.currentLanguage) {
                this.fetchRandomRepository(this.currentLanguage);
            }
        });

        refreshBtn.addEventListener('click', () => {
            if (this.currentLanguage) {
                this.fetchRandomRepository(this.currentLanguage);
            }
        });
    }

    async fetchRandomRepository(language) {
        this.showLoadingState();

        try {
            // GitHub Search API endpoint
            const apiUrl = `https://api.github.com/search/repositories?q=language:${encodeURIComponent(language)}&sort=stars&order=desc&per_page=100`;
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-Repository-Finder'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                // Get a random repository from the top 100 results
                const randomIndex = Math.floor(Math.random() * Math.min(data.items.length, 100));
                const repository = data.items[randomIndex];
                
                this.currentRepository = repository;
                this.displayRepository(repository);
            } else {
                throw new Error('No repositories found for this language');
            }

        } catch (error) {
            console.error('Error fetching repository:', error);
            this.showErrorState();
        }
    }

    showEmptyState() {
        this.hideAllStates();
        document.getElementById('empty-state').style.display = 'block';
    }

    showLoadingState() {
        this.hideAllStates();
        document.getElementById('loading-state').style.display = 'block';
    }

    showErrorState() {
        this.hideAllStates();
        document.getElementById('error-state').style.display = 'block';
    }

    displayRepository(repository) {
        this.hideAllStates();
        
        const displayElement = document.getElementById('repository-display');
        displayElement.style.display = 'block';

        // Update repository information
        document.getElementById('repo-name').textContent = repository.name;
        document.getElementById('repo-description').textContent = repository.description || 'No description available';
        document.getElementById('repo-language').textContent = repository.language || 'Unknown';
        document.getElementById('repo-stars').textContent = this.formatNumber(repository.stargazers_count);
        document.getElementById('repo-forks').textContent = this.formatNumber(repository.forks_count);
        document.getElementById('repo-issues').textContent = this.formatNumber(repository.open_issues_count);

        // Update language icon color based on language
        this.updateLanguageIconColor(repository.language);
    }

    updateLanguageIconColor(language) {
        const languageIcon = document.querySelector('.stat i.fa-circle');
        if (!languageIcon) return;

        const languageColors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C#': '#178600',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'TypeScript': '#2b7489',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Scala': '#c22d40',
            'R': '#198ce7',
            'MATLAB': '#e16737',
            'Perl': '#0298c3',
            'Shell': '#89e051'
        };

        const color = languageColors[language] || '#f1e05a';
        languageIcon.style.color = color;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    hideAllStates() {
        const states = [
            'empty-state',
            'loading-state', 
            'error-state',
            'repository-display'
        ];

        states.forEach(stateId => {
            document.getElementById(stateId).style.display = 'none';
        });
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubRepositoryFinder();
}); 