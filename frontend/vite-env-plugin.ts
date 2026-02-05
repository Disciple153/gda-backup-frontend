import type { Plugin } from 'vite';
import fs from 'fs';

const DEFAULT_ENV = `BACKUP_CRON=0 2 * * *
TARGET_DIR=/backup
POSTGRES_PASSWORD=password
POSTGRES_HOST=database
POSTGRES_DB=postgres
POSTGRES_USER=postgres
BUCKET_NAME=
DYNAMO_TABLE=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
LOG_LEVEL=info
DRY_RUN=false`;

export function envEditorPlugin(): Plugin {
  return {
    name: 'env-editor',
    configureServer(server) {
      server.middlewares.use('/api/env', (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const envPath = '../.env';
            if (!fs.existsSync(envPath)) {
              fs.writeFileSync(envPath, DEFAULT_ENV);
            }
            const content = fs.readFileSync(envPath, 'utf8');
            const env: Record<string, string> = {};
            content.split('\n').forEach(line => {
              const [key, ...valueParts] = line.split('=');
              if (key && valueParts.length) {
                env[key.trim()] = valueParts.join('=').trim();
              }
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(env));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to read .env file' }));
          }
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const config = JSON.parse(body);
              const envContent = Object.entries(config)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
              fs.writeFileSync('../.env', envContent);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (error) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to write .env file' }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}