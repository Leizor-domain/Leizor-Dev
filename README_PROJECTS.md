# Project Showcase - leizor.dev

## Overview
This document describes the project showcase system implemented for leizor.dev, featuring a responsive project grid and detailed project pages.

## File Structure

### Main Files
- `work.html` - Main work showcase page with project card grid
- `projects/aml-engine.html` - Detailed AML Engine project page
- `data/projects.json` - JSON configuration for all projects
- `assets/projects/` - Directory for project images and assets

### Project Cards
Each project card on the work page includes:
- Project thumbnail (icon)
- Title and subtitle
- 1-2 sentence description
- Tech stack badges
- View Project button (links to detail page)
- GitHub button (external link)

### Project Detail Pages
Each project detail page includes:
- Hero section with project overview
- Project details and metrics
- Technology stack breakdown
- Key features with descriptions
- Screenshot placeholders
- Call-to-action sections

## Features Implemented

### ✅ Completed
1. **Responsive Project Grid** - 2-column grid that collapses to 1 on mobile
2. **Project Cards** - Hover effects, tech badges, and dev quotes
3. **AML Engine Detail Page** - Complete project showcase with all sections
4. **Navigation Updates** - All pages now link to work.html
5. **JSON Configuration** - Structured data for easy project management
6. **Developer Quotes** - Humorous hover quotes on project cards
7. **Fade-in Animations** - Scroll-triggered animations throughout
8. **Mobile Responsiveness** - Optimized for all screen sizes

### 🎨 Design Features
- Deep navy background (#0F172A) matching site theme
- Glass morphism effects with backdrop blur
- Subtle glow hover effects
- Professional typography with Inter font
- Consistent color scheme and spacing

### 🚀 Interactive Elements
- Hover lift effects on cards
- Smooth transitions and animations
- Parallax background elements
- Intersection Observer for scroll animations
- Responsive tech badges with hover states

## Adding New Projects

### 1. Update JSON Configuration
Add new project to `data/projects.json`:
```json
{
  "id": "project-name",
  "title": "Project Title",
  "subtitle": "Project Subtitle",
  "description": "Short description",
  "techStack": {
    "backend": ["Tech1", "Tech2"],
    "frontend": ["Tech3", "Tech4"]
  }
}
```

### 2. Add Project Card
Add new card to the grid in `work.html`:
```html
<div class="project-card rounded-3xl p-8 relative group">
  <!-- Project content -->
</div>
```

### 3. Create Detail Page
Create `projects/project-name.html` following the AML Engine template structure.

### 4. Add Project Images
Place project images in `assets/projects/` directory.

## Technical Implementation

### CSS Classes
- `.project-card` - Main project card styling
- `.tech-badge` - Technology stack badges
- `.dev-quote` - Hover developer quotes
- `.glass-effect` - Glass morphism background
- `.hover-lift` - Hover animation effects

### JavaScript Features
- Intersection Observer for scroll animations
- Parallax scrolling effects
- Smooth scroll navigation
- Enhanced hover interactions

### Responsive Design
- Mobile-first approach
- CSS Grid with responsive breakpoints
- Flexible card layouts
- Optimized touch interactions

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support
- ES6+ JavaScript features
- CSS custom properties and animations

## Performance Optimizations
- Lazy loading for images (placeholder ready)
- Efficient CSS animations
- Minimal JavaScript footprint
- Optimized asset delivery

## Future Enhancements
- Dynamic project loading from JSON
- Image lazy loading implementation
- Project filtering by category
- Search functionality
- Project comparison features
- Integration with CMS

## Usage Instructions

### For Developers
1. Clone the repository
2. Navigate to the project directory
3. Open `work.html` in a browser to view the showcase
4. Edit `data/projects.json` to modify project data
5. Update project cards in `work.html` as needed

### For Content Creators
1. Update project information in `data/projects.json`
2. Add project images to `assets/projects/`
3. Modify project descriptions and tech stacks
4. Update links and external references

## Support
For questions or issues with the project showcase system, refer to the main project documentation or contact the development team.

---

**Built with ❤️ for leizor.dev**
*The Iron Man suit of fraud detection and beyond*
