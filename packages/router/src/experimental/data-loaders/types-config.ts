import type { TypesConfig } from '../../config'

/**
 * The default error type used for data loaders. Can be customized via {@link TypesConfig}.
 *
 * @example
 * ```ts
 * // types-extension.d.ts
 * import 'vue-smart-router/experimental'
 * export {}
 * declare module 'vue-smart-router/experimental' {
 *   interface TypesConfig {
 *     Error: MyCustomError
 *   }
 * }
 * ```
 *
 * @internal
 */
export type ErrorDefault =
  TypesConfig extends Record<'Error', infer E> ? E : Error
