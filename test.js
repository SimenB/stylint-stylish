/* eslint-env mocha */

import assert from 'assert'
import chalk from 'chalk'
import logSymbols from 'log-symbols'
import stylint from 'stylint'
import path from 'path'
import clone from 'lodash.clonedeep'
import origCache from 'stylint/src/core/cache'
import origState from 'stylint/src/core/state'

const stylintInstance = stylint().create()

const errorIcon = chalk.stripColor(logSymbols.error)
const warningIcon = chalk.stripColor(logSymbols.warning)

describe('stylint-stylish', () => {
  beforeEach(() => {
    stylintInstance.state = clone(origState)
    stylintInstance.cache = clone(origCache)

    stylintInstance.state.quiet = true
    stylintInstance.state.watching = true
    stylintInstance.state.strictMode = false
    stylintInstance.config.reporter = require.resolve('./stylish')
    stylintInstance.config.reporterOptions = undefined

    stylintInstance.init()
  })

  it('should report if all green', () => {
    var report = stylintInstance.reporter('meh', 'done').msg

    assert.equal('', report)
  })

  it('should report violations', () => {
    stylintInstance.cache.file = path.resolve('file.styl')
    stylintInstance.cache.lineNo = 15
    stylintInstance.cache.errs = ['', '']
    stylintInstance.cache.warnings = ['']
    stylintInstance.state.severity = ''
    stylintInstance.reporter('woop')
    stylintInstance.cache.lineNo = 10
    stylintInstance.state.severity = 'Warning'
    stylintInstance.reporter('dee')
    stylintInstance.cache.file = 'meep.styl'
    stylintInstance.cache.lineNo = 15
    stylintInstance.state.severity = ''
    stylintInstance.reporter('doo')

    var report = stylintInstance.reporter('meh', 'done').msg

    report = chalk.stripColor(report).split('\n')

    assert.equal(report.length, 11)
    assert.equal(report[0], '')
    assert.equal(report[1], 'file.styl')
    assert.equal(report[2].trim(), 'line 15:  woop')
    assert.equal(report[3].trim(), 'line 10:  dee')
    assert.equal(report[4], '')
    assert.equal(report[5], 'meep.styl')
    assert.equal(report[6].trim(), 'line 15:  doo')
    assert.equal(report[7], '')
    assert.equal(report[8].trim(), `${errorIcon}  2 errors`)
    assert.equal(report[9].trim(), `${warningIcon}  1 warning`)
    assert.equal(report[10], '')
  })

  it('should report violations with absolute path', () => {
    stylintInstance.config.reporterOptions = { absolutePath: true }
    stylintInstance.cache.file = path.resolve('file.styl')
    stylintInstance.cache.lineNo = 15
    stylintInstance.cache.warnings = ['']
    stylintInstance.state.severity = ''
    stylintInstance.reporter('woop')

    var report = stylintInstance.reporter('meh', 'done').msg

    report = chalk.stripColor(report).split('\n')

    assert.equal(report.length, 6)
    assert.equal(report[0], '')
    assert.equal(report[1], path.join(process.cwd(), 'file.styl'))
    assert.equal(report[2].trim(), 'line 15:  woop')
    assert.equal(report[3], '')
    assert.equal(report[4].trim(), `${warningIcon}  1 warning`)
    assert.equal(report[5], '')
  })

  it('should report violations with max errors', () => {
    stylintInstance.config.maxErrors = 0
    stylintInstance.cache.file = path.resolve('file.styl')
    stylintInstance.cache.lineNo = 15
    stylintInstance.cache.errs = ['meep']
    stylintInstance.state.severity = ''
    stylintInstance.reporter('woop')

    var report = stylintInstance.reporter('meh', 'done').msg

    report = chalk.stripColor(report).split('\n')

    assert.equal(report.length, 6)
    assert.equal(report[0], '')
    assert.equal(report[1], `file.styl`)
    assert.equal(report[2].trim(), 'line 15:  woop')
    assert.equal(report[3], '')
    assert.equal(report[4].trim(), `${errorIcon}  1 error (Max Errors: 0)`)
    assert.equal(report[5], '')
  })

  it('should report original line if verbose', () => {
    stylintInstance.config.reporterOptions = { verbose: true }
    stylintInstance.cache.file = path.resolve('file.styl')
    stylintInstance.cache.lineNo = 15
    stylintInstance.cache.errs = []
    stylintInstance.cache.warnings = ['']
    stylintInstance.cache.origLine = 'beep boop moop'
    stylintInstance.state.severity = ''
    stylintInstance.reporter('woop')

    var report = stylintInstance.reporter('meh', 'done').msg

    report = chalk.stripColor(report).split('\n')

    assert.equal(report.length, 6)
    assert.equal(report[0], '')
    assert.equal(report[1], 'file.styl')
    assert.equal(report[2].trim(), 'line 15:  woop  beep boop moop')
    assert.equal(report[3], '')
    assert.equal(report[4].trim(), `${warningIcon}  1 warning`)
    assert.equal(report[5], '')
  })
})
