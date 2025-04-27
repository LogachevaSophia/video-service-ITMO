#!/bin/sh

set -e

# Run migrations
npm run migrate

# Then start the app
npm start
