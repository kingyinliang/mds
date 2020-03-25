# factory

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
新建.env.local环境文件存放全局变量和接口host
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Compiles and minifies for production test
```
yarn build:test
```

### Compiles and minifies for production dev
```
yarn build:dev
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

### MDS
```
api.js const HOST = process.env.VUE_APP_MDS_API
router/index.js const _import = process.env.NODE_ENV !== 'local' ? require('./import-production') : require('./import-development')
```
