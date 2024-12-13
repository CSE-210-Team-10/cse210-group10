import os
import shutil
import re
import sys
import argparse
from pathlib import Path


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Build script for processing template files."
    )
    parser.add_argument(
        "--mode",
        choices=["dev", "prod"],
        default="prod",
        help="Build mode: 'dev' for development, 'prod' for production",
    )
    return parser.parse_args()


def check_script_location():
    """Check if script is being run from the correct location."""
    script_path = os.path.abspath(sys.argv[0])
    script_rel_path = os.path.relpath(script_path, os.getcwd())

    if script_rel_path.startswith("scripts") or script_rel_path.startswith(
        "./scripts/"
    ):
        print("Running build script from root level")
        return True
    else:
        print("Error: This script must be run from the root level of the project")
        print(f"Current path: {script_rel_path}")
        return False


def copy_src_to_tmp(src_dir: str, tmp_dir: str) -> None:
    """Copy all contents from src to tmp directory."""
    if os.path.exists(tmp_dir):
        shutil.rmtree(tmp_dir)

    shutil.copytree(src_dir, tmp_dir)
    print(f"Copied src to tmp: {src_dir} → {tmp_dir}")


def fix_relative_imports(file_path: str, mode: str) -> None:
    """Fix relative imports in CSS and JS files for dev mode."""
    if mode != "dev":
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Only proceed if file is in pages directory
    if "/pages/" not in file_path:
        return

    def replace_import(match):
        """Replace import paths with the correct relative path."""
        full_import = match.group(0)  # Full import statement
        path = match.group(1)  # The path part

        # Count number of parent directory references
        parent_count = path.count("../")
        if parent_count == 0:
            return full_import

        # Get the path after all ../
        path_parts = path.split("/")
        actual_path = "/".join(path_parts[parent_count:])

        # Construct new path
        if parent_count == 1:
            new_path = f"./{actual_path}"
        else:
            new_path = f'./{("../" * (parent_count - 1))}{actual_path}'

        # Reconstruct import statement based on file type
        if file_path.endswith(".css"):
            return f'@import "{new_path}"'
        else:  # .js file
            return f'from "{new_path}"'

    # Match CSS imports: @import '../path/to/file.css' or @import "../path/to/file.css"
    if file_path.endswith(".css"):
        pattern = r'@import\s+[\'"]([^"\']+\.css)[\'"]'
        content = re.sub(pattern, replace_import, content)

    # Match JS imports: from '../path/to/file.js' or from "../path/to/file.js"
    elif file_path.endswith(".js"):
        pattern = r'from\s+[\'"]([^"\']+\.(?:js|css))[\'"]'
        content = re.sub(pattern, replace_import, content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        print(f"Fixed imports in: {file_path}")


def process_template_and_style_file(file_path: str) -> None:
    """Process HTML template and CSS component files into JS modules."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        processed = content.strip().replace("`", "\\`").replace("${", "\\${")
        var_name = "template"
        output = f"const {var_name} = `{processed}`;\nexport default {var_name};"

        js_path = f"{file_path}.js"
        with open(js_path, "w", encoding="utf-8") as f:
            f.write(output)

        if file_path.endswith(".html"):
            os.remove(file_path)

        print(f"Processed: {file_path} → {js_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")


def process_js_file(file_path: str) -> None:
    """Update import statements in JS files."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        def replace_import(match):
            import_name = match.group(1)
            path = match.group(2)
            return f"import {import_name} from '{path}.js'"

        template_pattern = (
            r"""import\s+(\w+)\s+from\s*['"]([^'"]*(?:template\.html))['"]"""
        )
        new_content = re.sub(template_pattern, replace_import, content)

        template_pattern = (
            r"""import\s+(\w+)\s+from\s*['"]([^'"]*(?:component\.css))['"]"""
        )
        new_content = re.sub(template_pattern, replace_import, new_content)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)

        print(f"Processed: {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")


def build(mode: str = "dev"):
    """Build process: copy to tmp then transform files."""
    if not check_script_location():
        sys.exit(1)

    src_dir = "src"
    tmp_dir = "tmp"

    if not os.path.exists(src_dir):
        print(f"Error: Source directory not found at {src_dir}")
        return

    print(f"Starting build process in {mode} mode...")

    # Step 1: Copy everything from src to tmp
    copy_src_to_tmp(src_dir, tmp_dir)

    # Step 2: Process template files in tmp
    for root, _, files in os.walk(tmp_dir):
        for file in files:
            file_path = os.path.join(root, file)
            if file == "template.html" or file == "component.css":
                process_template_and_style_file(file_path)

    # Step 3: Fix relative imports in CSS and JS files (only in dev mode)
    if mode == "dev":
        for root, _, files in os.walk(tmp_dir):
            for file in files:
                if file.endswith((".css", ".js")) and not (
                    file.endswith(".html.js") or file.endswith(".css.js")
                ):
                    file_path = os.path.join(root, file)
                    fix_relative_imports(file_path, mode)

    # Step 4: Update import statements in JS files
    for root, _, files in os.walk(tmp_dir):
        for file in files:
            if file.endswith(".js") and not (
                file.endswith(".html.js") or file.endswith(".css.js")
            ):
                file_path = os.path.join(root, file)
                process_js_file(file_path)

    print("Build complete! Files are in tmp/")


if __name__ == "__main__":
    args = parse_args()
    build(args.mode)
