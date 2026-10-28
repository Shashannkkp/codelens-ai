
export function getLanguageFromPath(path = "") {
  if (typeof path !== "string" || !path.trim()) {
    return "Unknown";
  }

  const fileName = path.split("/").pop() || "";
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex <= 0 || dotIndex === fileName.length - 1) {
    return "Unknown";
  }

  const extension = fileName.slice(dotIndex + 1).toLowerCase();

  if (extension === "java") return "Java";

  if (["js", "jsx", "ts", "tsx"].includes(extension)) {
    return "JavaScript";
  }

  if (extension === "py") return "Python";

  return "Unknown";
}

export function buildFileTree(files = []) {
  const root = [];

  if (!Array.isArray(files)) {
    return root;
  }

  for (const file of files) {
    if (
      !file ||
      typeof file.path !== "string" ||
      !file.path.trim()
    ) {
      continue;
    }

    const parts = file.path
      .split("/")
      .filter(Boolean);

    // Ignore malformed paths containing traversal segments.
    if (
      parts.length === 0 ||
      parts.some((part) => part === "." || part === "..")
    ) {
      continue;
    }

    let current = root;

    for (let index = 0; index < parts.length; index++) {
      const part = parts[index];
      const isFile = index === parts.length - 1;
      const nodePath = parts.slice(0, index + 1).join("/");

      let node = current.find(
        (item) =>
          item.name === part &&
          item.isFile === isFile
      );

      if (!node) {
        node = {
          name: part,
          path: nodePath,
          isFile,
          children: [],
        };

        current.push(node);
      }

      if (!isFile) {
        current = node.children;
      }
    }
  }

  function sortTree(nodes) {
    nodes.sort((a, b) => {
      if (a.isFile !== b.isFile) {
        return a.isFile ? 1 : -1;
      }

      return a.name.localeCompare(b.name);
    });

    for (const node of nodes) {
      if (!node.isFile) {
        sortTree(node.children);
      }
    }
  }

  sortTree(root);

  return root;
}
