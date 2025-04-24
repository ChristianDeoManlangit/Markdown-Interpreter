
// Initialize marked with GitHub-like settings
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    langPrefix: 'language-'
});

// DOM Elements
const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('preview');
const lineNumbers = document.getElementById('lineNumbers');
const resizer = document.getElementById('resizer');
const themeToggle = document.getElementById('themeToggle');
const fileInput = document.getElementById('fileInput');
const newFileBtn = document.getElementById('newFile');
const loadFileBtn = document.getElementById('loadFile');
const saveMarkdownBtn = document.getElementById('saveMarkdown');
const saveZipBtn = document.getElementById('saveZip');
const decreaseFontBtn = document.getElementById('decreaseFontSize');
const increaseFontBtn = document.getElementById('increaseFontSize');
const currentFontSize = document.getElementById('currentFontSize');

// State
let isDragging = false;
let currentFontSizeValue = 14;
const defaultMarkdown = `# Welcome to Markdown Editor

## Getting Started

This is a simple **Markdown** editor with live preview. You can:

- Write Markdown syntax
- See instant preview
- Save your work
- Download in different formats

### Code Example

\`\`\`javascript
function helloWorld() {
  console.log("Hello, Markdown!");
}
\`\`\`
`;

// Initialize editor
function initializeEditor() {
    // Load saved content or use default
    const savedContent = localStorage.getItem('markdown-content') || defaultMarkdown;
    editor.value = savedContent;
    updatePreview();
    updateLineNumbers();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    // Load saved font size
    const savedFontSize = localStorage.getItem('font-size') || '14';
    setFontSize(parseInt(savedFontSize, 10));
}

// Update preview
function updatePreview() {
    const markdown = editor.value;
    const html = marked.parse(markdown);
    preview.innerHTML = html;
    Prism.highlightAll();
    localStorage.setItem('markdown-content', markdown);
}

// Update line numbers
function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join('');
}

// Resizer functionality
function initializeResizer() {
    const container = document.getElementById('editor-container');
    
    resizer.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.body.style.cursor = 'col-resize';
        resizer.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const containerRect = container.getBoundingClientRect();
        const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        const clampedPercentage = Math.max(20, Math.min(80, percentage));
        
        editor.parentElement.style.width = `${clampedPercentage}%`;
        preview.parentElement.style.width = `${100 - clampedPercentage}%`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = '';
        resizer.classList.remove('dragging');
    });
}

// Font size controls
function setFontSize(size) {
    currentFontSizeValue = size;
    document.documentElement.style.setProperty('--font-size', `${size}px`);
    currentFontSize.textContent = `${size}px`;
    localStorage.setItem('font-size', size.toString());
}

// File operations
function createNewFile() {
    if (confirm('Are you sure? This will clear your current content.')) {
        editor.value = defaultMarkdown;
        updatePreview();
        updateLineNumbers();
    }
}

function loadFile() {
    fileInput.click();
}

function saveMarkdown() {
    const blob = new Blob([editor.value], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, 'document.md');
}

async function saveZip() {
    const zip = new JSZip();
    
    // Add markdown file
    zip.file('document.md', editor.value);
    
    // Add HTML preview with styles
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Markdown Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            line-height: 1.5;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        ${Array.from(document.styleSheets)
            .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
            .map(sheet => Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n'))
            .join('\n')}
    </style>
</head>
<body class="markdown-preview">
    ${preview.innerHTML}
</body>
</html>`;
    
    zip.file('preview.html', htmlContent);
    
    // Generate and download zip
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'markdown-package.zip');
}

// Event Listeners
editor.addEventListener('input', () => {
    updatePreview();
    updateLineNumbers();
});

editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
});

editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        updatePreview();
        updateLineNumbers();
    }
});

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            editor.value = e.target.result;
            updatePreview();
            updateLineNumbers();
        };
        reader.readAsText(file);
    }
});

decreaseFontBtn.addEventListener('click', () => {
    if (currentFontSizeValue > 8) {
        setFontSize(currentFontSizeValue - 2);
    }
});

increaseFontBtn.addEventListener('click', () => {
    if (currentFontSizeValue < 32) {
        setFontSize(currentFontSizeValue + 2);
    }
});

newFileBtn.addEventListener('click', createNewFile);
loadFileBtn.addEventListener('click', loadFile);
saveMarkdownBtn.addEventListener('click', saveMarkdown);
saveZipBtn.addEventListener('click', saveZip);

// Initialize
initializeEditor();
initializeResizer();
