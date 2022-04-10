// Code from https://github.com/Draconizations/pk-webs-svelte/blob/main/src/api/errors.ts (MIT License)

// Define an enum that contains handled error codes
// https://www.typescriptlang.org/docs/handbook/enums.html
enum ErrorType {
    Unknown = 0,
    InvalidToken = 401,
    NotFound = 404,
    InternalServerError = 500,
}

// ApiError object with optional message and data properties
// https://www.typescriptlang.org/docs/handbook/2/objects.html
interface ApiError {
    code: number,
    type: ErrorType,
    message?: string,
    data?: any,
}

// Export parsing function to be used elsewhere
export function parse(code: number, data?: any): ApiError {
    // Declare error type using the ErrorType enum
    var type = ErrorType[ErrorType[code]] ?? ErrorType.Unknown;
    // Good ol ISEs
    if (code >= 500) type = ErrorType.InternalServerError;

    // Create an err variable using the ApiError interface with the code and type from ^
    var err: ApiError = { code, type };

    // If data is passed by the parse() call, assign its contents to err
    if (data) {
        var d = data;
        err.message = d.message;
        err.data = d;
    }

    return err;
}