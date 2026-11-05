/**
 * The menus as a tree, in menu order: each top-level menu (by priority) followed by its sub-menus (by priority).
 * Top-level rows get `depth: 0` + `childCount`; sub-menus get `depth: 1`, `parentName` and `last` (for the connector).
 * Shared by Menu Mapping & Access and Roles & Access.
 */
export function toTree(all) {
  const byPriority = (a, b) => a.priority - b.priority;
  return all
    .filter((m) => !m.parent)
    .sort(byPriority)
    .flatMap((top) => {
      const kids = all.filter((m) => m.parent === top.id).sort(byPriority);
      return [
        { ...top, depth: 0, childCount: kids.length },
        ...kids.map((k, i) => ({ ...k, depth: 1, parentName: top.name, last: i === kids.length - 1 })),
      ];
    });
}
