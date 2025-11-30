# Build frontend
cd frontend
npm install
npm run build
cd ..

# Build backend
cd backend
npm install
npm run build
cd ..

echo "Build complete. To run in production:"
echo "1. Set NODE_ENV=production in backend/.env"
echo "2. Run: cd backend && npm start"
