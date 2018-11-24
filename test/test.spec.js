
var mocha  = require('mocha');
var stackFilter = mocha.utils.stackTraceFilter();
var assert = require('chai').assert;
var expect = require('chai').expect;
var VError = require("verror");
var MultiError = VError.MultiError;
var WError = VError.WError;
var MochaVerrorReporter = require('../built/mochaVErrorReporter.js').MochaVErrorReporter;
var fullStack = MochaVerrorReporter.fullStack;

describe("MochaVErrorReporter", () => 
{
    var indentChars = "    ";
    var indentStart = 1;
    var sampleError = new MultiError(
        [
            new WError(
                new MultiError(
                    [
                        new WError(
                            new WError("a nested error inside a nested error"),
                            "a nested error"
                        ),
                        new Error("another nested error")
                    ]
                ),
                "encapsulating a multierror"
            ),
            new WError("exists at the same level with encapsulator")
        ]
    );

    var fnOutput = fullStack(sampleError, indentChars, indentStart).replace(/\n.*\s{4}at\s.*/g, "");
    console.log(fnOutput);
    it("recursively outputs errors with correct indentation", function()
    {
        const expectedOutput =  "MultiError: first of 2 errors: encapsulating a multierror\n" +
                                "    1 of 2 suppressed errors: WError: encapsulating a multierror\n" +
                                "        caused by, MultiError: first of 2 errors: a nested error\n" +
                                "            1 of 2 suppressed errors: WError: a nested error\n" +
                                "                caused by, WError: a nested error inside a nested error\n" +
                                "            2 of 2 suppressed errors: Error: another nested error\n" +
                                "    2 of 2 suppressed errors: WError: exists at the same level with encapsulator";
        expect(fnOutput).to.equal(expectedOutput); })
});