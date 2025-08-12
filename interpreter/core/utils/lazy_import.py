import importlib.util
import sys


def lazy_import(name, optional=True):
    """Lazily import a module by name.

    In Python 3.12+, importlib.util.find_spec may raise ModuleNotFoundError
    when parent packages are missing (e.g., "matplotlib.pyplot").
    Treat that as "module not found" for optional imports.
    """
    # Return already-imported module
    if name in sys.modules:
        return sys.modules[name]

    # Probe for spec; be resilient to parent package absence
    try:
        spec = importlib.util.find_spec(name)
    except ModuleNotFoundError:
        spec = None

    if spec is None:
        if optional:
            return None
        raise ImportError(f"Module '{name}' cannot be found")

    # Defer the loading of the module using LazyLoader
    loader = importlib.util.LazyLoader(spec.loader)
    spec.loader = loader

    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    loader.exec_module(module)
    return module
