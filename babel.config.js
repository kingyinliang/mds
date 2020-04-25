const IS_PROD = ['production'].includes(process.env.NODE_ENV);

const plugins = [["component", { "libraryName": "element-ui", "styleLibraryName": "theme-chalk" }]];
if (IS_PROD) {
    plugins.push('transform-remove-console');
}

module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset',
    ],
    plugins,
};
