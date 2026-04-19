/**
 * One-shot image optimizer.
 * Converts large screenshots / photos to WebP, saving ~50-70% file size.
 * Usage: npx --yes sharp@latest && node optimize-images.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targets = [
    'photo.jpg',
    'Amanda.jpg',
    'Phillip.jpg',
    'Kevin.jpg',
    'workspaceco-icon.png',
    'og-card.png',
    'screenshots/eod-cutoff-full.png',
    'screenshots/eod-cutoff-workflow.png',
    'screenshots/eod-dashboard.png',
    'screenshots/eod-morning-workflow.png',
    'screenshots/replyiq-dashboard.png',
    'screenshots/replyiq-email-queue.png',
    'screenshots/replyiq-knowledge-base.png',
    'screenshots/replyiq-settings.png',
    'screenshots/whatsapp-analyzer-hub.png',
];

(async () => {
    let savedTotal = 0;
    for (const file of targets) {
        if (!fs.existsSync(file)) { console.log('SKIP missing', file); continue; }
        const ext = path.extname(file);
        const out = file.replace(ext, '.webp');
        const before = fs.statSync(file).size;
        try {
            await sharp(file)
                .webp({ quality: 82, effort: 6 })
                .toFile(out);
            const after = fs.statSync(out).size;
            const saved = before - after;
            savedTotal += saved;
            console.log(`${file}\t${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (-${((saved/before)*100).toFixed(0)}%)`);
        } catch (e) {
            console.log('FAIL', file, e.message);
        }
    }
    console.log(`\nTotal saved: ${(savedTotal/1024).toFixed(0)}KB`);
})();
