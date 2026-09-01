import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const androidAssetsDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'assets', 'www');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const androidAssetsWwwDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'assets', 'www');
const androidAssetsRootDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'assets');

console.log('🔄 Syncing web dist assets into Android assets...');
if (!fs.existsSync(distDir)) {
  console.error('❌ dist folder does not exist. Run npm run build first.');
  process.exit(1);
}

if (!fs.existsSync(androidAssetsWwwDir)) {
  fs.mkdirSync(androidAssetsWwwDir, { recursive: true });
}

copyRecursiveSync(distDir, androidAssetsWwwDir);
copyRecursiveSync(distDir, androidAssetsRootDir);
console.log('✅ Android web assets successfully synced to assets and assets/www!');
