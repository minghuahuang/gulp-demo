const { series, parallel, src, dest, watch } = require('gulp')

const htmlMin = require('gulp-htmlmin')
const inject = require('gulp-inject')

const less = require('gulp-less')
const cssMin = require('gulp-cssmin')

const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

const htmlTask = () => {
  return src('./src/index.html')
  .pipe(htmlMin({
    collapseWhitespace: true // 压缩 html
  }))
  .pipe(dest('./dist/'))
}

const cssTask = () => {
  return src('./src/css/**/*.less', { base: './src' }) // 保持对应目录结构不变
  .pipe(less()) // 处理 less
  .pipe(cssMin()) // 压缩 css
  .pipe(dest('./dist/'))
}

const jsTask = () => {
  return src('./src/js/**/*.js', { base: './src' }) 
  .pipe(babel({ presets: ['@babel/preset-env'] })) // 编译 ES6 -> ES5
  .pipe(uglify()) // 压缩 js
  .pipe(dest('./dist/'))
}

const srcTask = series(htmlTask, cssTask, jsTask)

watch([ './src/js/**/*.js', './src/css/**/*.css' ], srcTask)

module.exports.default = srcTask