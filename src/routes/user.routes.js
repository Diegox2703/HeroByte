import { Router } from 'express'
import * as userControllers from '../controllers/user.controller.js'
import { authCreateNewUsername, authUser, isAuthenticated } from '../middlewares/authMiddleware.js'
import passport from 'passport'
import '../strategies/google-strategy.js'
import { uploadCharacterMiddleware, uploadProfileImgMiddleware } from '../middlewares/multer.js'

const router = Router()

// Rutas Get

router.get('/login', isAuthenticated, userControllers.getLoginPage)
router.get('/register', isAuthenticated, userControllers.getRegisterPage)
router.get('/home', authUser, userControllers.getHomePage)
router.get('/characters', authUser, userControllers.getCharactersPage)
router.get('/character/:id', userControllers.getCharacterDetailsController)
router.get('/create', authUser, userControllers.getCreatePage)
router.get('/profile/:username', authUser, userControllers.getProfilePage)
router.get('/new/username', authCreateNewUsername, userControllers.getNewUsername)
router.get('/errorPage', userControllers.getErrorPage)
router.get('/update/:id', authUser, userControllers.getUpdatePage)
router.get('/search/:game', authUser, userControllers.searchGame)

// Post

router.post('/login', userControllers.loginValidation)
router.post('/register', userControllers.registerValidation)
router.post('/validate/username', userControllers.usernameValidation)
router.post('/logout', userControllers.closeSession)  
router.post('/new/character', authUser, uploadCharacterMiddleware, userControllers.characterValidation)
router.post('/search/character', authUser, userControllers.searchCharacters)
router.post('/upload/image', authUser, uploadProfileImgMiddleware, userControllers.validateProfileImg)

// Update

router.patch('/update/:id', authUser, uploadCharacterMiddleware, userControllers.updateCharacter)

// Delete

router.delete('/delete/character', authUser, userControllers.deleteCharacter)

// Passport

router.get('/auth/register/google', passport.authenticate('google-register-strategy'))
router.get('/auth/google/register/redirect', userControllers.handleStrategy('google-register-strategy')) 
router.get('/auth/login/google', passport.authenticate('google-login-strategy'))
router.get('/auth/google/login/redirect', userControllers.handleStrategy('google-login-strategy')) 
 
export default router