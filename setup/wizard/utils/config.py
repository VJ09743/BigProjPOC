"""Configuration and environment variable management."""

import os
import platform


def save_env_var(name, value):
    """Save an environment variable persistently for the current OS.

    Returns dict with success status and message.
    """
    system = platform.system()

    # Set for current process
    os.environ[name] = value

    if system in ("Darwin", "Linux"):
        return _save_unix_env(name, value)
    elif system == "Windows":
        return _save_windows_env(name, value)

    return {"success": False, "message": f"Unsupported OS: {system}"}


def _save_unix_env(name, value):
    """Append export to shell profile on Mac/Linux."""
    shell = os.environ.get("SHELL", "/bin/bash")
    if "zsh" in shell:
        profile = os.path.expanduser("~/.zshrc")
    else:
        profile = os.path.expanduser("~/.bashrc")

    export_line = f'export {name}="{value}"'

    # Check if already set
    try:
        with open(profile, "r") as f:
            content = f.read()
        if f'export {name}=' in content:
            # Replace existing line
            lines = content.split("\n")
            lines = [
                export_line if line.strip().startswith(f"export {name}=") else line
                for line in lines
            ]
            with open(profile, "w") as f:
                f.write("\n".join(lines))
            return {
                "success": True,
                "message": f"Updated {name} in {profile}",
                "profile": profile,
            }
    except FileNotFoundError:
        pass

    # Append new
    with open(profile, "a") as f:
        f.write(f"\n{export_line}\n")

    return {
        "success": True,
        "message": f"Added {name} to {profile}",
        "profile": profile,
    }


def _save_windows_env(name, value):
    """Set user environment variable on Windows."""
    import subprocess

    result = subprocess.run(
        ["setx", name, value],
        capture_output=True,
        text=True,
    )
    if result.returncode == 0:
        return {
            "success": True,
            "message": f"Set {name} as user environment variable",
        }
    return {
        "success": False,
        "message": f"Failed to set {name}: {result.stderr}",
    }


def get_suggested_paths():
    """Return suggested project locations for the current OS."""
    home = os.path.expanduser("~")
    system = platform.system()

    paths = [
        {"path": os.path.join(home, "Desktop"), "label": "Desktop"},
        {"path": os.path.join(home, "Documents"), "label": "Documents"},
        {"path": home, "label": "Home directory"},
    ]

    if system == "Windows":
        paths.append({"path": "C:\\Projects", "label": "C:\\Projects"})

    # Filter to paths that exist
    return [p for p in paths if os.path.isdir(p["path"])]


def browse_folder():
    """Open a native OS folder picker dialog and return the selected path.

    Tries tkinter first (cross-platform), then falls back to OS-specific tools.
    Returns dict with 'path' (selected path or empty string if cancelled).
    """
    # Try tkinter (standard library, works on all platforms)
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()  # Hide the root window
        root.attributes("-topmost", True)  # Bring dialog to front
        folder = filedialog.askdirectory(
            title="Choose project location",
            initialdir=os.path.expanduser("~"),
        )
        root.destroy()
        if folder:
            return {"success": True, "path": folder}
        return {"success": True, "path": ""}  # User cancelled
    except Exception:
        pass

    # Fallback: OS-specific tools
    import subprocess
    system = platform.system()

    if system == "Darwin":
        # macOS: use osascript
        script = (
            'osascript -e \'tell application "System Events" to '
            "activate\" -e 'set theFolder to choose folder with prompt "
            '"Choose project location"' "' -e 'POSIX path of theFolder'"
        )
        result = subprocess.run(script, shell=True, capture_output=True, text=True)
        if result.returncode == 0 and result.stdout.strip():
            return {"success": True, "path": result.stdout.strip().rstrip("/")}

    elif system == "Linux":
        # Linux: try zenity, then kdialog
        for cmd in ["zenity --file-selection --directory --title='Choose project location'",
                     "kdialog --getexistingdirectory ~"]:
            tool = cmd.split()[0]
            if os.path.isfile(f"/usr/bin/{tool}") or os.path.isfile(f"/usr/local/bin/{tool}"):
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                if result.returncode == 0 and result.stdout.strip():
                    return {"success": True, "path": result.stdout.strip()}

    elif system == "Windows":
        # Windows: use PowerShell folder browser
        ps_cmd = (
            'powershell -Command "Add-Type -AssemblyName System.Windows.Forms; '
            "$f = New-Object System.Windows.Forms.FolderBrowserDialog; "
            "$f.Description = 'Choose project location'; "
            "if ($f.ShowDialog() -eq 'OK') { $f.SelectedPath }\""
        )
        result = subprocess.run(ps_cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0 and result.stdout.strip():
            return {"success": True, "path": result.stdout.strip()}

    return {"success": False, "path": "", "message": "No folder picker available"}
