/* eslint-disable no-param-reassign */
/* eslint-env jest */

import chalk from 'chalk';
import logSymbols from 'log-symbols';

import stylint from 'stylint';
import path from 'path';
import clone from 'lodash.clonedeep';
import origCache from 'stylint/src/core/cache';
import origState from 'stylint/src/core/state';

const errorIcon = chalk.stripColor(logSymbols.error);
const warningIcon = chalk.stripColor(logSymbols.warning);

let stylintInstance;

beforeEach(() => {
  stylintInstance = stylint().create();

  stylintInstance.state = clone(origState);
  stylintInstance.cache = clone(origCache);

  stylintInstance.state.quiet = true;
  stylintInstance.state.watching = true;
  stylintInstance.state.strictMode = false;
  stylintInstance.config.reporter = require.resolve('./stylish');
  stylintInstance.config.reporterOptions = undefined;
  stylintInstance.config.maxErrors = undefined;
  stylintInstance.config.maxWarnings = undefined;

  stylintInstance.init();
});

test('should report if all green', () => {
  const report = stylintInstance.reporter('meh', 'done').msg;

  expect(report).toEqual('');
});

test('should report violations', () => {
  stylintInstance.cache.file = path.resolve('file.styl');
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.errs = ['', ''];
  stylintInstance.cache.warnings = [''];
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');
  stylintInstance.cache.lineNo = 10;
  stylintInstance.state.severity = 'Warning';
  stylintInstance.reporter('dee');
  stylintInstance.cache.file = 'meep.styl';
  stylintInstance.cache.lineNo = 15;
  stylintInstance.state.severity = '';
  stylintInstance.reporter('doo');

  let report = stylintInstance.reporter('meh', 'done').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(11);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual('file.styl');
  expect(report[2].trim()).toEqual('line 15  -  woop');
  expect(report[3].trim()).toEqual('line 10  -  dee');
  expect(report[4]).toEqual('');
  expect(report[5]).toEqual('meep.styl');
  expect(report[6].trim()).toEqual('line 15  -  doo');
  expect(report[7]).toEqual('');
  expect(report[8].trim()).toEqual(`${errorIcon}  2 errors`);
  expect(report[9].trim()).toEqual(`${warningIcon}  1 warning`);
  expect(report[10]).toEqual('');
});

test('should log Max Errors if provided', () => {
  stylintInstance.config.maxErrors = 1;
  stylintInstance.cache.file = path.resolve('file.styl');
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.errs = ['', ''];
  stylintInstance.cache.warnings = [];
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');
  stylintInstance.cache.lineNo = 10;
  stylintInstance.state.severity = 'Warning';
  stylintInstance.reporter('dee');

  let report = stylintInstance.reporter('meh', 'done').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(7);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual('file.styl');
  expect(report[2].trim()).toEqual('line 15  -  woop');
  expect(report[3].trim()).toEqual('line 10  -  dee');
  expect(report[4]).toEqual('');
  expect(report[5].trim()).toEqual(`${errorIcon}  2 errors (Max Errors: 1)`);
  expect(report[6]).toEqual('');
});

test('should log Max Warnings if provided', () => {
  stylintInstance.config.maxWarnings = 1;
  stylintInstance.cache.file = path.resolve('file.styl');
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.warnings = ['', ''];
  stylintInstance.cache.errs = [];
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');
  stylintInstance.cache.lineNo = 10;
  stylintInstance.state.severity = 'Warning';
  stylintInstance.reporter('dee');

  let report = stylintInstance.reporter('meh', 'done').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(7);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual('file.styl');
  expect(report[2].trim()).toEqual('line 15  -  woop');
  expect(report[3].trim()).toEqual('line 10  -  dee');
  expect(report[4]).toEqual('');
  expect(report[5].trim()).toEqual(`${warningIcon}  2 warnings (Max Warnings: 1)`);
  expect(report[6]).toEqual('');
});

test('should log kill message if provided', () => {
  stylintInstance.config.maxErrors = 1;
  stylintInstance.cache.file = path.resolve('file.styl');
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.errs = ['', ''];
  stylintInstance.cache.warnings = [];
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');
  stylintInstance.cache.lineNo = 10;
  stylintInstance.state.severity = 'Warning';
  stylintInstance.reporter('dee');

  let report = stylintInstance.reporter('meh', 'done', 'kill').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(8);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual('file.styl');
  expect(report[2].trim()).toEqual('line 15  -  woop');
  expect(report[3].trim()).toEqual('line 10  -  dee');
  expect(report[4]).toEqual('');
  expect(report[5].trim()).toEqual(`${errorIcon}  2 errors (Max Errors: 1)`);
  expect(report[6]).toEqual('');
});

test('should report violations with absolute path', () => {
  stylintInstance.config.reporterOptions = { absolutePath: true };
  stylintInstance.cache.file = path.resolve('file.styl');
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.warnings = [''];
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');

  let report = stylintInstance.reporter('meh', 'done').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(6);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual(path.join(process.cwd(), 'file.styl'));
  expect(report[2].trim()).toEqual('line 15  -  woop');
  expect(report[3]).toEqual('');
  expect(report[4].trim()).toEqual(`${warningIcon}  1 warning`);
  expect(report[5]).toEqual('');
});

test('should report violations with absolute path with file being relative path', () => {
  stylintInstance.config.reporterOptions = { absolutePath: true };
  stylintInstance.cache.file = 'file.styl';
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.warnings = [''];
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');

  let report = stylintInstance.reporter('meh', 'done').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(6);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual(path.join(process.cwd(), 'file.styl'));
  expect(report[2].trim()).toEqual('line 15  -  woop');
  expect(report[3]).toEqual('');
  expect(report[4].trim()).toEqual(`${warningIcon}  1 warning`);
  expect(report[5]).toEqual('');
});

test('should report violations with max errors', () => {
  stylintInstance.config.maxErrors = 0;
  stylintInstance.cache.file = path.resolve('file.styl');
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.errs = ['meep'];
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');

  let report = stylintInstance.reporter('meh', 'done').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(6);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual('file.styl');
  expect(report[2].trim()).toEqual('line 15  -  woop');
  expect(report[3]).toEqual('');
  expect(report[4].trim()).toEqual(`${errorIcon}  1 error (Max Errors: 0)`);
  expect(report[5]).toEqual('');
});

test('should report original line if verbose', () => {
  stylintInstance.config.reporterOptions = { verbose: true };
  stylintInstance.cache.file = path.resolve('file.styl');
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.errs = [];
  stylintInstance.cache.warnings = [''];
  stylintInstance.cache.origLine = 'beep boop moop';
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');

  let report = stylintInstance.reporter('meh', 'done').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(6);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual('file.styl');
  expect(report[2].trim()).toEqual('line 15  -  woop  beep boop moop');
  expect(report[3]).toEqual('');
  expect(report[4].trim()).toEqual(`${warningIcon}  1 warning`);
  expect(report[5]).toEqual('');
});

test('should report violations with column if available', () => {
  stylintInstance.cache.file = path.resolve('file.styl');
  stylintInstance.cache.col = 10;
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.rule = 'some rule';
  stylintInstance.cache.errs = ['', ''];
  stylintInstance.cache.warnings = [''];
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');
  stylintInstance.cache.lineNo = 10;
  stylintInstance.cache.col = 25;
  stylintInstance.cache.rule = 'some other rule';
  stylintInstance.state.severity = 'Warning';
  stylintInstance.reporter('dee');
  stylintInstance.cache.file = 'meep.styl';
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.col = 42;
  stylintInstance.state.severity = '';
  stylintInstance.reporter('doo');

  let report = stylintInstance.reporter('meh', 'done').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(11);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual('file.styl');
  expect(report[2].trim()).toEqual('line 15  col 10  woop');
  expect(report[3].trim()).toEqual('line 10  col 25  dee');
  expect(report[4]).toEqual('');
  expect(report[5]).toEqual('meep.styl');
  expect(report[6].trim()).toEqual('line 15  col 42  doo');
  expect(report[7]).toEqual('');
  expect(report[8].trim()).toEqual(`${errorIcon}  2 errors`);
  expect(report[9].trim()).toEqual(`${warningIcon}  1 warning`);
  expect(report[10]).toEqual('');
});

test('should report violations with rule name if option active', () => {
  stylintInstance.config.reporterOptions = { ruleName: true };
  stylintInstance.cache.file = path.resolve('file.styl');
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.rule = 'some rule';
  stylintInstance.cache.errs = ['', ''];
  stylintInstance.cache.warnings = [''];
  stylintInstance.state.severity = '';
  stylintInstance.reporter('woop');
  stylintInstance.cache.lineNo = 10;
  stylintInstance.cache.rule = 'some other rule';
  stylintInstance.state.severity = 'Warning';
  stylintInstance.reporter('dee');
  stylintInstance.cache.file = 'meep.styl';
  stylintInstance.cache.lineNo = 15;
  stylintInstance.cache.col = 42;
  stylintInstance.cache.rule = null;
  stylintInstance.state.severity = '';
  stylintInstance.reporter('doo');

  let report = stylintInstance.reporter('meh', 'done').msg;

  report = chalk.stripColor(report).split('\n');

  expect(report.length).toEqual(11);
  expect(report[0]).toEqual('');
  expect(report[1]).toEqual('file.styl');
  expect(report[2].trim()).toEqual('line 15  -       woop some rule');
  expect(report[3].trim()).toEqual('line 10  -       dee some other rule');
  expect(report[4]).toEqual('');
  expect(report[5]).toEqual('meep.styl');
  expect(report[6].trim()).toEqual('line 15  col 42  doo');
  expect(report[7]).toEqual('');
  expect(report[8].trim()).toEqual(`${errorIcon}  2 errors`);
  expect(report[9].trim()).toEqual(`${warningIcon}  1 warning`);
  expect(report[10]).toEqual('');
});
