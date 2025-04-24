
// Theme handling
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.classList.toggle('dark', savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// Markdown handling
const editor = document.getElementById('markdown-editor');
const preview = document.getElementById('preview');

// Check for saved markdown content
const savedContent = localStorage.getItem('markdown-content') || '# Welcome to Markdown Editor\n\nStart typing your markdown here...';
editor.value = savedContent;

function updatePreview() {
    const markdown = editor.value;
    const html = marked.parse(markdown);
    preview.innerHTML = html;
    Prism.highlightAll();
    localStorage.setItem('markdown-content', markdown);
}

// Initialize preview
updatePreview();

// Update preview on input
editor.addEventListener('input', updatePreview);

// Handle tab key in editor
editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        updatePreview();
    }
});
