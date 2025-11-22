#!/bin/bash
# Start the Brewnode frontend development server

echo "🍺 Starting Brewnode Frontend Development Server..."
echo "📡 Backend API proxy: http://localhost:8080"
echo "🌐 Frontend URL: http://localhost:3000"
echo ""

# Check if backend is running
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "⚠️  Warning: Backend server doesn't appear to be running on port 8080"
    echo "   Make sure to start the Brewnode server first:"
    echo "   cd .. && npm start"
    echo ""
fi

# Start the frontend
npm run dev