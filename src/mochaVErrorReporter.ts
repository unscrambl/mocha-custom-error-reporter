import { Runner, utils as MochaUtils, reporters as MochaReporters } from "mocha";
import { VError } from "verror";

var stackFilter = MochaUtils.stackTraceFilter();

export class MochaVErrorReporter extends MochaReporters.Base
{
    private static _DEFAULT_INDENT: string = "    ";
    private static _REMOVE_REPEATED_MESSAGE_REGEX: RegExp = /caused by.+\n/;
    private static _REPLACE_WITH_INDENT_REGEX: RegExp = /\n/g;

    constructor(runner: Runner) {
        super(runner);
        runner.on('fail', function(test, err) {
            err.stack = stackFilter(MochaVErrorReporter.fullStack(err));
        });
    }

    public static fullStack(error, indent = MochaVErrorReporter._DEFAULT_INDENT, indentLevel = 1)
    {
        if (typeof error.errors === "function")
        {
            let message = error.stack.replace(/\n.+/g, "");
            let index = 1;
            const suppressedErrors = error.errors();
            for (const suppressedError of suppressedErrors)
            {
                message += `\n${indent.repeat(indentLevel)}${index} of ${suppressedErrors.length} suppressed errors: `
                message += `${MochaVErrorReporter.fullStack(suppressedError, indent, indentLevel+1)}`;
                index++;
            }
            return message;
        }
        if (typeof error.cause === "function")
        {
            const cause = error.cause();
            error.stack = error.stack.replace(MochaVErrorReporter._REMOVE_REPEATED_MESSAGE_REGEX, "\n");
            if (cause)
            {
                return `${error.stack.replace(MochaVErrorReporter._REPLACE_WITH_INDENT_REGEX, "\n" + indent.repeat(indentLevel))}`
                        + `\n${indent.repeat(indentLevel)}caused by, ${MochaVErrorReporter.fullStack(cause, indent, indentLevel+1)}`;
            }
        }
        return VError.fullStack(error).replace(MochaVErrorReporter._REPLACE_WITH_INDENT_REGEX, "\n" + indent.repeat(indentLevel));
    }
}