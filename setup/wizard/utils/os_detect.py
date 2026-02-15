"""OS detection utilities."""

import platform
import shutil
import subprocess


def get_os_info():
    """Detect OS type, version, and available package manager."""
    system = platform.system()

    if system == "Darwin":
        version = platform.mac_ver()[0]
        pkg_manager = "brew" if shutil.which("brew") else None
        return {
            "os": "mac",
            "system": "Darwin",
            "version": version,
            "display_name": f"macOS {version}",
            "pkg_manager": pkg_manager,
        }

    elif system == "Linux":
        distro = _detect_linux_distro()
        pkg_manager = _detect_linux_pkg_manager()
        return {
            "os": "linux",
            "system": "Linux",
            "distro": distro.get("name", "Linux"),
            "version": distro.get("version", ""),
            "display_name": f"{distro.get('name', 'Linux')} {distro.get('version', '')}".strip(),
            "pkg_manager": pkg_manager,
        }

    elif system == "Windows":
        version = platform.version()
        pkg_manager = _detect_windows_pkg_manager()
        return {
            "os": "windows",
            "system": "Windows",
            "version": version,
            "display_name": f"Windows {platform.release()}",
            "pkg_manager": pkg_manager,
        }

    return {
        "os": "unknown",
        "system": system,
        "version": "",
        "display_name": system,
        "pkg_manager": None,
    }


def _detect_linux_distro():
    """Detect Linux distribution from /etc/os-release."""
    try:
        with open("/etc/os-release") as f:
            info = {}
            for line in f:
                if "=" in line:
                    key, val = line.strip().split("=", 1)
                    info[key] = val.strip('"')
            return {
                "name": info.get("NAME", "Linux"),
                "version": info.get("VERSION_ID", ""),
                "id": info.get("ID", "linux"),
            }
    except FileNotFoundError:
        return {"name": "Linux", "version": "", "id": "linux"}


def _detect_linux_pkg_manager():
    """Detect available package manager on Linux."""
    for mgr in ["apt", "dnf", "yum", "pacman", "zypper"]:
        if shutil.which(mgr):
            return mgr
    return None


def _detect_windows_pkg_manager():
    """Detect available package manager on Windows."""
    if shutil.which("winget"):
        return "winget"
    if shutil.which("choco"):
        return "choco"
    return None
