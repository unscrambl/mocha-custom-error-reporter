
import { expect } from "chai";
import * as VError from "verror";
import { MochaVErrorReporter } from "../src/mochaVErrorReporter";
const fullStack = MochaVErrorReporter.fullStack;

describe("MochaVErrorReporter", () =>
{
    const indentChars = "    ";
    const sampleError = new VError.MultiError(
        [
            new VError.WError(
                new VError.MultiError(
                    [
                        new VError.WError(
                            new VError.WError("a nested error inside a nested error"),
                            "a nested error"
                        ),
                        new Error("another nested error")
                    ]
                ),
                "encapsulating a multierror"
            ),
            new VError.WError("exists at the same level with encapsulator")
        ]
    );

    const fnOutput = fullStack(sampleError, indentChars).replace(/\n.*\s{4}at\s.*/g, "");

    it("recursively outputs errors with correct indentation",  () =>
    {
        const expectedOutput =  "MultiError: with 2 suppressed errors:\n" +
            "    error #1/2: WError: encapsulating a multierror\n" +
            "        caused by, MultiError: with 2 suppressed errors:\n" +
            "            error #1/2: WError: a nested error\n" +
            "                caused by, WError: a nested error inside a nested error\n" +
            "            error #2/2: Error: another nested error\n" +
            "    error #2/2: WError: exists at the same level with encapsulator";
        expect(fnOutput).to.equal(expectedOutput); });
});
