#!/usr/bin/env python3
"""
Unpack Script - Extracts contents from a zip file.

Usage:
    python unpack.py <path_to_zip_file>
"""

import os
import sys
import zipfile
import argparse
from pathlib import Path


def unpack_zip(zip_path: str, output_dir: str = None) -> None:
    """
    Extracts contents from a zip file to the specified output directory.
    
    Args:
        zip_path: Path to the zip file to extract
        output_dir: Directory where contents will be extracted (defaults to current directory)
    
    Raises:
        FileNotFoundError: If the zip file doesn't exist
        zipfile.BadZipFile: If the file is not a valid zip file
    """
    # Convert to Path object for better path handling
    zip_path_obj = Path(zip_path)
    
    # Validate that the file exists
    if not zip_path_obj.exists():
        raise FileNotFoundError(f"Zip file not found: {zip_path}")
    
    # Validate that it's a file (not a directory)
    if not zip_path_obj.is_file():
        raise ValueError(f"Path is not a file: {zip_path}")
    
    # Determine output directory
    if output_dir is None:
        # Extract to a directory with the same name as the zip file (without extension)
        output_dir = zip_path_obj.stem
    
    output_path = Path(output_dir)
    
    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Extract the zip file
    try:
        with zipfile.ZipFile(zip_path_obj, 'r') as zip_ref:
            print(f"Extracting: {zip_path}")
            print(f"Destination: {output_path.absolute()}")
            print(f"Files to extract: {len(zip_ref.namelist())}")
            
            zip_ref.extractall(output_path)
            
            print(f"✓ Successfully extracted {len(zip_ref.namelist())} files to {output_path.absolute()}")
            
    except zipfile.BadZipFile:
        raise zipfile.BadZipFile(f"Invalid zip file: {zip_path}")


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description="Unpack/extract contents from a zip file.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Extract to a directory named after the zip file
  python unpack.py archive.zip
  
  # Extract to a specific directory
  python unpack.py archive.zip -o my_output_folder
        """
    )
    
    parser.add_argument(
        'zip_path',
        help='Path to the zip file to extract'
    )
    
    parser.add_argument(
        '-o', '--output',
        dest='output_dir',
        help='Output directory for extracted files (default: same name as zip file without extension)',
        default=None
    )
    
    args = parser.parse_args()
    
    try:
        unpack_zip(args.zip_path, args.output_dir)
        sys.exit(0)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except zipfile.BadZipFile as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
