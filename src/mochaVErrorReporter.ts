import { reporters, Runner } from "mocha";

export class MochaVErrorReporter extends reporters.Base
{
    constructor(runner: Runner)
    {
        super(runner);
        runner.on("fail", (test, error: Error) =>
        {
            error.stack = MochaVErrorReporter.fullStack(error);
        });
    }

    public static fullStack(error: any): string
    {
        return (typeof error.stackTrace === "function") ? error.stackTrace() : error.stack;
    }

}
