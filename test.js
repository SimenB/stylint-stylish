/* eslint-disable eqeqeq */

import chalk from 'chalk'
import logSymbols from 'log-symbols'

import stylint from 'stylint'
import path from 'path'
import clone from 'lodash.clonedeep'
import origCache from 'stylint/src/core/cache'
import origState from 'stylint/src/core/state'

import test from 'ava'

import 'babel-register'

const errorIcon = chalk.stripColor(logSymbols.error)
const warningIcon = chalk.stripColor(logSymbols.warning)

test.beforeEach('before', t => {
  const stylintInstance = stylint().create()

  stylintInstance.state = clone(origState)
  stylintInstance.cache = clone(origCache)

  stylintInstance.state.quiet = true
  stylintInstance.state.watching = true
  stylintInstance.state.strictMode = false
  stylintInstance.config.reporter = require.resolve('./stylish')
  stylintInstance.config.reporterOptions = undefined
  stylintInstance.config.maxErrors = undefined
  stylintInstance.config.maxWarnings = undefined

  stylintInstance.init()

  t.context.stylintInstance = stylintInstance
})

test('should report if all green', t => {
  var report = t.context.stylintInstance.reporter('meh', 'done').msg

  t.ok(report == '')
})

test('should report violations', t => {
  t.context.stylintInstance.cache.file = path.resolve('file.styl')
  t.context.stylintInstance.cache.lineNo = 15
  t.context.stylintInstance.cache.errs = ['', '']
  t.context.stylintInstance.cache.warnings = ['']
  t.context.stylintInstance.state.severity = ''
  t.context.stylintInstance.reporter('woop')
  t.context.stylintInstance.cache.lineNo = 10
  t.context.stylintInstance.state.severity = 'Warning'
  t.context.stylintInstance.reporter('dee')
  t.context.stylintInstance.cache.file = 'meep.styl'
  t.context.stylintInstance.cache.lineNo = 15
  t.context.stylintInstance.state.severity = ''
  t.context.stylintInstance.reporter('doo')

  var report = t.context.stylintInstance.reporter('meh', 'done').msg

  report = chalk.stripColor(report).split('\n')

  t.ok(report.length == 11)
  t.ok(report[0] == '')
  t.ok(report[1] == 'file.styl')
  t.ok(report[2].trim() == 'line 15:  woop')
  t.ok(report[3].trim() == 'line 10:  dee')
  t.ok(report[4] == '')
  t.ok(report[5] == 'meep.styl')
  t.ok(report[6].trim() == 'line 15:  doo')
  t.ok(report[7] == '')
  t.ok(report[8].trim() == `${errorIcon}  2 errors`)
  t.ok(report[9].trim() == `${warningIcon}  1 warning`)
  t.ok(report[10] == '')
})

test('should log Max Errors if provided', t => {
  t.context.stylintInstance.config.maxErrors = 1
  t.context.stylintInstance.cache.file = path.resolve('file.styl')
  t.context.stylintInstance.cache.lineNo = 15
  t.context.stylintInstance.cache.errs = ['', '']
  t.context.stylintInstance.cache.warnings = []
  t.context.stylintInstance.state.severity = ''
  t.context.stylintInstance.reporter('woop')
  t.context.stylintInstance.cache.lineNo = 10
  t.context.stylintInstance.state.severity = 'Warning'
  t.context.stylintInstance.reporter('dee')

  var report = t.context.stylintInstance.reporter('meh', 'done').msg

  report = chalk.stripColor(report).split('\n')

  t.ok(report.length == 7)
  t.ok(report[0] == '')
  t.ok(report[1] == 'file.styl')
  t.ok(report[2].trim() == 'line 15:  woop')
  t.ok(report[3].trim() == 'line 10:  dee')
  t.ok(report[4] == '')
  t.ok(report[5].trim() == `${errorIcon}  2 errors (Max Errors: 1)`)
  t.ok(report[6] == '')
})

test('should log Max Warnings if provided', t => {
  t.context.stylintInstance.config.maxWarnings = 1
  t.context.stylintInstance.cache.file = path.resolve('file.styl')
  t.context.stylintInstance.cache.lineNo = 15
  t.context.stylintInstance.cache.warnings = ['', '']
  t.context.stylintInstance.cache.errs = []
  t.context.stylintInstance.state.severity = ''
  t.context.stylintInstance.reporter('woop')
  t.context.stylintInstance.cache.lineNo = 10
  t.context.stylintInstance.state.severity = 'Warning'
  t.context.stylintInstance.reporter('dee')

  var report = t.context.stylintInstance.reporter('meh', 'done').msg

  report = chalk.stripColor(report).split('\n')

  t.ok(report.length == 7)
  t.ok(report[0] == '')
  t.ok(report[1] == 'file.styl')
  t.ok(report[2].trim() == 'line 15:  woop')
  t.ok(report[3].trim() == 'line 10:  dee')
  t.ok(report[4] == '')
  t.ok(report[5].trim() == `${warningIcon}  2 warnings (Max Warnings: 1)`)
  t.ok(report[6] == '')
})

test('should log kill message if provided', t => {
  t.context.stylintInstance.config.maxErrors = 1
  t.context.stylintInstance.cache.file = path.resolve('file.styl')
  t.context.stylintInstance.cache.lineNo = 15
  t.context.stylintInstance.cache.errs = ['', '']
  t.context.stylintInstance.cache.warnings = []
  t.context.stylintInstance.state.severity = ''
  t.context.stylintInstance.reporter('woop')
  t.context.stylintInstance.cache.lineNo = 10
  t.context.stylintInstance.state.severity = 'Warning'
  t.context.stylintInstance.reporter('dee')

  var report = t.context.stylintInstance.reporter('meh', 'done', 'kill').msg

  report = chalk.stripColor(report).split('\n')

  t.ok(report.length == 8)
  t.ok(report[0] == '')
  t.ok(report[1] == 'file.styl')
  t.ok(report[2].trim() == 'line 15:  woop')
  t.ok(report[3].trim() == 'line 10:  dee')
  t.ok(report[4] == '')
  t.ok(report[5].trim() == `${errorIcon}  2 errors (Max Errors: 1)`)
  t.ok(report[6] == '')
})

test('should report violations with absolute path', t => {
  t.context.stylintInstance.config.reporterOptions = {absolutePath: true}
  t.context.stylintInstance.cache.file = path.resolve('file.styl')
  t.context.stylintInstance.cache.lineNo = 15
  t.context.stylintInstance.cache.warnings = ['']
  t.context.stylintInstance.state.severity = ''
  t.context.stylintInstance.reporter('woop')

  var report = t.context.stylintInstance.reporter('meh', 'done').msg

  report = chalk.stripColor(report).split('\n')

  t.ok(report.length == 6)
  t.ok(report[0] == '')
  t.ok(report[1] == path.join(process.cwd(), 'file.styl'))
  t.ok(report[2].trim() == 'line 15:  woop')
  t.ok(report[3] == '')
  t.ok(report[4].trim() == `${warningIcon}  1 warning`)
  t.ok(report[5] == '')
})

test('should report violations with absolute path with file being relative path', t => {
  t.context.stylintInstance.config.reporterOptions = {absolutePath: true}
  t.context.stylintInstance.cache.file = 'file.styl'
  t.context.stylintInstance.cache.lineNo = 15
  t.context.stylintInstance.cache.warnings = ['']
  t.context.stylintInstance.state.severity = ''
  t.context.stylintInstance.reporter('woop')

  var report = t.context.stylintInstance.reporter('meh', 'done').msg

  report = chalk.stripColor(report).split('\n')

  t.ok(report.length == 6)
  t.ok(report[0] == '')
  t.ok(report[1] == path.join(process.cwd(), 'file.styl'))
  t.ok(report[2].trim() == 'line 15:  woop')
  t.ok(report[3] == '')
  t.ok(report[4].trim() == `${warningIcon}  1 warning`)
  t.ok(report[5] == '')
})

test('should report violations with max errors', t => {
  t.context.stylintInstance.config.maxErrors = 0
  t.context.stylintInstance.cache.file = path.resolve('file.styl')
  t.context.stylintInstance.cache.lineNo = 15
  t.context.stylintInstance.cache.errs = ['meep']
  t.context.stylintInstance.state.severity = ''
  t.context.stylintInstance.reporter('woop')

  var report = t.context.stylintInstance.reporter('meh', 'done').msg

  report = chalk.stripColor(report).split('\n')

  t.ok(report.length == 6)
  t.ok(report[0] == '')
  t.ok(report[1] == 'file.styl')
  t.ok(report[2].trim() == 'line 15:  woop')
  t.ok(report[3] == '')
  t.ok(report[4].trim() == `${errorIcon}  1 error (Max Errors: 0)`)
  t.ok(report[5] == '')
})

test('should report original line if verbose', t => {
  t.context.stylintInstance.config.reporterOptions = {verbose: true}
  t.context.stylintInstance.cache.file = path.resolve('file.styl')
  t.context.stylintInstance.cache.lineNo = 15
  t.context.stylintInstance.cache.errs = []
  t.context.stylintInstance.cache.warnings = ['']
  t.context.stylintInstance.cache.origLine = 'beep boop moop'
  t.context.stylintInstance.state.severity = ''
  t.context.stylintInstance.reporter('woop')

  var report = t.context.stylintInstance.reporter('meh', 'done').msg

  report = chalk.stripColor(report).split('\n')

  t.ok(report.length == 6)
  t.ok(report[0] == '')
  t.ok(report[1] == 'file.styl')
  t.ok(report[2].trim() == 'line 15:  woop  beep boop moop')
  t.ok(report[3] == '')
  t.ok(report[4].trim() == `${warningIcon}  1 warning`)
  t.ok(report[5] == '')
})
