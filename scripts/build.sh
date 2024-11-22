if ! command -v npx >/dev/null 2>&1; then
	echo "Warning: npx not found. Please install it"
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

rm -rf ./dist
mkdir ./dist

cd ./src

create_parent_dirs_in_dist() {
    local file="$1"
    local dir=$(dirname "$file")
    mkdir -p "../dist/$dir"
}


# 1. Copy all index.html files while maintaining structure
echo "Copying HTML files..."
find . -name "index.html" | while read -r file; do
	file_without_prefix="${file#./}"  # Remove leading ./ from the path
    create_parent_dirs_in_dist "$file_without_prefix"
    cp "$file" "../dist/$file_without_prefix"
    echo "Copied: $file"
done


# 2. Copy all style.css files while maintaining structure
echo "Copying CSS files..."
find . -name "style.css" | while read -r file; do
	file_without_prefix="${file#./}"  # Remove leading ./ from the path
    create_parent_dirs_in_dist "$file_without_prefix"
    cp "$file" "../dist/$file_without_prefix"
    echo "Copied: $file"
done

# 3. Minify and copy all index.js files
# Note: Requires npx to be installed
echo "Minifying JS files..."
find . -name "index.js" | while read -r file; do
    file_without_prefix="${file#./}"  # Remove leading ./ from the path
    create_parent_dirs_in_dist "$file_without_prefix"
    npx terser "$file"  -c -m -o "../dist/$file_without_prefix"
    echo "Minified: $file"
done

cd ..

echo "Build complete! Files are in dist/"
