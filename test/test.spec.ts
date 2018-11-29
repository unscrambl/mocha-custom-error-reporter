import { expect } from "chai";

var MochaCustomStackTraceReporter = require("../src/mochaCustomStackTraceReporter");

describe("MochaCustomStackTraceReporter", () =>
{
    class ErrorWithExternalStackTrace extends Error
    {
        private readonly stackTrace_: string;
        
        constructor(stackTrace: string)
        {
            super("example error");
            this.stackTrace_ = stackTrace;
        }

        public stackTrace(): string
	    {
            return this.stackTrace_;
        }
    }

    class DerivedFromErrorWithExternalStackTrace extends ErrorWithExternalStackTrace
    {
        constructor(stackTrace: string)
        {
            super(stackTrace);
        }
    }

    it("outputs the correct value when there is a 'stackTrace' function in the error class", () =>
    {
        const testStackTrace = "external stack trace";
        const sampleError = new ErrorWithExternalStackTrace(testStackTrace);
        const actualStackTrace = MochaCustomStackTraceReporter.stackTrace(sampleError);
        expect(actualStackTrace).to.equal(testStackTrace); 
    });

    it("outputs the correct value when there is a 'stackTrace' function in the parent error class", () =>
    {
        const testStackTrace = "external stack trace";
        const sampleError = new DerivedFromErrorWithExternalStackTrace(testStackTrace);
        const actualStackTrace = MochaCustomStackTraceReporter.stackTrace(sampleError);
        expect(actualStackTrace).to.equal(testStackTrace); 
    });

    it("outputs the correct value when there is no 'stackTrace' function", () =>
    {
        const testStackTrace = "external stack trace";
        const sampleError = new Error(testStackTrace);
        const actualStackTrace = MochaCustomStackTraceReporter.stackTrace(sampleError);
        expect(actualStackTrace).to.not.equal(testStackTrace);
    });
});
