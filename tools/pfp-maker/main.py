import os
import re
import shutil

# === Absolute project setup ===
PROJECT_ROOT = "."  # current working directory (pfp-maker-main)
SRC_OLD = os.path.join(PROJECT_ROOT, "src", "pfppride")
SRC_NEW = os.path.join(PROJECT_ROOT, "src", "overlay")

# === File renaming map
RENAME_MAP = {
    "pfppride.js": "overlayObject.js",
    "presetflags.js": "presetOverlays.js",
    "editor.js": "imageEditor.js"
}

# === Pattern replacements
REPLACEMENTS = {
    r'\bFlagObject\b': 'OverlayObject',
    r'\bpresetFlags\b': 'presetOverlays',
    r'\bflag\b': 'overlay',
    r'\bFlag\b': 'Overlay',
    r'\bpride\b': 'theme',
    r'\bPride\b': 'Theme',
    r'src/pfppride/pfppride.js': 'src/overlay/overlayObject.js',
    r'src/pfppride/presetflags.js': 'src/overlay/presetOverlays.js',
    r'src/pfppride/editor.js': 'src/overlay/imageEditor.js'
}

def rename_files():
    if not os.path.exists(SRC_NEW):
        os.makedirs(SRC_NEW)

    for old_file, new_file in RENAME_MAP.items():
        old_path = os.path.join(SRC_OLD, old_file)
        new_path = os.path.join(SRC_NEW, new_file)
        if os.path.exists(old_path):
            shutil.move(old_path, new_path)
            print(f"[RENAMED] {old_file} → {new_file}")
        else:
            print(f"[SKIPPED] {old_file} not found at {old_path}")

def replace_text_in_project():
    for root, _, files in os.walk(PROJECT_ROOT):
        for file in files:
            if file.endswith((".js", ".html", ".css")):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                updated = content
                for pattern, replacement in REPLACEMENTS.items():
                    updated = re.sub(pattern, replacement, updated)

                if updated != content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(updated)
                    print(f"[UPDATED] {file_path}")

if __name__ == "__main__":
    print("=== STARTING FIXED REFACTOR ===")
    rename_files()
    replace_text_in_project()
    print("=== DONE ===")
