import { Runner } from "mocha";
export declare class MochaVErrorReporter extends Mocha.reporters.Base {
    private static _DEFAULT_INDENT;
    private static _REGEX_REMOVE_REPEATED_MESSAGE;
    private static _REGEX_REPLACE_WITH_INDENT;
    constructor(runner: Runner);
    static fullStack(error: any, indent?: string, indentLevel?: number): any;
}
