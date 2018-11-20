var mocha = require('mocha');
var stackFilter = require('mocha/lib/utils').stackTraceFilter();
const VError = require("verror");

function MochaVErrorReporter(runner)
{
  mocha.reporters.Base.call(this, runner);
  runner.on('fail', function(test, err) {
    err.stack = stackFilter(fullStack(err));
  });
}

var fullStack = function(error, indent = "    ", indentLevel = 1)
{
    if (typeof error.errors === "function")
    {
        let message = error.stack.replace(/\n.+/g, "");
        let index = 1;
        const suppressedErrors = error.errors();
        for (const suppressedError of suppressedErrors)
        {
            message += `\n${indent.repeat(indentLevel)}${index} of ${suppressedErrors.length} suppressed errors: `
            message += `${fullStack(suppressedError, indent, indentLevel+1)}`;
            index++;
        }
        return message;
    }
    if (typeof error.cause === "function")
    {
        const cause = error.cause();
        error.stack = error.stack.replace(/caused by.+\n/, "\n");
        if (cause)
        {
            return `${error.stack.replace(/\n/g, "\n" + indent.repeat(indentLevel))}`
                    + `\n${indent.repeat(indentLevel)}caused by, ${fullStack(cause, indent, indentLevel+1)}`;
        }
    }
    return VError.fullStack(error).replace(/\n/g, "\n" + indent.repeat(indentLevel));
}

module.exports = MochaVErrorReporter;
module.exports.fullStack = fullStack;