"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldsValidator = void 0;
const express_1 = require("express");
const express_validator_1 = __importDefault(require("express-validator"));
const fieldsValidator = (req, resp = express_1.response, next) => {
    const errors = express_validator_1.default.validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(404).json({
            ok: false,
            errors: errors.mapped()
        });
    }
    next();
};
exports.fieldsValidator = fieldsValidator;
