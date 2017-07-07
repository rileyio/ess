var gulp = require('gulp')
var ts = require('gulp-typescript')
var livereload = require('gulp-livereload')
var nodemon = require('gulp-nodemon')

// Typescript Config
var tsProject = ts.createProject('tsconfig.json')

// Compile typescript
gulp.task('typescript', function () {
  console.log('gulp -> typescript')

  var tsResult = tsProject
    .src()
    .pipe(tsProject())

  return tsResult
    .js
    .pipe(gulp.dest('app'))
})

gulp.task('live', ['typescript'], () => {
  console.log('gulp[:live] -> live')

  nodemon({
    script: 'app/app',
    ext: 'js ts',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if (/^server listening on port/.test(chunk)) {
        livereload.changed(__dirname)
      }
    })
    this.stdout.pipe(process.stdout)
    this.stderr.pipe(process.stderr)
  })
})

gulp.task('watch', () => {
  livereload.listen()
  gulp.watch('./src/**/*.ts', ['typescript'])
})

gulp.task('dev', [
  'watch',
  'live'
])

gulp.task('build', [
  'typescript'
])
