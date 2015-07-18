/*jshint mocha:true*/

import assert from 'assert';
import chalk from 'chalk';
import stylint from 'stylint';
const stylintInstance = stylint().create();

describe('stylint-stylish', () => {
  beforeEach(() => {
    stylintInstance.state.quiet = true;
    stylintInstance.state.watching = true;
    stylintInstance.state.strictMode = false;
    stylintInstance.config.reporter = require.resolve('./src');
    stylintInstance.init();
  });

  it('should report if all green', () => {
    var report = stylintInstance.reporter('meh', 'done').msg;

    assert.equal(`Stylint: You're all clear!`, report);
  });

  it('should report violations', () => {
    stylintInstance.cache.file = 'file.styl';
    stylintInstance.cache.lineNo = 15;
    stylintInstance.cache.errs = [ '', '' ];
    stylintInstance.cache.warnings = [ '' ];
    stylintInstance.state.severity = '';
    stylintInstance.reporter('woop');
    stylintInstance.cache.lineNo = 10;
    stylintInstance.state.severity = 'Warning';
    stylintInstance.reporter('dee');
    stylintInstance.cache.file = 'meep.styl';
    stylintInstance.cache.lineNo = 15;
    stylintInstance.state.severity = '';
    stylintInstance.reporter('doo');

    var report = stylintInstance.reporter('meh', 'done').msg;

    report = chalk.stripColor(report).split('\n');

    assert.equal(8, report.length);
    assert.equal('file.styl:', report[0]);
    assert.equal('line 15:  woop', report[1].trim());
    assert.equal('line 10:  dee', report[2].trim());
    assert.equal('meep.styl:', report[3]);
    assert.equal('line 15:  doo', report[4].trim());
    assert.equal('\t✖  2 errors', report[5]);
    assert.equal('\t⚠  1 warning', report[6]);
    assert.equal('', report[7]);
  });
});
