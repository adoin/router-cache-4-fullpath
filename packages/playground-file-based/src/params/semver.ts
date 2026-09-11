import { defineParamParser, miss } from 'vue-smart-router/experimental'
import { parse, type SemVer } from 'semver'

export const parser = defineParamParser<SemVer>({
  get: value => {
    return parse(value, true, true) ?? miss(`Invalid semver: "${value}"`)
  },
  set: value => value.format(),
})
