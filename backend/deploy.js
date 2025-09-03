// Simple script to copy TypeScript files to JS files if build fails
const fs = require('fs');
const path = require('path');

// Function to create directory if it doesn't exist
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

// Function to process TypeScript files
function processDirectory(sourceDir, targetDir) {
    // Ensure target directory exists
    ensureDirectoryExists(targetDir);
    
    // Read all files in the source directory
    const files = fs.readdirSync(sourceDir);
    
    // Process each file
    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file.replace('.ts', '.js'));
        
        if (fs.statSync(sourcePath).isDirectory()) {
            // Recursively process subdirectories
            processDirectory(sourcePath, path.join(targetDir, file));
        } else if (file.endsWith('.ts')) {
            // Convert TypeScript to JavaScript (very basic conversion)
            let content = fs.readFileSync(sourcePath, 'utf8');
            
            // Remove type annotations
            content = content.replace(/: [A-Za-z<>[\]|{}]+/g, '');
            content = content.replace(/<[A-Za-z,\s]+>/g, '');
            content = content.replace(/interface [^{]+{[^}]+}/g, '');
            content = content.replace(/type [^=]+=\s*[^;]+;/g, '');
            
            // Write to JavaScript file
            fs.writeFileSync(targetPath, content);
            console.log(`Converted ${sourcePath} to ${targetPath}`);
        } else if (!file.endsWith('.ts') && !file.endsWith('.map')) {
            // Copy non-TypeScript files
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Copied ${sourcePath} to ${targetPath}`);
        }
    });
}

// Start processing
console.log('Starting emergency JS compilation...');
processDirectory(path.join(__dirname, 'src'), path.join(__dirname, 'dist'));
console.log('Emergency compilation completed!');
