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

        runner.on("start", () => {
            process.on("unhandledRejection", (reason, promise) => {
                // we are throwing an error here to avoid the process exiting with 0 exit code and not running subsequent
                // tests in case of an unhandled promise rejection
                var reason_stack_or_reason = reason.stack || reason
                throw new Error(`the execution failed due to an unhandled promise rejection, details: ${reason_stack_or_reason}`);
            });
        });
    }

    public static stackTrace(error: any): string
    {
        return (typeof error.stackTrace === "function") ? error.stackTrace() : error.stack;
    }
}

export = MochaCustomStackTraceReporter;
