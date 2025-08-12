import platform
import subprocess

try:
    from importlib import metadata as importlib_metadata
except ImportError:  # pragma: no cover - Python <3.8 fallback
    import importlib_metadata  # type: ignore

import psutil
import toml


def get_python_version():
    return platform.python_version()


def get_pip_version():
    try:
        pip_version = subprocess.check_output(["pip", "--version"]).decode().split()[1]
    except Exception as e:
        pip_version = str(e)
    return pip_version


def get_oi_version():
    try:
        oi_version_cmd = subprocess.check_output(
            ["interpreter", "--version"], text=True
        )
    except Exception as e:
        oi_version_cmd = str(e)

    try:
        oi_version_pkg = importlib_metadata.version("open-interpreter")
    except Exception:
        oi_version_pkg = "unknown"

    oi_version = oi_version_cmd, oi_version_pkg
    return oi_version


def get_os_version():
    return platform.platform()


def get_cpu_info():
    return platform.processor()


def get_ram_info():
    vm = psutil.virtual_memory()
    used_ram_gb = vm.used / (1024**3)
    free_ram_gb = vm.free / (1024**3)
    total_ram_gb = vm.total / (1024**3)
    return f"{total_ram_gb:.2f} GB, used: {used_ram_gb:.2f}, free: {free_ram_gb:.2f}"


def get_package_mismatches(file_path="pyproject.toml"):
    try:
        with open(file_path, "r") as file:
            pyproject = toml.load(file)
        dependencies = pyproject.get("tool", {}).get("poetry", {}).get("dependencies", {})
        dev_dependencies = (
            pyproject.get("tool", {}).get("poetry", {}).get("group", {}).get("dev", {}).get("dependencies", {})
        )
        merged_dependencies = {}
        merged_dependencies.update(dependencies)
        merged_dependencies.update(dev_dependencies)
    except Exception:
        merged_dependencies = {}

    installed_packages = {}
    try:
        for dist in importlib_metadata.distributions():
            try:
                installed_packages[dist.metadata["Name"].lower()] = dist.version
            except Exception:
                # Fallback in case metadata is missing
                name = getattr(dist, "metadata", {}).get("Name") or getattr(dist, "_name", None)
                if name:
                    installed_packages[name.lower()] = getattr(dist, "version", "unknown")
    except Exception:
        installed_packages = {}

    mismatches = []
    for package, version_info in merged_dependencies.items():
        try:
            if isinstance(version_info, dict):
                version_spec = version_info.get("version")
            else:
                version_spec = str(version_info)

            installed_version = installed_packages.get(package.lower())
            if installed_version is None:
                mismatches.append(f"\t  {package}: Not found in pip list")
                continue

            if version_spec and version_spec.startswith("^"):
                expected_prefix = version_spec[1:]
                if not installed_version.startswith(expected_prefix):
                    mismatches.append(
                        f"\t  {package}: Mismatch, pyproject.toml={expected_prefix}, pip={installed_version}"
                    )
        except Exception as e:
            mismatches.append(f"\t  {package}: Error checking version ({e})")

    return "\n" + "\n".join(mismatches)


def interpreter_info(interpreter):
    try:
        if interpreter.offline and interpreter.llm.api_base:
            try:
                curl = subprocess.check_output(f"curl {interpreter.llm.api_base}")
            except Exception as e:
                curl = str(e)
        else:
            curl = "Not local"

        messages_to_display = []
        for message in interpreter.messages:
            message = str(message.copy())
            try:
                if len(message) > 2000:
                    message = message[:1000]
            except Exception as e:
                print(str(e), "for message:", message)
            messages_to_display.append(message)

        return f"""

        # Interpreter Info
        
        Vision: {interpreter.llm.supports_vision}
        Model: {interpreter.llm.model}
        Function calling: {interpreter.llm.supports_functions}
        Context window: {interpreter.llm.context_window}
        Max tokens: {interpreter.llm.max_tokens}
        Computer API: {interpreter.computer.import_computer_api}

        Auto run: {interpreter.auto_run}
        API base: {interpreter.llm.api_base}
        Offline: {interpreter.offline}

        Curl output: {curl}

        # Messages

        System Message: {interpreter.system_message}

        """ + "\n\n".join(
            [str(m) for m in messages_to_display]
        )
    except:
        return "Error, couldn't get interpreter info"


def get_system_debug_info():
    try:
        info = f"""

        # System Debug Info

        Python version: {get_python_version()}
        Pip version: {get_pip_version()}
        Open Interpreter version: {get_oi_version()}
        OS version: {get_os_version()}
        CPU info: {get_cpu_info()}
        RAM info: {get_ram_info()}

        # Package mismatches: {get_package_mismatches()}

        """
        return info
    except Exception as e:
        return str(e)
