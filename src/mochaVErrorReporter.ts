import { reporters as MochaReporters, Runner, utils as MochaUtils } from "mocha";
import { VError } from "verror";

export class MochaVErrorReporter extends MochaReporters.Base
{
    private static readonly _DEFAULT_INDENT: string = "    ";
    private static readonly _REMOVE_REPEATED_MESSAGE_REGEX: RegExp = /caused by.+\n/;
    private static readonly _REPLACE_WITH_INDENT_REGEX: RegExp = /\n/g;
    private static readonly _REMOVE_AFTER_FIRST_LINE_REGEX: RegExp = /\n.+/g;
    private static readonly _MOCHA_STACK_FILTER = MochaUtils.stackTraceFilter();

    constructor(runner: Runner)
    {
        super(runner);
        runner.on("fail", (test, err: Error) =>
        {
            err.stack = MochaVErrorReporter._MOCHA_STACK_FILTER(
                MochaVErrorReporter.fullStack(err));
        });
    }

    public static fullStack(error: Error, indent: string = MochaVErrorReporter._DEFAULT_INDENT): string
    {
        return MochaVErrorReporter.fullStackImpl(error, indent, 1);
    }

    private static fullStackImpl(error, indent = MochaVErrorReporter._DEFAULT_INDENT, indentationLevel = 1)
    {
        if (typeof error.errors === "function")
        {
            let message = error.stack.replace(MochaVErrorReporter._REMOVE_AFTER_FIRST_LINE_REGEX, "");
            let index = 1;
            const suppressedErrors = error.errors();
            for (const suppressedError of suppressedErrors)
            {
                message += `\n${indent.repeat(indentationLevel)}`;
                message += `#${index}/${suppressedErrors.length} suppressed errors: `;
                message += `${MochaVErrorReporter.fullStackImpl(suppressedError, indent, indentationLevel + 1)}`;
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
                return `${error.stack.replace(MochaVErrorReporter._REPLACE_WITH_INDENT_REGEX, "\n"
                    + indent.repeat(indentationLevel))}`
                    + `\n${indent.repeat(indentationLevel)}caused by, `
                    + `${MochaVErrorReporter.fullStackImpl(cause, indent, indentationLevel + 1)}`;
            }
        }
        return VError.fullStack(error).replace(MochaVErrorReporter._REPLACE_WITH_INDENT_REGEX, "\n"
            + indent.repeat(indentationLevel));
    }
}
