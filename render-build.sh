#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend
npm install --production=false
npm run build
