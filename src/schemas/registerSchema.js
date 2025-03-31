import z from 'zod'

const registerSchema = z.object({
    username: z.string({
        message: 'Escriba un string'
    }).min(6, {
        message: 'El usuario debe tener un minimo de 6 caracteres'
    }).max(12, {
        message: 'El usuario debe tener un maximo de 12 caracteres'
    }).regex(/[A-Z]/, {
        message: 'El usuario debe tener al menos una mayuscula'
    }).regex(/[0-9]/, {
        message: 'El usuario debe tener al menos un numero'
    }),
    email: z.string({
        message: 'El email debe ser un string'
    }).email({
        message: 'Escriba un email valido'
    }),
    password: z.string({
        message: 'La contraseña debe ser un string'
    }).min(8, {
        message: 'La contraseña debe tener un minimo de 8 caracteres'
    }).max(15, {
        message: 'La contraseña debe tener un maximo de 15 caracteres'
    }).regex(/[A-Z]/, {
        message: 'La contraseña debe tener al menos una letra Mayuscula'
    }).regex(/[0-9]/, {
        message: 'La contraseña debe tener al menos un numero'
    }).regex(/[@$!%*?&]/, {
        message: 'La contraseña debe tener al menos un caracter especial: (@, $, !, %, *, ?, &)'
    })
})

export function validateRegister(obj) {
    return registerSchema.safeParse(obj)
}