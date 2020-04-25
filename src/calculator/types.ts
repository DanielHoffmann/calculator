export type Operator = '+' | '-' | '*';
export type Token = number | Operator;

export const operators: Operator[] = ['+', '-', '*'];

export interface SyntaxTreeNode {
  operator: Operator;
  left: SyntaxTreeNode | number | null;
  right: SyntaxTreeNode | number | null;
}
