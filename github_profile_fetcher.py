#!/usr/bin/env python3
"""
GitHub Profile Data Fetcher and PDF Generator
Fetches comprehensive GitHub profile data and creates a detailed PDF report.
"""

import requests
import json
import os
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import io

class GitHubProfileFetcher:
    def __init__(self, username, token=None):
        self.username = username
        self.token = token
        self.base_url = "https://api.github.com"
        self.headers = {
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'GitHub-Profile-Fetcher'
        }
        if token:
            self.headers['Authorization'] = f'token {token}'
    
    def fetch_user_profile(self):
        """Fetch user profile information"""
        url = f"{self.base_url}/users/{self.username}"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching profile: {response.status_code}")
            return None
    
    def fetch_repositories(self):
        """Fetch all repositories"""
        url = f"{self.base_url}/users/{self.username}/repos"
        repos = []
        page = 1
        per_page = 100
        
        while True:
            params = {'page': page, 'per_page': per_page, 'sort': 'updated'}
            response = requests.get(url, headers=self.headers, params=params)
            
            if response.status_code != 200:
                break
                
            data = response.json()
            if not data:
                break
                
            repos.extend(data)
            page += 1
            
        return repos
    
    def fetch_repository_details(self, repo_name):
        """Fetch detailed information for a specific repository"""
        details = {}
        
        # Get languages
        url = f"{self.base_url}/repos/{self.username}/{repo_name}/languages"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            details['languages'] = response.json()
        
        # Get contributors
        url = f"{self.base_url}/repos/{self.username}/{repo_name}/contributors"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            details['contributors'] = response.json()
        
        # Get commits (last 30)
        url = f"{self.base_url}/repos/{self.username}/{repo_name}/commits"
        params = {'per_page': 30}
        response = requests.get(url, headers=self.headers, params=params)
        if response.status_code == 200:
            details['recent_commits'] = response.json()
        
        # Get releases
        url = f"{self.base_url}/repos/{self.username}/{repo_name}/releases"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            details['releases'] = response.json()
        
        return details
    
    def fetch_activity(self):
        """Fetch recent activity and events"""
        url = f"{self.base_url}/users/{self.username}/events/public"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        return []
    
    def fetch_followers(self):
        """Fetch followers list"""
        url = f"{self.base_url}/users/{self.username}/followers"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        return []
    
    def fetch_following(self):
        """Fetch following list"""
        url = f"{self.base_url}/users/{self.username}/following"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        return []

class PDFGenerator:
    def __init__(self, filename):
        self.filename = filename
        self.doc = SimpleDocTemplate(filename, pagesize=A4)
        self.styles = getSampleStyleSheet()
        self.story = []
        
        # Custom styles
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            textColor=colors.darkblue
        )
        
        self.subheading_style = ParagraphStyle(
            'CustomSubHeading',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceAfter=8,
            textColor=colors.darkgreen
        )
    
    def add_title(self, text):
        """Add title to PDF"""
        self.story.append(Paragraph(text, self.title_style))
        self.story.append(Spacer(1, 20))
    
    def add_heading(self, text):
        """Add heading to PDF"""
        self.story.append(Paragraph(text, self.heading_style))
        self.story.append(Spacer(1, 12))
    
    def add_subheading(self, text):
        """Add subheading to PDF"""
        self.story.append(Paragraph(text, self.subheading_style))
        self.story.append(Spacer(1, 8))
    
    def add_paragraph(self, text):
        """Add paragraph to PDF"""
        self.story.append(Paragraph(text, self.styles['Normal']))
        self.story.append(Spacer(1, 6))
    
    def add_table(self, data, headers):
        """Add table to PDF"""
        table = Table([headers] + data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        self.story.append(table)
        self.story.append(Spacer(1, 12))
    
    def add_page_break(self):
        """Add page break"""
        self.story.append(PageBreak())
    
    def generate_pdf(self):
        """Generate the final PDF"""
        self.doc.build(self.story)

def format_date(date_string):
    """Format date string"""
    if date_string:
        try:
            dt = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
            return dt.strftime('%B %d, %Y')
        except:
            return date_string
    return 'N/A'

def format_number(num):
    """Format numbers with commas"""
    if num is None:
        return '0'
    return f"{num:,}"

def main():
    print("GitHub Profile Data Fetcher and PDF Generator")
    print("=" * 50)
    
    # Get GitHub username
    username = input("Enter your GitHub username: ").strip()
    if not username:
        print("Username is required!")
        return
    
    # Ask for token (optional)
    token = input("Enter your GitHub Personal Access Token (optional, for private repos): ").strip()
    if not token:
        token = None
        print("Note: Without a token, only public repositories will be accessible.")
    
    print(f"\nFetching data for GitHub user: {username}")
    print("This may take a few minutes...")
    
    # Initialize fetcher
    fetcher = GitHubProfileFetcher(username, token)
    
    # Fetch all data
    print("1. Fetching user profile...")
    profile = fetcher.fetch_user_profile()
    if not profile:
        print("Failed to fetch profile. Please check your username.")
        return
    
    print("2. Fetching repositories...")
    repos = fetcher.fetch_repositories()
    
    print("3. Fetching activity...")
    activity = fetcher.fetch_activity()
    
    print("4. Fetching followers...")
    followers = fetcher.fetch_followers()
    
    print("5. Fetching following...")
    following = fetcher.fetch_following()
    
    # Generate PDF
    print("6. Generating PDF...")
    pdf_filename = f"{username}_github_profile_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf_gen = PDFGenerator(pdf_filename)
    
    # Add title
    pdf_gen.add_title(f"GitHub Profile Report: {profile.get('name', username)}")
    pdf_gen.add_paragraph(f"Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}")
    pdf_gen.add_paragraph(f"GitHub Username: @{username}")
    
    # Profile Information
    pdf_gen.add_heading("Profile Information")
    
    profile_data = [
        ["Name", profile.get('name', 'N/A')],
        ["Bio", profile.get('bio', 'N/A')],
        ["Location", profile.get('location', 'N/A')],
        ["Company", profile.get('company', 'N/A')],
        ["Website", profile.get('blog', 'N/A')],
        ["Twitter", profile.get('twitter_username', 'N/A')],
        ["Public Repositories", format_number(profile.get('public_repos', 0))],
        ["Public Gists", format_number(profile.get('public_gists', 0))],
        ["Followers", format_number(profile.get('followers', 0))],
        ["Following", format_number(profile.get('following', 0))],
        ["Account Created", format_date(profile.get('created_at'))],
        ["Last Updated", format_date(profile.get('updated_at'))]
    ]
    
    pdf_gen.add_table(profile_data, ["Field", "Value"])
    
    # Statistics
    pdf_gen.add_heading("Statistics Summary")
    
    total_stars = sum(repo.get('stargazers_count', 0) for repo in repos)
    total_forks = sum(repo.get('forks_count', 0) for repo in repos)
    total_watchers = sum(repo.get('watchers_count', 0) for repo in repos)
    
    stats_data = [
        ["Total Repositories", format_number(len(repos))],
        ["Total Stars Received", format_number(total_stars)],
        ["Total Forks", format_number(total_forks)],
        ["Total Watchers", format_number(total_watchers)],
        ["Followers", format_number(len(followers))],
        ["Following", format_number(len(following))]
    ]
    
    pdf_gen.add_table(stats_data, ["Metric", "Count"])
    
    # Language Statistics
    pdf_gen.add_heading("Programming Languages")
    
    language_stats = {}
    for repo in repos:
        lang = repo.get('language')
        if lang:
            language_stats[lang] = language_stats.get(lang, 0) + 1
    
    if language_stats:
        lang_data = [[lang, str(count)] for lang, count in sorted(language_stats.items(), key=lambda x: x[1], reverse=True)]
        pdf_gen.add_table(lang_data, ["Language", "Repositories"])
    
    # Top Repositories
    pdf_gen.add_heading("Top Repositories (by Stars)")
    
    top_repos = sorted(repos, key=lambda x: x.get('stargazers_count', 0), reverse=True)[:10]
    
    for i, repo in enumerate(top_repos, 1):
        pdf_gen.add_subheading(f"{i}. {repo['name']}")
        
        repo_data = [
            ["Description", repo.get('description', 'No description')],
            ["Language", repo.get('language', 'N/A')],
            ["Stars", format_number(repo.get('stargazers_count', 0))],
            ["Forks", format_number(repo.get('forks_count', 0))],
            ["Watchers", format_number(repo.get('watchers_count', 0))],
            ["Size", f"{repo.get('size', 0):,} KB"],
            ["Created", format_date(repo.get('created_at'))],
            ["Updated", format_date(repo.get('updated_at'))],
            ["URL", repo.get('html_url', 'N/A')]
        ]
        
        pdf_gen.add_table(repo_data, ["Property", "Value"])
        pdf_gen.add_paragraph("")
    
    # All Repositories
    pdf_gen.add_page_break()
    pdf_gen.add_heading("All Repositories")
    
    repo_summary_data = []
    for repo in repos:
        repo_summary_data.append([
            repo['name'],
            repo.get('language', 'N/A'),
            format_number(repo.get('stargazers_count', 0)),
            format_number(repo.get('forks_count', 0)),
            format_date(repo.get('updated_at'))
        ])
    
    pdf_gen.add_table(repo_summary_data, ["Repository", "Language", "Stars", "Forks", "Last Updated"])
    
    # Recent Activity
    if activity:
        pdf_gen.add_page_break()
        pdf_gen.add_heading("Recent Activity")
        
        activity_data = []
        for event in activity[:20]:  # Last 20 events
            activity_data.append([
                event.get('type', 'N/A'),
                event.get('repo', {}).get('name', 'N/A'),
                format_date(event.get('created_at'))
            ])
        
        pdf_gen.add_table(activity_data, ["Event Type", "Repository", "Date"])
    
    # Followers
    if followers:
        pdf_gen.add_page_break()
        pdf_gen.add_heading("Followers")
        
        follower_data = []
        for follower in followers[:50]:  # First 50 followers
            follower_data.append([
                follower.get('login', 'N/A'),
                follower.get('name', 'N/A'),
                format_number(follower.get('followers', 0)),
                format_number(follower.get('public_repos', 0))
            ])
        
        pdf_gen.add_table(follower_data, ["Username", "Name", "Followers", "Public Repos"])
    
    # Generate PDF
    pdf_gen.generate_pdf()
    
    print(f"\n✅ PDF generated successfully: {pdf_filename}")
    print(f"📊 Summary:")
    print(f"   - Profile: {profile.get('name', username)}")
    print(f"   - Repositories: {len(repos)}")
    print(f"   - Total Stars: {total_stars:,}")
    print(f"   - Followers: {len(followers)}")
    print(f"   - Languages: {len(language_stats)}")

if __name__ == "__main__":
    main()
