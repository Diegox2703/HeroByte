import multer from 'multer'
import getDirname from '../dirname.js'
import { extname, join } from 'node:path'

const __dirname = getDirname()

const uploadCharacter = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, join(__dirname, 'public', 'uploads', 'characterImg')) 
        },
        filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${Math.round(Math.random()*1E9)}${extname(file.originalname)}`
            cb(null, fileName)
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) return cb(new Error('Archivo no valido'), false)
        cb(null, true)
    } 
})

export const uploadCharacterMiddleware = (req, res, next) => {
    uploadCharacter.single('character_image')(req, res, (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({error: 'INVALID_FORMAT', errorMessage: 'Formato de imagen invalida'})
        }
        next()
    })
}

const uploadProfileImg = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, join(__dirname, 'public', 'uploads', 'profileImg')) 
        },
        filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${Math.round(Math.random()*1E9)}${extname(file.originalname)}`
            cb(null, fileName)
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) return cb(new Error('Archivo no permitido', false))
        cb(null, true) 
    } 
})

export const uploadProfileImgMiddleware = (req, res, next) => {
    uploadProfileImg.single('profile-image')(req, res, (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({error: 'INVALID_FORMAT', errorMessage: 'Formato de imagen invalido'})
        }
        next()
    })
}
