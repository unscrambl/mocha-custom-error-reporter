import { reporters, Runner } from "mocha";

class MochaCustomStackTraceReporter extends reporters.Base
{
    constructor(runner: Runner)
    {
        super(runner);
        runner.on("fail", (test, error: Error) =>
        {
            error.stack = MochaCustomStackTraceReporter.stackTrace(error);
        });
    }

    public static stackTrace(error: any): string
    {
        return (typeof error.stackTrace === "function") ? error.stackTrace() : error.stack;
    }
}

export = MochaCustomStackTraceReporter;