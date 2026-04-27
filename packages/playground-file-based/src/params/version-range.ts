import { Range, parse, validRange, type SemVer } from 'semver'
import { definePathParamParser, miss } from 'vue-smart-router/experimental'

export const parser = definePathParamParser({
  get: (value: string): SemVer | Range => {
    return (
      parse(value, false, false) ||
      (validRange(value) && new Range(value)) ||
      miss(`Invalid version "${value}"`)
    )
  },
  set: (value: SemVer | Range): string => value.format(),
})
