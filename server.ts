import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

const ENV_FILE = '/.env';

const DEFAULT_ENV = `BACKUP_CRON=0 2 * * *
TARGET_DIR=/backup
FILTER=
FILTER_DELIMITER=
DRY_RUN=false
LOG_LEVEL=info
DB_ENGINE=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=database
POSTGRES_DB=postgres
MIN_STORAGE_DURATION=
BUCKET_NAME=
DYNAMO_TABLE=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
NTFY_URL=
NTFY_TOPIC=
NTFY_USERNAME=
NTFY_PASSWORD=`;

app.get('/env', (req, res) => {
  console.log('GET /env request received');
  try {
    if (!fs.existsSync(ENV_FILE)) {
      console.log('Creating .env file with defaults');
      fs.writeFileSync(ENV_FILE, DEFAULT_ENV);
    }
    const content = fs.readFileSync(ENV_FILE, 'utf8');
    const env: Record<string, string> = {};
    content.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    console.log('Returning env config:', Object.keys(env));
    res.json(env);
  } catch (error) {
    console.error('Error reading .env file:', error);
    res.status(500).json({ error: 'Failed to read .env file' });
  }
});

app.post('/env', (req, res) => {
  console.log('POST /env request received');
  try {
    const envContent = Object.entries(req.body)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    fs.writeFileSync(ENV_FILE, envContent);
    console.log('Successfully wrote .env file');
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing .env file:', error);
    res.status(500).json({ error: 'Failed to write .env file' });
  }
});

app.get('/ls', (req, res) => {
  console.log(`GET /ls request received: ${req.query.path || '/' }`);
  if (!req.query.path) {
    return res.status(400).json({ error: 'Path parameter is required' });
  }
  try {
    let dir_list = fs.readdirSync(req.query.path as string, { withFileTypes: true })
    let directories = dir_list.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

    console.log(`Directory listing for ${req.query.path}:`, directories);
    res.set('Cache-Control', 'no-store');
    res.json({
      success: true,
      path: req.query.path,
      directories: directories,
    });
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({
      error: 'Failed to read directory',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(3000, () => {
  console.log('API server running on port 3000');
});