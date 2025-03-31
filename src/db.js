import mysql from 'mysql2/promise'
import { MYSQL_HOST, MYSQL_USER, MYSQL_DB, MYSQL_PASSWORD, MYSQL_PORT } from './config.js'

export const pool = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    port: MYSQL_PORT
})