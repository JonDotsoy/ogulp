#!/usr/bin/env node

'use strict';

/**
 * Ref from https://github.com/mochajs/mocha/blob/master/bin/mocha
 */

var resolve = require('resolve')
var spawn = require('child_process').spawn;
var path = require('path');
var args = [resolve.sync('gulp-cli/bin/gulp')];

// Load mocha.opts into process.argv
// Must be loaded here to handle node-specific options

var skipArg = NaN

process.argv.slice(2).forEach(function (arg, index) {
  var flag = arg.split('=')[0];

  if (skipArg === index) {
    args.unshift(arg)
    args.unshift('--require')
    skipArg = NaN
    return
  }

  switch (flag) {
    case '-r':
    case '--require':
      skipArg = index + 1
      break;
    case '-d':
      args.unshift('--debug');
      args.push('--no-timeouts');
      break;
    case 'debug':
    case '--debug':
    case '--debug-brk':
    case '--inspect':
      args.unshift(arg);
      args.push('--no-timeouts');
      break;
    case '-gc':
    case '--expose-gc':
      args.unshift('--expose-gc');
      break;
    case '--gc-global':
    case '--es_staging':
    case '--no-deprecation':
    case '--prof':
    case '--log-timer-events':
    case '--throw-deprecation':
    case '--trace-deprecation':
    case '--use_strict':
    case '--allow-natives-syntax':
    case '--perf-basic-prof':
      args.unshift(arg);
      break;
    default:
      if (arg.indexOf('--harmony') === 0) {
        args.unshift(arg);
      } else if (arg.indexOf('--trace') === 0) {
        args.unshift(arg);
      } else if (arg.indexOf('--icu-data-dir') === 0) {
        args.unshift(arg);
      } else if (arg.indexOf('--max-old-space-size') === 0) {
        args.unshift(arg);
      } else if (arg. indexOf('--preserve-symlinks') === 0) {
        args.unshift(arg);
      } else {
        args.push(arg);
      }
      break;
  }
});

var proc = spawn(process.execPath, args, { stdio: 'inherit' });
proc.on('exit', function (code, signal) {
  process.on('exit', function () {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code);
    }
  });
});

// terminate children.
process.on('SIGINT', function () {
  proc.kill('SIGINT'); // calls runner.abort()
  proc.kill('SIGTERM'); // if that didn't work, we're probably in an infinite loop, so make it die.
});

