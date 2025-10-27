#!/bin/bash
# update-demo.sh
# Script to update the demo project with latest bundles from source

set -e  # Exit on error

echo "🔄 Updating demo with latest bundles..."

# Check if we're in the right directory
if [ ! -d "plugins/situ-design" ]; then
  echo "❌ Error: plugins/situ-design not found. Are you in the Situ-Design root directory?"
  exit 1
fi

# Build utilities bundle
echo "📦 Building utilities bundle..."
npm run build:utils

# Build extension inspector bundle
echo "📦 Building extension inspector bundle..."
cd situ-design-extension
npm run build:inspector

# Check if demo directory exists
if [ ! -d "../Situ-Design-Demo" ]; then
  echo "⚠️  Demo directory not found. Creating it..."
  cd ..
  cp -r Situ-Design Situ-Design-Demo
  cd Situ-Design-Demo
  rm -rf plugins/situ-design
  rm -f utils-bundle-entry.js webpack.utils.config.js
  cd ..
  cd Situ-Design
fi

# Copy bundles to demo
echo "📋 Copying bundles to demo..."
cp public/situ-demo-utils.bundle.js ../Situ-Design-Demo/public/
cp situ-design-extension/dist/inspector/situImport.bundle.js ../Situ-Design-Demo/public/inspector/
cp -r situ-design-extension/dist/inspector/assets ../Situ-Design-Demo/public/inspector/

echo "✅ Bundles updated successfully!"
echo ""
echo "Next steps:"
echo "  1. cd ../Situ-Design-Demo"
echo "  2. npm run build"
echo "  3. npm run deploy"
echo ""
echo "Or to test locally:"
echo "  2. npm run dev"

