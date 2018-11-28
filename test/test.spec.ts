
import { expect } from "chai";
import { MochaVErrorReporter } from "../src/mochaVErrorReporter";

describe("MochaVErrorReporter", () =>
{

    class ExampleErrorWithStackTrace extends Error
    {
        stackTraceString: string;
        stackTrace = () => {
            return this.stackTraceString;
        }
        
        constructor(stackTrace: string)
        {
            super("example error");
            this.stackTraceString = stackTrace;
        }

    }

    it("outputs the correct information when there is a 'stackTrace' function",  () =>
    {
        const testStackMessage = "example stack trace";
        const sampleError = new ExampleErrorWithStackTrace(testStackMessage);
        const fnOutput = MochaVErrorReporter.fullStack(sampleError);
        expect(fnOutput).to.equal(testStackMessage); 
    });

    it("outputs the correct information when there is not a 'stackTrace' function",  () =>
    {
        const testStackMessage = "example stack trace";
        const sampleError = new Error(testStackMessage);
        const fnOutput = MochaVErrorReporter.fullStack(sampleError);
        expect(fnOutput).to.not.equal(testStackMessage);
    });
});
