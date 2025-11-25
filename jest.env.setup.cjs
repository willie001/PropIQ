const dotenv = require('dotenv');

// Load .env.local so tests see the same env vars as Next.js dev
dotenv.config({ path: '.env.local' });
