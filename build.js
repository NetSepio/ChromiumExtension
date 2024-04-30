import * as fs from 'fs';

function extractScriptContent(html) {
	const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/i;
	const match = scriptRegex.exec(html);
	return match ? match[1] : null;
}

function updateIndexHtml(htmlFilePath, scriptContent) {
	const appJsFilePath = 'build/app.js';

	// Write the extracted script content to app.js
	fs.writeFileSync(appJsFilePath, scriptContent);

	// Read the original index.html file
	let indexHtml = fs.readFileSync(htmlFilePath, 'utf-8');

	// Replace the script tag with a new one linking to app.js
	const newScriptTag = `<script src="./app.js"></script>`;
	indexHtml = indexHtml.replace(/<script.*?>[\s\S]*?<\/script>/i, newScriptTag);

	// Write the updated index.html back to file
	fs.writeFileSync(htmlFilePath, indexHtml);
}

function main() {
	const htmlFilePath = 'build/index.html';

	console.log('Formating inline scripts');

	// Read the index.html file
	const indexHtml = fs.readFileSync(htmlFilePath, 'utf-8');

	// Extract script content from index.html
	const scriptContent = extractScriptContent(indexHtml);
	if (!scriptContent) {
		console.error('No script content found in index.html');
		return;
	}

	// Update index.html with the new script tag
	updateIndexHtml(htmlFilePath, scriptContent);

	console.log('Build complete.');
}

main();
