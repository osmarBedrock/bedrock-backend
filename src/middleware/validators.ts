import { NextFunction, response } from 'express'
import validators from 'express-validator'

export const fieldsValidator = (req: Request, resp = response, next: NextFunction) => {
    const errors = validators.validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(404).json({
            ok: false,
            errors: errors.mapped()
        });
    }
    next();
}