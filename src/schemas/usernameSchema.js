import z from 'zod'

const usernameSchema = z.object({
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
    })
})

export function validateUsername(obj) {
    return usernameSchema.safeParse(obj)
}