#!/usr/bin/env node
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import open from 'open';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
async function findAvailablePort(startPort = 3000) {
    const net = await import('net');
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
        server.on('error', () => {
            resolve(findAvailablePort(startPort + 1));
        });
    });
}
async function waitForServer(port, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const response = await fetch(`http://localhost:${port}`);
            if (response.ok || response.status === 404) {
                return true;
            }
        }
        catch {
            // Server not ready yet
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
}
async function main() {
    // Parse arguments
    const args = process.argv.slice(2);
    const isDev = args.includes('--dev');
    const shouldOpen = args.includes('--open');
    const portIndex = args.findIndex(arg => arg === '--port' || arg === '-p');
    const specifiedPort = portIndex >= 0 && args[portIndex + 1] ? parseInt(args[portIndex + 1], 10) : null;
    // Get docs path from positional argument
    const docsPath = args.find(arg => !arg.startsWith('--') &&
        !arg.startsWith('-') &&
        (portIndex < 0 || arg !== args[portIndex + 1])) || './docs';
    const absoluteDocsPath = path.resolve(process.cwd(), docsPath);
    // Check if docs path exists
    if (!fs.existsSync(absoluteDocsPath)) {
        console.log(`📁 Docs path doesn't exist: ${absoluteDocsPath}`);
        console.log(`Creating directory...`);
        fs.mkdirSync(absoluteDocsPath, { recursive: true });
    }
    // Find available port or use specified port
    const port = specifiedPort || await findAvailablePort(4500);
    // Set environment variables
    process.env.SMART_DOCS_PATH = absoluteDocsPath;
    process.env.PORT = port.toString();
    console.log('🚀 Starting Smart Docs...');
    console.log(`📂 Docs: ${absoluteDocsPath}`);
    console.log(`🌐 Server: http://localhost:${port}`);
    console.log(`⚙️  Mode: ${isDev ? 'Development' : 'Production'}`);
    console.log('');
    // Start Next.js server (dev or production based on flag)
    const packageRoot = path.join(__dirname, '..');
    const nextCommand = isDev ? 'dev' : 'start';
    const server = spawn('npx', ['next', nextCommand, '-p', port.toString()], {
        env: process.env,
        stdio: 'inherit',
        cwd: packageRoot,
        shell: true,
    });
    // Wait for server to be ready
    console.log('⏳ Waiting for server to start...');
    const ready = await waitForServer(port);
    if (ready) {
        console.log('✅ Server ready!');
        if (shouldOpen) {
            console.log(`🌐 Opening http://localhost:${port} in your browser...`);
            await open(`http://localhost:${port}`);
        }
    }
    else {
        console.log('❌ Server failed to start after 30 seconds');
        process.exit(1);
    }
    // Handle exit
    process.on('SIGINT', () => {
        console.log('\n👋 Shutting down Smart Docs...');
        server.kill();
        process.exit(0);
    });
}
main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
