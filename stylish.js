import path from 'path'
import pathIsAbsolute from 'path-is-absolute'
import chalk from 'chalk'
import logSymbols from 'log-symbols'
import table from 'text-table'
import pluralize from 'pluralize'
import isNumber from 'lodash.isnumber'

let currFile
let currTable = []
let filenames = []
let options
let optionsRead = false

function resetState () {
  currFile = undefined
  currTable = []
  filenames = []
  options = undefined
  optionsRead = false
}

function createSummary (errs, warns, total, maxErrors, maxWarnings) {
  if (total === 0) {
    return 'No violations'
  }

  let output = ''

  if (errs > 0) {
    output += `  ${logSymbols.error}  ${pluralize('error', errs, true)}`

    if (isNumber(maxErrors)) {
      output += ` (Max Errors: ${maxErrors})`
    }

    output += '\n'
  }

  if (warns > 0) {
    output += `  ${logSymbols.warning}  ${pluralize('warning', warns, true)}`

    if (isNumber(maxWarnings)) {
      output += ` (Max Warnings: ${maxWarnings})`
    }

    output += '\n'
  }

  return output
}

function doneHandler (kill) {
  const errs = this.cache.errs.length
  const warns = this.cache.warnings.length
  const total = errs + warns
  const msg = table(currTable)
    .split('\n')
    .map((msg, i) => {
      return filenames[i] ? `\n${filenames[i]}\n${msg}` : msg
    })
    .join('\n') + '\n\n'

  this.cache.msg = `${msg}${createSummary(errs, warns, total, this.config.maxErrors, this.config.maxWarnings)}`

  if (kill === 'kill') {
    this.cache.msg += '\nStylint: Over Error or Warning Limit.'
  } else if (total === 0) {
    this.cache.msg = ''
  }

  resetState()

  return this.done()
}

export default function (msg, done, kill) {
  if (done === 'done') {
    return doneHandler.call(this, kill)
  }

  if (!optionsRead) {
    optionsRead = true

    const {absolutePath, verbose} = (this.config.reporterOptions || {})
    options = {absolutePath, verbose}
  }

  const isWarning = this.state.severity === 'Warning'

  if (currFile !== this.cache.file) {
    currFile = this.cache.file
    let filename

    if (options.absolutePath) {
      filename = pathIsAbsolute(currFile) ? currFile : path.resolve(currFile)
    } else {
      filename = pathIsAbsolute(currFile) ? path.relative(process.cwd(), currFile) : currFile
    }

    filenames[currTable.length] = chalk.underline(filename)
  }

  currTable.push([
    '',
    chalk.gray(`line ${this.cache.lineNo}:`),
    isWarning ? chalk.blue(msg) : chalk.red(msg),
    options.verbose ? chalk.gray(this.cache.origLine.trim()) : ''
  ])

  return ''
}
