# GitHub Profile Data Fetcher & PDF Generator

This tool fetches comprehensive data from your GitHub profile and generates a detailed PDF report containing all your repositories, statistics, and activity.

## Features

- **Complete Profile Information**: Name, bio, location, company, website, social links
- **Repository Details**: All repositories with descriptions, languages, stars, forks, watchers
- **Statistics**: Total stars, forks, watchers, followers, following
- **Language Analysis**: Programming languages used across all repositories
- **Top Repositories**: Ranked by stars with detailed information
- **Recent Activity**: Latest GitHub events and activities
- **Followers/Following**: Lists of followers and people you follow
- **Professional PDF**: Well-formatted, comprehensive report

## Requirements

- Python 3.6 or higher
- Internet connection
- GitHub account (public repositories accessible without token)

## Installation

1. **Install Python** (if not already installed):
   - Download from [python.org](https://python.org)
   - Make sure to check "Add Python to PATH" during installation

2. **Install required packages**:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Method 1: Run the batch file (Windows)
```bash
run_github_fetcher.bat
```

### Method 2: Run directly with Python
```bash
python github_profile_fetcher.py
```

### Method 3: Interactive usage
1. Run the script
2. Enter your GitHub username when prompted
3. Optionally enter your GitHub Personal Access Token (for private repositories)
4. Wait for the script to fetch all data
5. PDF will be generated automatically

## GitHub Personal Access Token (Optional)

To access private repositories and get more detailed information:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with these scopes:
   - `repo` (for private repositories)
   - `read:user` (for user information)
   - `read:org` (for organization information)
3. Copy the token and paste it when prompted

## Output

The script generates a PDF file with the naming convention:
```
{username}_github_profile_{timestamp}.pdf
```

Example: `leizor_github_profile_20241201_143022.pdf`

## PDF Contents

1. **Profile Information**: Complete profile details
2. **Statistics Summary**: Key metrics and numbers
3. **Programming Languages**: Language usage across repositories
4. **Top Repositories**: Most starred repositories with details
5. **All Repositories**: Complete list with summary information
6. **Recent Activity**: Latest GitHub events
7. **Followers**: List of followers (first 50)
8. **Following**: List of people you follow

## Troubleshooting

### Common Issues

1. **"Username not found"**: Check your GitHub username spelling
2. **"Rate limit exceeded"**: Wait a few minutes and try again
3. **"Permission denied"**: Use a Personal Access Token for private repositories
4. **"Module not found"**: Run `pip install -r requirements.txt`

### Rate Limits

GitHub API has rate limits:
- **Unauthenticated**: 60 requests per hour
- **Authenticated**: 5,000 requests per hour

For large profiles with many repositories, consider using a Personal Access Token.

## Customization

You can modify the script to:
- Add more repository details
- Include commit history
- Add issue and pull request statistics
- Customize PDF formatting
- Add charts and graphs

## Security Note

- Never share your Personal Access Token
- The token is only used for API requests and not stored
- All data is fetched from public GitHub APIs

## Support

If you encounter any issues:
1. Check your internet connection
2. Verify your GitHub username
3. Ensure all required packages are installed
4. Check GitHub API status

## Example Output

The generated PDF includes:
- Professional formatting with tables and sections
- Comprehensive statistics and metrics
- Detailed repository information
- Activity timeline
- Social connections (followers/following)

Perfect for:
- Portfolio documentation
- Resume/CV supplements
- Project showcases
- Professional profiles
- GitHub analytics
