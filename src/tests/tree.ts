export interface TreeNode<T> {
  element: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

export interface Tree<T> {
  root: TreeNode<T> | null;
  comparison: (el1: T, el2: T) => -1 | 0 | 1;
}

export function createTree<T>(comparison: Tree<T>['comparison']): Tree<T> {
  return {
    root: null,
    comparison,
  };
}

function addElementTreeNode<T>(
  treeNode: TreeNode<T>,
  element: T,
  comparison: Tree<T>['comparison'],
) {
  if (comparison(treeNode.element, element) >= 0) {
    if (treeNode.right === null) {
      treeNode.right = {
        element,
        left: null,
        right: null,
      };
    } else {
      addElementTreeNode(treeNode.right, element, comparison);
    }
  } else if (treeNode.left === null) {
    treeNode.left = {
      element,
      left: null,
      right: null,
    };
  } else {
    addElementTreeNode(treeNode.left, element, comparison);
  }
}

export function addElement<T>(tree: Tree<T>, element: T) {
  if (tree.root === null) {
    tree.root = {
      element,
      left: null,
      right: null,
    };
  } else {
    return addElementTreeNode(tree.root, element, tree.comparison);
  }
}

export function infixTraverse<T>(
  tree: TreeNode<T> | null,
  callback: (el: T) => void,
) {
  if (tree === null) {
    return;
  }
  infixTraverse(tree.left, callback);
  callback(tree.element);
  infixTraverse(tree.right, callback);
}
