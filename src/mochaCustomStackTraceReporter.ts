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
                console.log("ERROR: the execution failed due to an unhandled promise rejection, details: %s", reason.stack || reason);
                process.exit(process.exitCode | 100);
            });
        });
    }

    public static stackTrace(error: any): string
    {
        return (typeof error.stackTrace === "function") ? error.stackTrace() : error.stack;
    }
}

export = MochaCustomStackTraceReporter;
