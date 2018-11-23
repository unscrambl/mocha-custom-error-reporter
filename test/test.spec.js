
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
    var indentChars = "----";
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

    var fnOutput = stackFilter(fullStack(sampleError, indentChars, indentStart));
    
    it("recursively outputs errors", function(done){
        expect(fnOutput).to.include("a nested error inside a nested error");
        expect(fnOutput).to.include("a nested error");
        expect(fnOutput).to.include("another nested error");
        expect(fnOutput).to.include("encapsulating a multierror");
        expect(fnOutput).to.include("exists at the same level with encapsulator");
        expect(fnOutput).to.include("1 of 2 suppressed errors: WError: encapsulating a multierror");
        expect(fnOutput).to.include("1 of 2 suppressed errors: WError: a nested error");
        expect(fnOutput).to.include("2 of 2 suppressed errors: Error: another nested error");
        expect(fnOutput).to.include("2 of 2 suppressed errors: WError: exists at the same level with encapsulator");
        
        done();
    })

    it("formats indentation", function(done){
        expect(fnOutput).to.include(indentChars.repeat(indentStart + 0) + "1 of 2 suppressed errors: ");
        expect(fnOutput).to.include(indentChars.repeat(indentStart + 1) + "caused by, MultiError:");
        expect(fnOutput).to.include(indentChars.repeat(indentStart + 2) + "1 of 2 suppressed errors: ");
        expect(fnOutput).to.include(indentChars.repeat(indentStart + 3) + "caused by, WError:");
        expect(fnOutput).to.include(indentChars.repeat(indentStart + 2) + "2 of 2 suppressed errors: ");
        expect(fnOutput).to.include(indentChars.repeat(indentStart + 0) + "2 of 2 suppressed errors: ");
        
        done();
    });

    it("shows the deepest indentation", function(done){
        // maximum indentation should be start + 4, after the error message "a nested error inside a nested error"
        expect(fnOutput).to.include(indentChars.repeat(indentStart + 4));
        
        done();
    });
});