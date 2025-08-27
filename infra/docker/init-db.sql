-- 🗄️ sNDa Database Initialization Script
-- This script sets up the initial database configuration for local development

-- Create additional databases for testing
CREATE DATABASE snda_test;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE snda_dev TO snda_user;
GRANT ALL PRIVILEGES ON DATABASE snda_test TO snda_user;

-- Create extensions
\c snda_dev;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c snda_test;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Log initialization
\echo 'Database initialization completed successfully!'