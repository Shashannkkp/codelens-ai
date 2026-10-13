
export function getLanguageFromPath(path = "") {
  const extension = path.split(".").pop()?.toLowerCase();

  if (extension === "java") return "Java";

  if (["js", "jsx", "ts", "tsx"].includes(extension)) {
    return "JavaScript";
  }

  if (extension === "py") return "Python";

  return "Java";
}

export function buildFileTree(files = []) {
  const root = [];

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;

      let node = current.find(
        (item) => item.name === part && item.isFile === isFile
      );

      if (!node) {
        node = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          isFile,
          children: [],
        };

        current.push(node);
      }

      if (!isFile) {
        current = node.children;
      }
    });
  }

  function sortTree(nodes) {
    nodes.sort((a, b) => {
      if (a.isFile !== b.isFile) {
        return a.isFile ? 1 : -1;
      }

      return a.name.localeCompare(b.name);
    });

    nodes.forEach((node) => {
      if (!node.isFile) {
        sortTree(node.children);
      }
    });
  }

  sortTree(root);

  return root;
}