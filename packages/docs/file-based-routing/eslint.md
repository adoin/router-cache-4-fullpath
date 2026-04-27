# ESLint

If you are not using auto imports, you will need to tell ESLint about `vue-smart-router/auto-routes`. Add these lines to your eslint configuration:

```json{3}
{
  "settings": {
    "import/core-modules": ["vue-smart-router/auto-routes"]
  }
}
```

## `definePage()`

Since `definePage()` is a global macro, you need to tell ESLint about it. Add these lines to your eslint configuration:

```json{3}
{
  "globals": {
    "definePage": "readonly"
  }
}
```
