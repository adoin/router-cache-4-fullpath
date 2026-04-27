export { experimental_createRouter, normalizeRouteRecord } from './router'
export type {
  EXPERIMENTAL_RouteRecordNormalized,
  EXPERIMENTAL_RouteRecordNormalized_Group,
  EXPERIMENTAL_RouteRecordNormalized_Matchable,
  EXPERIMENTAL_RouteRecordRaw,
  EXPERIMENTAL_RouteRecord_Base,
  EXPERIMENTAL_RouteRecord_Group,
  EXPERIMENTAL_RouteRecord_Matchable,
  EXPERIMENTAL_Router,
  EXPERIMENTAL_RouterOptions,
  EXPERIMENTAL_RouterOptions_Base,
  EXPERIMENTAL_Router_Base,
} from './router'

export {
  MatcherPatternPathDynamic,
  MatcherPatternPathStatic,
} from './route-resolver/matchers/matcher-pattern'
export { createFixedResolver } from './route-resolver/resolver-fixed'

export type {
  EmptyParams,
  MatcherParamsFormatted,
  MatcherPattern,
  MatcherPatternHash,
  MatcherPatternPath,
  MatcherPatternPathDynamic_ParamOptions,
  MatcherQueryParams,
  MatcherQueryParamsValue,
} from './route-resolver/matchers/matcher-pattern'

export {
  MatcherPatternQueryParam,
  type MatcherPatternQuery,
} from './route-resolver/matchers/matcher-pattern-query'

export {
  PARAM_PARSER_BOOL,
  PARAM_PARSER_INT,
  normalizeParamParser as _normalizeParamParser,
  defineParamParser,
  definePathParamParser,
  defineQueryParamParser,
  type ParamParser,
  type ExtractParamParserType as _ExtractParamParserType,
} from './route-resolver/matchers/param-parsers'

export { MatchMiss as _MatchMiss, miss } from './route-resolver/matchers/errors'

/**
 * Internal functions and types for the experimental router.
 * They should all be prefixed with `_` to avoid conflicts with the public API.
 */

// Runtime exports (definePage macro)
export {
  _mergeRouteRecord,
  definePage,
  type DefinePage,
  type DefinePageQueryParamOptions,
  type ParamParserType,
  type ParamParserType_Native,
} from './runtime'

// Data loaders exports
export {
  // Core
  DataLoaderPlugin,
  NavigationResult as _NavigationResult,
  // Utilities
  getCurrentContext,
  reroute,
  setCurrentContext,
  toLazyValue,
  trackRoute,
  useIsDataLoading,
  withLoaderContext,
  type DataLoaderContextBase,
  type DataLoaderEntryBase,
  type DataLoaderPluginOptions,
  type DefineDataLoaderOptionsBase_DefinedData,
  type DefineDataLoaderOptionsBase_LaxData,
  type DefineLoaderFn,
  // Types config
  type ErrorDefault,
  type SetupLoaderGuardOptions,
  // Loader types
  type UseDataLoader,
  type UseDataLoaderInternals,
  type UseDataLoaderResult,
} from './data-loaders/entries/index'

// TODO: only keep _NavigationResult in next major
import { NavigationResult as NavResult } from './data-loaders/entries/index'
/**
 * @deprecated Use {@link reroute} instead.
 */
export class NavigationResult extends NavResult {
  constructor(...args: ConstructorParameters<typeof NavResult>) {
    super(...args)
    console.warn(
      `[vue-smart-router]: new NavigationResult(to) is deprecated. Use reroute(to) instead.`
    )
  }
}

// Basic loader
export {
  defineBasicLoader,
  type DataLoaderBasicEntry,
  type DataLoaderContext,
  // deprecated
  type DefineDataLoaderOptions,
  type DefineDataLoaderOptions_DefinedData,
  type DefineDataLoaderOptions_LaxData,
  type UseDataLoaderBasic,
  type UseDataLoaderBasic_DefinedData,
  type UseDataLoaderBasic_LaxData,
} from './data-loaders/defineLoader'

// FIXME: this was getting merged with non experimental code
// it should only affect when importing from experimental
// this means some interfaces import from experimental from core and they shouldn't
// we need to refactor those interface to be outside of experimental

// in the new experimental router, there are only parents
// this should create type errors if someone is relying on children
// declare module 'vue-smart-router' {
//   export interface RouteLocationMatched {
//     /**
//      * The experimental router uses a `parent` property instead of `children`.
//      */
//     children?: never
//   }
// }
