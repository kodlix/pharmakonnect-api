// /* eslint-disable prettier/prettier */
// import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
// import { ValidationException } from "./validation.exception";

// @Catch(ValidationException,HttpException)
// export class ValidationFilter implements ExceptionFilter{
//     catch(exception: ValidationException, host: ArgumentsHost):any {
//         const ctx = host.switchToHttp(),
//             resonse = ctx.getResponse();

//         return resonse.status(400).json({
//             statusCode:400,
//             createdBy: "ValidationFilter",
//             ValidationError: exception.validationError

//         });
        
//     }
    
// }