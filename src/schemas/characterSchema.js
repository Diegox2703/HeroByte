import z from 'zod'

const characterSchema = z.object({
    character_name: z.string({
        message: 'El personaje debe ser un string'
    }).min(3, {
        message: 'El personaje debe tener al menos 3 caracteres'
    }).max(30, {
        message: 'El personaje debe tener maximo 30 caracteres'
    }),
    description: z.string({
        message: 'La descripcion debe ser un string'
    }).min(20, {
        message: 'La descripcion debe tener al menos 20 caracteres'
    }).max(2000, {
        message: 'La descripcion debe tener maximo 2000 caracteres'
    }),
    creator: z.string({
        message: 'El creador debe ser un string'
    }).min(5, {
        message: 'El creador debe tener al menos 5 caracteres'
    }).max(30, {
        message: 'El creador debe tener maximo 30 caracteres'
    }),
    game: z.string({
        message: 'El juego debe ser un string'
    }).min(3, {
        message: 'El juego debe tener al menos 3 caracteres'
    }).max(30, {
        message: 'El juego debe tener maximo 30 caracteres'
    })
})

export function validateCharacter(obj) {
    return characterSchema.safeParse(obj)
}