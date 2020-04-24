import { Tree, addElement, createTree, infixTraverse } from './tree';

function createNumberTree(): Tree<number> {
  return createTree((num1, num2) => {
    return num1 === num2 ? 0 : num1 > num2 ? -1 : 1;
  });
}

describe('tree tests', () => {
  it('tree adding elements', () => {
    const tree = createNumberTree();
    addElement(tree, 10);
    addElement(tree, 5);
    addElement(tree, 19);
    addElement(tree, 12);
    addElement(tree, 15);
    const els: number[] = [];
    infixTraverse(tree.root, el => {
      els.push(el);
    });
    expect(els).toEqual([5, 10, 12, 15, 19]);
  });
});
