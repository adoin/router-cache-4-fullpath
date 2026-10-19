import { defineHashParamParser } from 'vue-smart-router/experimental'

export const parser = defineHashParamParser<string[]>({
  get: value => value.split('/'),
  set: value => value.join('/'),
})
