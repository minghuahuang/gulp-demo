const { series, parallel, src, dest, watch } = require('gulp')

const htmlMin = require('gulp-htmlmin')

const less = require('gulp-less')
const postCss = require('gulp-postcss')
const postPresetEnv = require('postcss-preset-env')
const cssMin = require('gulp-cssmin')

const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

const inject = require('gulp-inject')

const browser = require('browser-sync')

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
  .pipe(postCss([postPresetEnv()])) // 自动增加浏览器前缀
  .pipe(cssMin()) // 压缩 css
  .pipe(dest('./dist/'))
}

const jsTask = () => {
  return src('./src/js/**/*.js', { base: './src' }) 
  .pipe(babel({ presets: ['@babel/preset-env'] })) // 编译 ES6 -> ES5
  .pipe(uglify()) // 压缩 js
  .pipe(dest('./dist/'))
}

const injectTask = () => {
  return src('./dist/index.html')
  .pipe(
    inject(
      src(['./dist/**/*.js','./dist/css/**/*.css'], { read: false }),
      { relative: true } // 相对路径引入
    )
  )
  .pipe(dest('./dist/'))
}

const srcTask = series(htmlTask, cssTask, jsTask, injectTask)

// 搭建本地服务器
const server = browser.create()
const serverTask = () => {

  watch("./src/*.html", series(htmlTask, injectTask))
  watch("./src/**/*.less", series(cssTask, injectTask))
  watch("./src/**/*.js", series(jsTask, injectTask))

  server.init({
    port: 3000,
    open: true,
    files: "./dist/*",
    server: {
      baseDir: './dist/'
    }
  })
}

module.exports = {
  srcTask,
  serverTask
}