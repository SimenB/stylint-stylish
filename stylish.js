import path from 'path'
import pathIsAbsolute from 'path-is-absolute'
import chalk from 'chalk'
import logSymbols from 'log-symbols'
import table from 'text-table'
import pluralize from 'pluralize'
import isNumber from 'lodash.isnumber'

let currFile
let currTable = []

function createSummary (errs, warns, total) {
  if (total === 0) {
    return 'No violations'
  }

  let output = ''

  if (errs > 0) {
    output += `\t${logSymbols.error}  ${pluralize('error', errs, true)}`

    if (isNumber(this.config.maxErrors)) {
      output += ` (Max Errors: ${this.config.maxErrors})`
    }

    output += '\n'
  }

  if (warns > 0) {
    output += `\t${logSymbols.warning}  ${pluralize('warning', warns, true)}`

    if (isNumber(this.config.maxWarnings)) {
      output += ` (Max Warnings: ${this.config.maxWarnings})`
    }

    output += '\n'
  }

  return output
}

function doneHandler (kill) {
  const errs = this.cache.errs.length
  const warns = this.cache.warnings.length
  const total = errs + warns

  this.cache.msg = `${table(currTable)}\n${createSummary.call(this, errs, warns, total)}`

  if (kill === 'kill') {
    this.cache.msg += '\nStylint: Over Error or Warning Limit.'
  } else if (total === 0) {
    this.cache.msg = ''
  }

  currFile = undefined
  currTable = []

  return this.done()
}

export default function (msg, done, kill) {
  if (done === 'done') {
    return doneHandler.call(this, kill)
  }

  const isWarning = this.state.severity === 'Warning'

  if (currFile !== this.cache.file) {
    const {absolutePath} = (this.config.reporterOptions || {})
    currFile = this.cache.file

    const filename = absolutePath ?
      pathIsAbsolute(currFile) ? currFile : path.resolve(currFile) :
      pathIsAbsolute(currFile) ? path.relative(process.cwd(), currFile) : currFile

    currTable.push([`${chalk.underline(filename)}:\n`])
  }

  currTable.push([
    '',
    chalk.gray(`line ${this.cache.lineNo}:`),
    isWarning ? (process.platform === 'win32' ? chalk.cyan(msg) : chalk.blue(msg)) : chalk.red(msg)
  ])

  return ''
}
