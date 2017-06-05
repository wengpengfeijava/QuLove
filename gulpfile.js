/**
 * Created by 亡灵走秀 on 2016/12/16.
 */

var gulp = require ( 'gulp' ),
    server = require ( 'browser-sync' ).create (),
    config = require ( './build/config' ),
    less = require ( 'gulp-less' ),
    through2 = require ( 'through2' ),
    path = require ( 'path' ),
    px2rem = require ( 'gulp-px2rem' );

var accord = require ( 'accord' );

var theLess = accord.load ( 'less' );


gulp.task ( 'serve', ['less'], function () {
    server.init ( {
        open: false,
        notify: false,
        server: {
            baseDir: config._static.base,
            port: config._static.port
        },
        serveStatic: [
            {route: '/' + config.styles, dir: config.temp}
        ]
    } );

    gulp.watch ( config.lessReg, ['less'] );

    gulp.watch ( config.htmlReg, server.reload );

    gulp.watch ( config.cssReg, server.reload );
} );

gulp.task ( 'less', function () {
    return gulp.src ( [config.lessReg, '!app/styles/common/html.less'] )

        .pipe ( less () )


        .pipe ( px2rem ( {
            replace: true
        },{
            map: true
        } ) )

        .pipe ( through2.obj ( function ( mainFile, cn, call ) {
            var stream = this,
                isMainStyleLess = mainFile.path.indexOf ( 'styles\\style.css' ) !== -1;
            gulp.src ( 'app/styles/common/html.less' )

                .on ( 'data', function ( file ) {
                    if ( isMainStyleLess ) {
                        mainFile.contents = new Buffer ( file.contents.toString () + mainFile.contents.toString () );
                        stream.push ( mainFile );
                    }
                } )
                .on ( 'end', function () {
                    call ();
                } );
        } ) )

        .pipe ( gulp.dest ( config.temp ) );
} );