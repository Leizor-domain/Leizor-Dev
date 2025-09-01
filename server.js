const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'fc4f16149d42456286200b2e00187ab2';
const CURRENTS_KEY = process.env.CURRENTS_KEY || 'wgweIZsSmZs0IKRv1zK6p7jgLvmYx4u1BQC_8q2_aofi4ofr';
const PH_TOKEN = process.env.PH_TOKEN; // Temporarily inactive
const DEV_TO_API_KEY = process.env.DEV_TO_API_KEY;

// Helper function to fetch content from NewsAPI
async function fetchNewsAPI(tags) {
    try {
        if (!NEWS_API_KEY) return [];
        
        const query = tags.join(' OR ');
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: query,
                sortBy: 'popularity',
                pageSize: 3,
                language: 'en',
                apiKey: NEWS_API_KEY
            },
            timeout: 5000
        });
        
        return response.data.articles.map(article => ({
            title: article.title,
            url: article.url,
            source: 'NewsAPI',
            description: article.description,
            publishedAt: article.publishedAt
        }));
    } catch (error) {
        console.error('NewsAPI error:', error.message);
        return [];
    }
}

// Helper function to fetch content from Dev.to
async function fetchDevTo(tags) {
    try {
        const tag = tags[0] || 'technology'; // Use first tag or default
        const response = await axios.get(`https://dev.to/api/articles`, {
            params: {
                tag: tag,
                top: 3
            },
            timeout: 5000
        });
        
        return response.data.map(article => ({
            title: article.title,
            url: `https://dev.to${article.path}`,
            source: 'Dev.to',
            description: article.description,
            publishedAt: article.published_at
        }));
    } catch (error) {
        console.error('Dev.to error:', error.message);
        return [];
    }
}

// Helper function to fetch content from Product Hunt
async function fetchProductHunt(tags) {
    try {
        if (!PH_TOKEN) return [];
        
        const query = `
            query {
                posts(first: 3, order: VOTES) {
                    edges {
                        node {
                            name
                            tagline
                            url
                            votesCount
                        }
                    }
                }
            }
        `;
        
        const response = await axios.post('https://api.producthunt.com/v2/api/graphql', {
            query: query
        }, {
            headers: {
                'Authorization': `Bearer ${PH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        
        return response.data.data.posts.edges.map(edge => ({
            title: edge.node.name,
            url: edge.node.url,
            source: 'Product Hunt',
            description: edge.node.tagline,
            votesCount: edge.node.votesCount
        }));
    } catch (error) {
        console.error('Product Hunt error:', error.message);
        return [];
    }
}

// Helper function to fetch content from Currents API
async function fetchCurrents(tags) {
    try {
        if (!CURRENTS_KEY) return [];
        
        const query = tags.join(' ');
        const response = await axios.get(`https://api.currentsapi.services/v1/search`, {
            params: {
                keywords: query,
                language: 'en',
                limit: 3,
                apiKey: CURRENTS_KEY
            },
            timeout: 5000
        });
        
        return response.data.news.map(article => ({
            title: article.title,
            url: article.url,
            source: 'Currents',
            description: article.description,
            publishedAt: article.published
        }));
    } catch (error) {
        console.error('Currents API error:', error.message);
        return [];
    }
}

// Helper function to fetch content from Reddit
async function fetchReddit(tags) {
    try {
        const tag = tags[0] || 'technology';
        const response = await axios.get(`https://www.reddit.com/r/${tag}/hot.json`, {
            params: {
                limit: 3
            },
            timeout: 5000
        });
        
        return response.data.data.children.map(post => ({
            title: post.data.title,
            url: `https://reddit.com${post.data.permalink}`,
            source: 'Reddit',
            description: post.data.selftext?.substring(0, 100) || '',
            score: post.data.score
        }));
    } catch (error) {
        console.error('Reddit error:', error.message);
        return [];
    }
}

// Helper function to fetch content from GitHub Trending
async function fetchGitHubTrending(tags) {
    try {
        const tag = tags[0] || 'javascript';
        const response = await axios.get(`https://api.github.com/search/repositories`, {
            params: {
                q: `${tag} created:>2024-01-01`,
                sort: 'stars',
                order: 'desc',
                per_page: 3
            },
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'leizor-dev-content-recommender'
            },
            timeout: 5000
        });
        
        return response.data.items.map(repo => ({
            title: repo.name,
            url: repo.html_url,
            source: 'GitHub',
            description: repo.description || `Trending ${tag} repository`,
            stars: repo.stargazers_count,
            language: repo.language
        }));
    } catch (error) {
        console.error('GitHub error:', error.message);
        return [];
    }
}

// Helper function to fetch content from Hacker News
async function fetchHackerNews(tags) {
    try {
        const response = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json', {
            timeout: 5000
        });
        
        const topStories = response.data.slice(0, 5);
        const storyPromises = topStories.map(id => 
            axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 3000 })
        );
        
        const stories = await Promise.allSettled(storyPromises);
        const validStories = stories
            .filter(story => story.status === 'fulfilled' && story.value.data)
            .map(story => story.value.data)
            .slice(0, 3);
        
        return validStories.map(story => ({
            title: story.title,
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            source: 'Hacker News',
            description: `Score: ${story.score} | ${story.descendants || 0} comments`,
            score: story.score,
            comments: story.descendants || 0
        }));
    } catch (error) {
        console.error('Hacker News error:', error.message);
        return [];
    }
}

// Helper function to fetch content from Stack Overflow
async function fetchStackOverflow(tags) {
    try {
        const tag = tags[0] || 'javascript';
        const response = await axios.get(`https://api.stackexchange.com/2.3/questions`, {
            params: {
                tagged: tag,
                site: 'stackoverflow',
                sort: 'votes',
                order: 'desc',
                pagesize: 3,
                filter: 'withbody'
            },
            timeout: 5000
        });
        
        return response.data.items.map(question => ({
            title: question.title,
            url: question.link,
            source: 'Stack Overflow',
            description: question.body?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
            score: question.score,
            answers: question.answer_count
        }));
    } catch (error) {
        console.error('Stack Overflow error:', error.message);
        return [];
    }
}

// Helper function to fetch content from TechCrunch RSS
async function fetchTechCrunchRSS(tags) {
    try {
        const response = await axios.get('https://techcrunch.com/feed/', {
            timeout: 5000
        });
        
        // Simple XML parsing for RSS
        const xmlText = response.data;
        const items = [];
        
        // Extract titles and links from RSS
        const titleMatches = xmlText.match(/<title>(.*?)<\/title>/g);
        const linkMatches = xmlText.match(/<link>(.*?)<\/link>/g);
        
        if (titleMatches && linkMatches) {
            for (let i = 1; i < Math.min(4, titleMatches.length); i++) { // Skip first title (feed title)
                const title = titleMatches[i].replace(/<title>|<\/title>/g, '');
                const link = linkMatches[i]?.replace(/<link>|<\/link>/g, '') || '#';
                
                if (title && link !== '#') {
                    items.push({
                        title: title,
                        url: link,
                        source: 'TechCrunch',
                        description: 'Latest technology news and startup updates',
                        publishedAt: new Date().toISOString()
                    });
                }
            }
        }
        
        return items.slice(0, 3);
    } catch (error) {
        console.error('TechCrunch RSS error:', error.message);
        return [];
    }
}

// Main API endpoint
app.get('/api/external-feed', async (req, res) => {
    try {
        const tags = req.query.tags ? req.query.tags.split(',') : ['technology'];
        
        // Fetch content from all sources in parallel
        const [newsAPI, devTo, productHunt, currents, reddit, github, hackerNews, stackOverflow, techCrunch] = await Promise.allSettled([
            fetchNewsAPI(tags),
            fetchDevTo(tags),
            fetchProductHunt(tags),
            fetchCurrents(tags),
            fetchReddit(tags),
            fetchGitHubTrending(tags),
            fetchHackerNews(tags),
            fetchStackOverflow(tags),
            fetchTechCrunchRSS(tags)
        ]);
        
        // Combine all results
        let allContent = [];
        
        if (newsAPI.status === 'fulfilled') allContent.push(...newsAPI.value);
        if (devTo.status === 'fulfilled') allContent.push(...devTo.value);
        if (productHunt.status === 'fulfilled') allContent.push(...productHunt.value);
        if (currents.status === 'fulfilled') allContent.push(...currents.value);
        if (reddit.status === 'fulfilled') allContent.push(...reddit.value);
        if (github.status === 'fulfilled') allContent.push(...github.value);
        if (hackerNews.status === 'fulfilled') allContent.push(...hackerNews.value);
        if (stackOverflow.status === 'fulfilled') allContent.push(...stackOverflow.value);
        if (techCrunch.status === 'fulfilled') allContent.push(...techCrunch.value);
        
        // Shuffle and limit results
        const shuffled = allContent.sort(() => 0.5 - Math.random());
        const limited = shuffled.slice(0, 12); // Show max 12 items
        
        res.json({
            success: true,
            data: limited,
            sources: {
                newsAPI: newsAPI.status === 'fulfilled' ? newsAPI.value.length : 0,
                devTo: devTo.status === 'fulfilled' ? devTo.value.length : 0,
                productHunt: productHunt.status === 'fulfilled' ? productHunt.value.length : 0,
                currents: currents.status === 'fulfilled' ? currents.value.length : 0,
                reddit: reddit.status === 'fulfilled' ? reddit.value.length : 0,
                github: github.status === 'fulfilled' ? github.value.length : 0,
                hackerNews: hackerNews.status === 'fulfilled' ? hackerNews.value.length : 0,
                stackOverflow: stackOverflow.status === 'fulfilled' ? stackOverflow.value.length : 0,
                techCrunch: techCrunch.status === 'fulfilled' ? techCrunch.value.length : 0
            }
        });
        
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch external content',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        sources: {
            newsAPI: !!NEWS_API_KEY,
            currents: !!CURRENTS_KEY,
            productHunt: !!PH_TOKEN,
            devTo: true,
            reddit: true,
            github: true,
            hackerNews: true,
            stackOverflow: true,
            techCrunch: true
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 External Content Recommender Server running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/external-feed`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
