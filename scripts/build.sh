#!/bin/bash

if ! command -v npm >/dev/null 2>&1; then
    echo "Warning: npm not found. Please install it"
    exit 1
fi

# Check script location
SCRIPT_PATH="$0"
if [[ "$SCRIPT_PATH" == scripts/* || "$SCRIPT_PATH" == ./scripts/* ]]; then
    echo "Running build script from root level"
else
    echo "Error: This script must be run from the root level of the project"
    echo "Current path: $SCRIPT_PATH"
    exit 1
fi

# Parse command line arguments
MODE="prod"
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --mode) MODE="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

rm -rf ./dist
mkdir ./dist

if [ "$MODE" == "dev" ]; then
    echo "Running development build..."

    # Copy directories
    cp -r ./tmp/components ./dist/
    cp -r ./tmp/static ./dist/
    cp -r ./tmp/styles ./dist/
    cp -r ./tmp/js ./dist/

    # Copy pages content to dist, maintaining directory structure
    cp -r ./tmp/pages/* ./dist/

else
    echo "Running production build..."
    cd ./tmp

    # Function to create parent directories in dist
    create_parent_dirs_in_dist() {
        local file="$1"
        local dir=$(dirname "$file")
        mkdir -p "../dist/$dir"
    }

    # 1. Copy components and static directory
    cp -r ./components ../dist/
    cp -r ./static ../dist/
    cp -r ./styles ../dist/

    # 2. Copy and process HTML files from pages
    echo "Processing HTML files..."
    find ./pages -name "index.html" | while read -r file; do
        # Remove both ./ and pages/ from the path
        file_without_pages="${file#./pages/}"
        create_parent_dirs_in_dist "$file_without_pages"
        cp "$file" "../dist/$file_without_pages"
        echo "Copied: $file"
    done

    # 3. Process each CSS file
    echo "Processing CSS files..."
    find ./pages -name "style.css" | while read -r file; do
        # Remove both ./ and pages/ from the path
        file_without_pages="${file#./pages/}"
        create_parent_dirs_in_dist "$file_without_pages"
        npx rollup "$file" --config ../rollup.config.css.js \
            --output.file "../dist/${file_without_pages}"
        echo "Processed: $file"
    done

    # 4. Process each JS file
    echo "Processing JS files..."
    find ./pages -name "index.js" | while read -r file; do
        # Remove both ./ and pages/ from the path
        file_without_pages="${file#./pages/}"
        create_parent_dirs_in_dist "$file_without_pages"
        npx rollup "$file" --config ../rollup.config.js.js \
            --output.file "../dist/${file_without_pages}"
        echo "Processed: $file"
    done

    cd ..
fi

rm -rf ./tmp

echo "Build complete! Files are in dist/"