# mocha-custom-stack-trace-reporter

This library can be used as a mocha plug-in to report custom stack traces for errors. If the error object that escapes from a test has a 'stackTrace()' function, then this function is called to retrieve the stack trace and report it.
