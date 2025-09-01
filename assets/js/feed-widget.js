/**
 * External Content Recommender System
 * Tracks user behavior and displays personalized external content
 */

class ContentRecommender {
    constructor() {
        this.userTags = this.loadUserTags();
        this.feedContainer = null;
        this.isLoading = false;
        this.lastFetchTime = 0;
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
        
        this.init();
    }

    init() {
        this.setupBehaviorTracking();
        this.createFeedWidget();
        this.loadFeed();
        
        // Refresh feed every 10 minutes
        setInterval(() => this.loadFeed(), 10 * 60 * 1000);
    }

    // Load user tags from localStorage
    loadUserTags() {
        try {
            const tags = JSON.parse(localStorage.getItem('userTags') || '[]');
            return tags.length > 0 ? tags : ['technology'];
        } catch (error) {
            console.error('Error loading user tags:', error);
            return ['technology'];
        }
    }

    // Save user tags to localStorage
    saveUserTags() {
        try {
            localStorage.setItem('userTags', JSON.stringify(this.userTags));
        } catch (error) {
            console.error('Error saving user tags:', error);
        }
    }

    // Record user interest in a tag
    recordInterest(tag) {
        if (!tag || typeof tag !== 'string') return;
        
        // Clean and normalize tag
        const cleanTag = tag.toLowerCase().trim();
        if (cleanTag.length < 2) return;
        
        // Remove tag if it exists
        this.userTags = this.userTags.filter(t => t.toLowerCase() !== cleanTag);
        
        // Add tag to the beginning
        this.userTags.unshift(cleanTag);
        
        // Keep only last 5 tags
        this.userTags = this.userTags.slice(0, 5);
        
        this.saveUserTags();
        
        // Refresh feed with new interests
        setTimeout(() => this.loadFeed(), 1000);
    }

    // Setup behavior tracking
    setupBehaviorTracking() {
        // Track clicks on project cards
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard) {
                this.trackProjectInteraction(projectCard);
            }
        });

        // Track hover on tech tags
        document.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('tech-tag')) {
                const tag = e.target.textContent.trim();
                this.recordInterest(tag);
            }
        });

        // Track time spent on sections
        this.trackScrollBehavior();
        
        // Track form interactions
        this.trackFormInteractions();
    }

    // Track project interaction
    trackProjectInteraction(projectCard) {
        const title = projectCard.querySelector('h3')?.textContent || '';
        const techTags = Array.from(projectCard.querySelectorAll('.tech-tag'))
            .map(tag => tag.textContent.trim());
        
        // Record interest in project category and tech
        if (title) {
            const words = title.toLowerCase().split(' ');
            words.forEach(word => {
                if (word.length > 3) {
                    this.recordInterest(word);
                }
            });
        }
        
        techTags.forEach(tag => this.recordInterest(tag));
    }

    // Track scroll behavior
    trackScrollBehavior() {
        let scrollTimeout;
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
                const scrollDistance = Math.abs(scrollTop - lastScrollTop);
                
                if (scrollDistance > 100) {
                    // User is actively scrolling - record interest in current section
                    this.recordInterestFromCurrentSection();
                }
                
                lastScrollTop = scrollTop;
            }, 150);
        });
    }

    // Record interest from current visible section
    recordInterestFromCurrentSection() {
        const sections = document.querySelectorAll('section');
        const viewportHeight = window.innerHeight;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
                // Section is mostly visible
                const heading = section.querySelector('h1, h2, h3');
                if (heading) {
                    const text = heading.textContent.toLowerCase();
                    const words = text.split(' ').filter(word => word.length > 3);
                    words.forEach(word => this.recordInterest(word));
                }
            }
        });
    }

    // Track form interactions
    trackFormInteractions() {
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const placeholder = e.target.placeholder || '';
                if (placeholder.includes('project') || placeholder.includes('technology')) {
                    this.recordInterest('project');
                    this.recordInterest('technology');
                }
            }
        });
    }

    // Create the feed widget in the DOM
    createFeedWidget() {
        // Find or create the feed container
        let container = document.getElementById('externalFeed');
        if (!container) {
            container = document.createElement('div');
            container.id = 'externalFeed';
            container.className = 'external-feed-container';
            
            // Insert after the projects section or at the end of main content
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                projectsSection.insertAdjacentElement('afterend', this.createFeedSection());
            } else {
                // Fallback: add to body
                document.body.appendChild(this.createFeedSection());
            }
        }
        
        this.feedContainer = container;
    }

    // Create the complete feed section
    createFeedSection() {
        const section = document.createElement('section');
        section.className = 'py-24 relative';
        section.innerHTML = `
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div class="text-center mb-20">
                    <h2 class="text-5xl font-bold text-white mb-6">🧠 Content You May Like</h2>
                    <p class="text-xl text-neutral-400 max-w-3xl mx-auto">
                        Personalized recommendations based on your interests
                    </p>
                </div>
                
                <div id="externalFeed" class="external-feed-container">
                    <div class="feed-loading">
                        <div class="loading-spinner"></div>
                        <p class="text-neutral-400 mt-4">Fetching global insights for you...</p>
                    </div>
                </div>
            </div>
        `;
        
        return section;
    }

    // Load and display the external feed
    async loadFeed() {
        if (this.isLoading) return;
        
        // Check cache
        const now = Date.now();
        if (now - this.lastFetchTime < this.cacheDuration) {
            return;
        }
        
        this.isLoading = true;
        this.showLoadingState();
        
        try {
            const tags = this.userTags.join(',');
            const response = await fetch(`/api/external-feed?tags=${encodeURIComponent(tags)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.displayFeed(result.data);
                this.lastFetchTime = now;
            } else {
                throw new Error(result.error || 'Failed to fetch feed');
            }
            
        } catch (error) {
            console.error('Error loading external feed:', error);
            this.showErrorState(error.message);
        } finally {
            this.isLoading = false;
        }
    }

    // Display the feed content
    displayFeed(items) {
        if (!this.feedContainer) return;
        
        if (!items || items.length === 0) {
            this.feedContainer.innerHTML = `
                <div class="text-center py-16">
                    <p class="text-xl text-neutral-400">No content found for your interests.</p>
                    <p class="text-neutral-500 mt-2">Try interacting with more content to get personalized recommendations.</p>
                </div>
            `;
            return;
        }
        
        const feedHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${items.map((item, index) => this.createFeedCard(item, index)).join('')}
            </div>
        `;
        
        this.feedContainer.innerHTML = feedHTML;
        
        // Add fade-in animation
        setTimeout(() => {
            const cards = this.feedContainer.querySelectorAll('.feed-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('animate-fade-in');
            });
        }, 100);
    }

    // Create individual feed card
    createFeedCard(item, index) {
        const sourceIcon = this.getSourceIcon(item.source);
        const timeAgo = this.getTimeAgo(item.publishedAt);
        
        return `
            <div class="feed-card group p-6 glass-effect rounded-2xl hover-lift border border-white/5 animate-fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-2">
                        ${sourceIcon}
                        <span class="text-xs font-medium text-neutral-400 uppercase tracking-wide">${item.source}</span>
                    </div>
                    ${timeAgo ? `<span class="text-xs text-neutral-500">${timeAgo}</span>` : ''}
                </div>
                
                <h3 class="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="hover:underline">
                        ${item.title}
                    </a>
                </h3>
                
                ${item.description ? `
                    <p class="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3">
                        ${item.description}
                    </p>
                ` : ''}
                
                <div class="flex items-center justify-between">
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer" 
                       class="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                        Read More
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </a>
                    
                    ${this.getSourceSpecificInfo(item)}
                </div>
            </div>
        `;
    }

    // Get source icon
    getSourceIcon(source) {
        const icons = {
            'NewsAPI': `<svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>`,
            'Dev.to': `<svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.06 2.06.06 1.11.17.85.92.44c.37.06.44.13.44.27 0 .11-.04.61-.13 1.49l-.13 1.36h1.7l.06-1.39.13-1.49c.09-.88.13-1.38.13-1.49 0-.18-.09-.28-.28-.28h-.6c-.42 0-.63.05-.63.15 0 .05.04.09.1.12l.42.19.42.14.42.1.42.05.42.02.42-.02.42-.05.42-.1.42-.14.42-.19c.06-.03.1-.07.1-.12 0 .1.21.15.63.15h.6c.19 0 .28-.1.28-.28 0-.11-.04-.61-.13-1.49l-.13-1.36h-1.7l.13 1.36c.09.88.13 1.38.13 1.49z"/>
            </svg>`,
            'Product Hunt': `<svg class="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>`,
            'Currents': `<svg class="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>`,
            'Reddit': `<svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
            </svg>`,
            'GitHub': `<svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>`,
            'Hacker News': `<svg class="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>`,
            'Stack Overflow': `<svg class="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.725 0l-1.72 1.277 6.39 8.588L22 8.588zM2 9.064l13.654 15.434L22.436 24l-8.782-9.064zM0 9.064l8.782 9.064L22.436 24 13.654 15.434z"/>
            </svg>`,
            'TechCrunch': `<svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>`
        };
        
        return icons[source] || icons['NewsAPI'];
    }

    // Get time ago string
    getTimeAgo(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString();
        } catch (error) {
            return '';
        }
    }

    // Get source-specific information
    getSourceSpecificInfo(item) {
        if (item.votesCount) {
            return `<span class="text-xs text-neutral-500">${item.votesCount} votes</span>`;
        }
        if (item.score) {
            return `<span class="text-xs text-neutral-500">${item.score} points</span>`;
        }
        if (item.stars) {
            return `<span class="text-xs text-neutral-500">⭐ ${item.stars}</span>`;
        }
        if (item.comments) {
            return `<span class="text-xs text-neutral-500">💬 ${item.comments}</span>`;
        }
        if (item.answers) {
            return `<span class="text-xs text-neutral-500">✅ ${item.answers} answers</span>`;
        }
        if (item.language) {
            return `<span class="text-xs text-neutral-500">🔤 ${item.language}</span>`;
        }
        return '';
    }

    // Show loading state
    showLoadingState() {
        if (!this.feedContainer) return;
        
        this.feedContainer.innerHTML = `
            <div class="feed-loading text-center py-16">
                <div class="loading-spinner mx-auto"></div>
                <p class="text-neutral-400 mt-4">Fetching global insights for you...</p>
            </div>
        `;
    }

    // Show error state
    showErrorState(message) {
        if (!this.feedContainer) return;
        
        this.feedContainer.innerHTML = `
            <div class="text-center py-16">
                <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
                <p class="text-xl text-red-400 mb-2">Failed to load recommendations</p>
                <p class="text-neutral-400 mb-4">${message}</p>
                <button onclick="window.contentRecommender.loadFeed()" 
                        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.contentRecommender = new ContentRecommender();
});

// Export for global access
window.ContentRecommender = ContentRecommender;
