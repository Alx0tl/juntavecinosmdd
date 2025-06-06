"use strict";

import Joi from "joi";

const domainEmailValidator = (value, helpers) => {
  if (!value.endsWith("@gmail.com") && !value.endsWith("@gmail.cl")) {
    return helpers.message(
      "El correo electrónico debe finalizar en @gmail.com o @gmail.cl."
    );
  }
  return value;
};

export const registerValidation = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .pattern(/^[a-zA-Z0-9_]+$/)
        .messages({
            "string.pattern.base":
                "El nombre de usuario solo puede contener letras, números y guiones bajos.",
            "string.min": "El nombre de usuario debe tener al menos 3 caracteres.",
            "string.max": "El nombre de usuario no puede exceder los 30 caracteres.",
            "string.empty": "El nombre de usuario es obligatorio.",
        }),
    rut: Joi.string()
        .required()
        .min(9)
        .max(12)
        .pattern(
            /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/
        )
        .messages({
            "string.empty": "El rut no puede estar vacío.",
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base":
                "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
        }),
    email: Joi.string()
        .email()
        .required()
        .min(15)
        .max(50)
        .messages({
            "string.email": "El correo electrónico debe ser válido.",
            "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
            "string.max": "El correo electrónico no puede exceder los 50 caracteres.",
            "string.empty": "El correo electrónico es obligatorio.",
        })
        .custom(
            domainEmailValidator,
            "Validación de dominio de correo electrónico"
        ),
    password: Joi.string()
        .min(8)
        .max(26)
        .pattern(/^[a-zA-Z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]+$/)
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "any.required": "La contraseña es obligatorio.",
            "string.base": "La contraseña debe ser de tipo texto.",
            "string.min": "La contraseña debe tener al menos 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base":
                "La contraseña solo puede contener letras, números y caracteres especiales.",
        }),
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales",
});

export const loginValidation = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "El correo electrónico debe ser válido.",
            "string.empty": "El correo electrónico es obligatorio.",
        }).custom(
            domainEmailValidator,
            "Validación de dominio de correo electrónico"
        ),
    password: Joi.string()
        .min(8)
        .max(26)
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "any.required": "La contraseña es obligatoria.",
            "string.min": "La contraseña debe tener al menos 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
        }),
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales",
});
