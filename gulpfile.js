/*
 * Copyright (c) 2021. 7Summits Inc.
 */

const fs = require('fs');
const sfdxPath = 'force-app/main/default';
// Detect if using the sfdx or standard file structure.
const usingSourceFormat = fs.existsSync(sfdxPath);
const buildPathPrefix = usingSourceFormat ? sfdxPath : 'src';

const cache       = require('gulp-cached');
const prettier    = require('gulp-prettier');
const gulp        = require('gulp');
const header      = require('gulp-header');
const less        = require('gulp-less');
const notify      = require('gulp-notify');
const pkg         = require('./package.json');
const plumber     = require('gulp-plumber');
const replace     = require('gulp-string-replace');
const pxtorem     = require('gulp-pxtorem');

const pxtoremOptions = {
    propList: ['*']
};

// -------------------------------------------------------------------------------------------------
// Shared resource path locations
// -------------------------------------------------------------------------------------------------
// jsWatchMin - Files that will be watched then minified into a single Javascript file upon changes
// jsLint - Files that will be ran through the linter
// cssBootstrap - File that will be used to compile LESS to CSS
// cssWatchMin - Files that will be watched for changes then compiled upon changes
// -------------------------------------------------------------------------------------------------
const srcPaths = {
    aura: ['styles/components/aura/**/*.less'],
    lwc: ['styles/components/lwc/**/*.less'],
    components: ['styles/components/lwc/**/*.less', 'styles/components/aura/**/*.less'],
    cleanCSS: ['./styles/**/*.less'],
    cssWatchMin: ['styles/**/*.less']
};

console.log('buildPathPrefix', buildPathPrefix)

// -------------------------------------------------------------------------------------------------
// Build resource path locations
// -------------------------------------------------------------------------------------------------
// js - Compiled/minified Javascript output location
// css - Compiled/minified CSS output location
// -------------------------------------------------------------------------------------------------
const buildPaths = {
    lwc: `${buildPathPrefix}/lwc/`,
    aura: `${buildPathPrefix}/aura/`
};

// -------------------------------------------------------------------------------------------------
// Error handler
// -------------------------------------------------------------------------------------------------
const onError = function (err) {
    notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>'
    })(err);
    this.emit('end');
};

// -------------------------------------------------------------------------------------------------
// Header appended to all compiled files as a notice
// -------------------------------------------------------------------------------------------------
const compiledBanner = [
    '/*',
    ' * Copyright (c) <%= new Date().getFullYear() %>. <%= pkg.author %> All rights reserved.',
    ' *',
    ' * COMPILED FILE DO NOT DIRECTLY EDIT',
    ' */',
    ''
].join('\n');

// -------------------------------------------------------------------------------------------------
// CSS Tasks
// -------------------------------------------------------------------------------------------------

// Runs postCSS parser on all custom LESS files.
// https://prettier.io
// -----------------------------
gulp.task('cleanCSS', function () {
    return gulp.src(srcPaths.cleanCSS, {base: './'})
        .pipe(cache('cleanCSS'))
        .pipe(plumber({errorHandler: onError}))
        .pipe(prettier())
        .pipe(gulp.dest('./'));
});

// Compile LWC LESS files into CSS
// -------------------------------
gulp.task('compileLWCCSS', gulp.series('cleanCSS', function () {
        return gulp
            .src(srcPaths.lwc, {allowEmpty : true})
            .pipe(cache('lwcCSS'))
            .pipe(plumber({errorHandler: onError}))
            .pipe(less())
            .pipe(pxtorem(pxtoremOptions))
            .pipe(header(compiledBanner, {pkg: pkg}))
            .pipe(replace(new RegExp(/[\r\n]*$/, 'g'), ''))
            .pipe(gulp.dest(buildPaths.lwc))
            .pipe(
                notify({
                    title: 'Gulp',
                    subtitle: 'Success',
                    message: 'LWC LESS compiled: <%= file.relative %>'
                })
            );
    })
);

// Compile Aura LESS files into CSS
// -------------------------------
gulp.task('compileAuraCSS', gulp.series('cleanCSS', function () {
    return gulp
        .src(srcPaths.aura, {allowEmpty : true})
        .pipe(cache('auraCSS'))
        .pipe(plumber({errorHandler: onError}))
        .pipe(less())
        .pipe(header(compiledBanner, {pkg: pkg}))
        .pipe(gulp.dest(buildPaths.aura))
        .pipe(
            notify({
                title: 'Gulp',
                subtitle: 'Success',
                message: 'Aura LESS compiled: <%= file.relative %>'
            })
        );
})
);

// Build CSS tasks
// -----------------------------
gulp.task('buildCSS', gulp.parallel('compileAuraCSS', 'compileLWCCSS'));


// -------------------------------------------------------------------------------------------------
// Watch Tasks
// -------------------------------------------------------------------------------------------------
gulp.task('watch:styles', function () {
    gulp.watch(srcPaths.components, gulp.series('compileAuraCSS', 'compileLWCCSS'));
});

gulp.task('watch', gulp.parallel('watch:styles'));

// -------------------------------------------------------------------------------------------------
// The default task (called when you run `gulp` from cli)
// -------------------------------------------------------------------------------------------------
gulp.task('default', gulp.series('buildCSS', 'watch'));