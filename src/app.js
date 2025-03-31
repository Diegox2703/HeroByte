import express from 'express'
import getDirname from './dirname.js'
import { join } from 'node:path'
import router from './routes/routes.js'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import session from 'express-session'
import { SESSION_SECRET } from './config.js'
import { RedisStore } from 'connect-redis'
import Redis from 'ioredis'
import responseTime from 'response-time'

const __dirname = getDirname()
 
const app = express()

const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379 
})

app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'views'))

app.use(express.static(join(__dirname, 'public'))) 
app.use(express.json())
app.use(cookieParser())  
app.use(session({
    name: 'user_session',
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 60000 * 60     
    },
    store: new RedisStore({ client: redisClient })
}))

app.use(passport.initialize()) 
app.use(passport.session())
app.use(responseTime())

app.use(router)  

export default app
