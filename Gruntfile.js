module.exports = function (grunt) {
   grunt.initConfig({
      browserify: {
         dist: {
            options: {
               transform: [
                  ["babelify", {
                     presets: ["es2015", "react"],
                     plugins: ['transform-runtime']
                  }]
               ],
            },
            files: {
               // if the source file has an extension of es6 then
               // we change the name of the source file accordingly.
               // The result file's extension is always .js
               //"./static/dist/js/lib.js": ["./static/js/lib/*.js"],
               "./assets/public/js/app.js": ["./assets/js/components/App.js"]
            }
         }
      },
      less: {
         dev: {
            files: {
               "./assets/public/css/app.css": ["./assets/styles/less/**/*.less"]
            }
         }
     },
      watch: {
         scripts: {
            files: ["./assets/js/**/*.js", "./assets/styles/less/**/*.less", "./assets/js/**/*.jsx"],
            tasks: ["build"]
         }
      }
   });

   grunt.loadNpmTasks("grunt-browserify");
   grunt.loadNpmTasks("grunt-contrib-watch");
   grunt.loadNpmTasks("grunt-contrib-less");

   grunt.registerTask("default", ["watch"]);
   grunt.registerTask("build", ["browserify", "less"]);
};