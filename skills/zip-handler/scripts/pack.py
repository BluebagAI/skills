#!/usr/bin/env python3
"""
Pack Script - Creates a zip file from a folder or file.

Usage:
    python pack.py <path_to_folder_or_file>
"""

import os
import sys
import zipfile
import argparse
from pathlib import Path


def pack_zip(source_path: str, output_zip: str = None) -> None:
    """
    Creates a zip file from a folder or file.
    
    Args:
        source_path: Path to the folder or file to zip
        output_zip: Name/path of the output zip file (defaults to source name + .zip)
    
    Raises:
        FileNotFoundError: If the source path doesn't exist
    """
    # Convert to Path object for better path handling
    source_path_obj = Path(source_path)
    
    # Validate that the source exists
    if not source_path_obj.exists():
        raise FileNotFoundError(f"Source path not found: {source_path}")
    
    # Determine output zip file name
    if output_zip is None:
        output_zip = f"{source_path_obj.name}.zip"
    
    # Ensure .zip extension
    if not output_zip.endswith('.zip'):
        output_zip = f"{output_zip}.zip"
    
    output_zip_path = Path(output_zip)
    
    # Track files being added
    files_added = 0
    
    try:
        with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zip_ref:
            print(f"Creating zip file: {output_zip_path.absolute()}")
            print(f"Source: {source_path_obj.absolute()}")
            
            if source_path_obj.is_file():
                # If source is a single file, add it to the zip
                zip_ref.write(source_path_obj, source_path_obj.name)
                files_added = 1
                print(f"  Added: {source_path_obj.name}")
                
            elif source_path_obj.is_dir():
                # If source is a directory, add all files recursively
                for file_path in source_path_obj.rglob('*'):
                    if file_path.is_file():
                        # Calculate relative path to maintain folder structure
                        arcname = file_path.relative_to(source_path_obj.parent)
                        zip_ref.write(file_path, arcname)
                        files_added += 1
                        print(f"  Added: {arcname}")
            
            print(f"✓ Successfully created {output_zip_path.absolute()}")
            print(f"✓ Total files packed: {files_added}")
            
            # Show file size
            file_size = output_zip_path.stat().st_size
            if file_size < 1024:
                size_str = f"{file_size} bytes"
            elif file_size < 1024 * 1024:
                size_str = f"{file_size / 1024:.2f} KB"
            else:
                size_str = f"{file_size / (1024 * 1024):.2f} MB"
            
            print(f"✓ Zip file size: {size_str}")
            
    except Exception as e:
        # Clean up partial zip file if creation failed
        if output_zip_path.exists():
            output_zip_path.unlink()
        raise e


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description="Pack/compress a folder or file into a zip archive.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Zip a folder (creates my_folder.zip)
  python pack.py my_folder
  
  # Zip a single file (creates document.txt.zip)
  python pack.py document.txt
  
  # Create zip with custom name
  python pack.py my_folder -o archive.zip
  
  # Create zip with custom name (without .zip extension)
  python pack.py my_folder -o archive
        """
    )
    
    parser.add_argument(
        'source_path',
        help='Path to the folder or file to zip'
    )
    
    parser.add_argument(
        '-o', '--output',
        dest='output_zip',
        help='Output zip file name (default: source name + .zip)',
        default=None
    )
    
    args = parser.parse_args()
    
    try:
        pack_zip(args.source_path, args.output_zip)
        sys.exit(0)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
