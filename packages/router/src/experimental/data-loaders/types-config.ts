import type { TypesConfig } from '../../config'

/**
 * The default error type used for data loaders. Can be customized via {@link TypesConfig}.
 *
 * @example
 * ```ts
 * // types-extension.d.ts
 * import 'vue-x-router/experimental'
 * export {}
 * declare module 'vue-x-router/experimental' {
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
