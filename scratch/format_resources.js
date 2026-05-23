import fs from 'fs';
import path from 'path';

const filePath = '/home/dzack/gitclones/garza-academic-hub/src/content/blog/posts/undergrad-resources.md';
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // If this line is a resource title (starts with * followed by an emoji or icon indicator)
  if (line.trim().startsWith('* 📖') || line.trim().startsWith('* 📺') || line.trim().startsWith('* 🔗')) {
    newLines.push(line);
    
    // Check if the next line is a description starting with indentation and an asterisk
    if (i + 1 < lines.length && lines[i + 1].trim().startsWith('*')) {
      const nextLine = lines[i + 1];
      // Strip the asterisk and whitespace from the description line, and indent it as a paragraph
      const descriptionText = nextLine.replace(/^\s*\*\s*/, '');
      
      newLines.push('');
      newLines.push(`  ${descriptionText}`);
      newLines.push(''); // Blank line after the resource to make it a loose list
      i++; // Skip the next line since we handled it
    }
  } else {
    // Keep other lines as-is, but avoid duplicate blank lines
    if (line.trim() === '' && newLines.length > 0 && newLines[newLines.length - 1] === '') {
      continue;
    }
    newLines.push(line);
  }
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log("Successfully reformatted undergrad-resources.md to loose list format!");
