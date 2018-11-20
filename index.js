var mocha = require('mocha');
var stackFilter = require('mocha/lib/utils').stackTraceFilter();
const VError = require("verror");
module.exports = MochaVErrorReporter;

function MochaVErrorReporter(runner)
{
  mocha.reporters.Base.call(this, runner);
  runner.on('fail', function(test, err) {
    err.stack = stackFilter(fullStack(err, "    "));
  });
}

function fullStack(error, indent)
{
    if (typeof error.errors === "function")
    {
        let message = error.stack.replace(/\n.+/g, "");
        let index = 1;
        const suppressedErrors = error.errors();
        for (const suppressedError of suppressedErrors)
        {
            message += `\n${indent}${index} of ${suppressedErrors.length} suppressed errors: `
            message += `${fullStack(suppressedError, indent + "    ")}`;
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
            return `${error.stack.replace(/\n/g, "\n" + indent)}`
                    + `\n${indent}caused by, ${fullStack(cause, indent + "    ")}`;
        }
    }
    return VError.fullStack(error).replace(/\n/g, "\n" + indent);
}