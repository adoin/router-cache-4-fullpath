/**
 * This file only contain types and is used for the generated d.ts to avoid polluting the global namespace.
 * https://github.com/posva/unplugin-vue-router/issues/136
 */

// TODO: remove these file, it's no longer needed after the merge of unplugin-vue-router into vue-smart-router

export type { EditableTreeNode } from './core/extendRoutes'
export type { TreeNode } from './core/tree'
export type {
  TreeNodeValue,
  TreeNodeValueGroup,
  TreeNodeValueParam,
  TreeNodeValueStatic,
} from './core/treeNodeValue'
export type { Options } from './options'
