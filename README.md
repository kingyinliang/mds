# factory

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
### MDS
```
api.js const HOST = process.env.VUE_APP_MDS_API
router/index.js const _import = process.env.NODE_ENV !== 'local' ? require('./import-production') : require('./import-development')
```
