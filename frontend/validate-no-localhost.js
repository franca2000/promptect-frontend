// validate-no-localhost.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function searchInFile(filePath, keyword) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.includes(keyword);
}

function scanDirectory(dir, keyword, results = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath, keyword, results);
        } else {
            if (searchInFile(fullPath, keyword)) {
                results.push(fullPath);
            }
        }
    }

    return results;
}

// Config
const buildDir = path.join(__dirname, 'dist');
const keyword = 'localhost';

console.log(`🔍 Buscando "${keyword}" dentro de "${buildDir}"...\n`);

const matches = scanDirectory(buildDir, keyword);

if (matches.length > 0) {
    console.error(`❌ Se encontraron referencias a "${keyword}" en:\n`);
    matches.forEach(file => console.error(`- ${file}`));
    process.exit(1);
} else {
    console.log(`✅ No se encontraron referencias a "${keyword}". Build verificada.\n`);
}
