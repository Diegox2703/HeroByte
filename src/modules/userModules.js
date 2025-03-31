import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'
import { pool } from '../db.js'

export const createUser =  async (user) => {
    const { username, email, password } = user
    const userId = uuidv4()

    try {
        await pool.query('INSERT INTO users (user_id, username, email, password) VALUE (?, ?, ?, ?)', [userId, username, email, password])
        return userId
    } catch(err) {
        console.log(err)
    }
}

export const createThirdPartyUser = async (id, email) => {
    try {
        await pool.query('INSERT INTO users (user_id, email) VALUES (?, ?)', [id, email])
    } catch(err) {
        console.log(err)
    }
}

export const getUsername = async (username) => {
    try {
        const [result] = await pool.query('SELECT username FROM users WHERE username = ?', [username])
        return result[0]
    } catch(err) {
        console.log(err)
    }
}

export const getEmail = async (email) => {
    try {
        const [result] = await pool.query('SELECT email FROM users WHERE email = ?', [email])
        return result[0]
    } catch(err) {
        console.log(err)
    }
}

export const getUserCredentials = async (username) => {
    try {
        const [result] = await pool.query('SELECT user_id, username, password FROM users WHERE username = ?', [username])
        return result[0]
    } catch(err) {
        console.log(err)
    }
}

export const getUserById = async (id) => {
    try {
        const [result] = await pool.query('SELECT username, user_img FROM users WHERE user_id = ?', [id])
        return result[0]
    } catch(err) {
        console.log(err)
    }
}

export const updateUsername = async (username, id) => {
    try {
        await pool.query('UPDATE users SET username = ? WHERE user_id = ?', [username, id])
    } catch(err) {
        console.log(err)
    }
}

export const createCharacterWithGame = async (character, userId, gameName) => {
    const { character_name, description, creator, character_img } = character
    const character_id = uuidv4()
    const gameId = nanoid()

    let connection;

    try {
        connection = await pool.getConnection()

        await connection.beginTransaction()

        await connection.query('INSERT INTO games (game_id, game_name) VALUES (?, ?)', [gameId, gameName])
        
        await connection.query(`
            INSERT INTO characters 
            (character_id, user_id, character_name, description, creator, game_id, character_img)
            VALUES(?, ?, ?, ?, ?, ?, ?)
        `,
        [character_id, userId, character_name, description, creator, gameId, character_img]
        )

        await connection.commit()
    } catch(err) {
        console.log(err)
        connection.rollback()
    }
}

export const createCharacter = async (character, userId, gameId) => {
    const { character_name, description, creator, character_img } = character
    const character_id = uuidv4()

    try {
        await pool.query(`
            INSERT INTO characters 
            (character_id, user_id, character_name, description, creator, game_id, character_img)
            VALUES(?, ?, ?, ?, ?, ?, ?)
        `,
        [character_id, userId, character_name, description, creator, gameId, character_img]
        )
    } catch(err) {
        console.log(err)
    }
}

export const getGameById = async (gameName) => {
    try {
        const [gameId] = await pool.query('SELECT game_id FROM games WHERE game_name = ?', [gameName])
        return gameId[0]
    } catch(err) {
        console.log(err)
    }
}

export const getGames = async () => {
    try {
        const [game] = await pool.query('SELECT game_name FROM games;')
        return game
    } catch(err) {
        console.log(err)
    }
}

export const getGameByName = async (gameName) => {
    let name = `%${gameName}%`
    try {
        const [game] = await pool.query('SELECT game_name FROM games WHERE game_name LIKE ?;', [name])
        return game
    } catch(err) {
        console.log(err)
    }
}

export const getCharacters = async (limit) => {
    try {
        const [characters] = await pool.query(`
            SELECT character_id, character_img, character_name FROM characters ORDER BY createdAt DESC LIMIT ?;
        `, [limit])
        return characters
    } catch(err) {
        console.log(err)
    }
}

export const getCharactersByGame = async (gameName, limit, order) => {
    try {
        const [characters] = await pool.query(`
            SELECT character_id, character_img, character_name, game_name FROM characters 
            JOIN games ON characters.game_id = games.game_id
            WHERE game_name = ?
            ORDER BY createdAt ${order}
            LIMIT ?;    
        `, [gameName, limit])
        
        return characters
    } catch(err) {
        console.log(err)
    }
}

export const getCharacterDetails = async (id) => {
    try {
        const [character] = await pool.query(`
            SELECT character_id, username, character_img, character_name, description, creator, game_name FROM users
            JOIN characters ON characters.user_id = users.user_id
            JOIN games ON characters.game_id = games.game_id
            WHERE character_id = ?;    
        `, [id])

        return character[0]
    } catch(err) {
        console.log(err)
    }   
}

export const getCharacterDetailsToUpdate = async (id, username) => {
    try {
        const [character] = await pool.query(`
            SELECT character_id, username, character_img, character_name, description, creator, game_name FROM users
            JOIN characters ON characters.user_id = users.user_id
            JOIN games ON characters.game_id = games.game_id
            WHERE character_id = ? AND username = ?;    
        `, [id, username])

        return character[0]
    } catch(err) {
        console.log(err)
    }   
}

export const getUserProfile = async (username) => {
    try {
        const [userProfile] = await pool.query(`
            SELECT username, email, user_img, character_id, character_img, character_name FROM users
            LEFT JOIN characters ON characters.user_id = users.user_id
            WHERE username = ? ORDER BY createdAt DESC;    
        `, [username])

        return userProfile
    } catch(err) {
        console.log(err)
    }
}

export const updateCharacterWithGame = async (character, characterId, gameName) => {
    const { character_name, description, creator, character_img } = character
    const gameId = nanoid()

    try {
        let connection = await pool.getConnection()
        
        await connection.query(`INSERT INTO games (game_id, game_name) VALUES (?, ?)`, [gameId, gameName])

        await connection.query(`
            UPDATE characters SET character_name = ?, description = ?, creator = ?, game_id = ?, character_img = ? 
            WHERE character_id = ?;    
        `, [character_name, description, creator, gameId, character_img, characterId])

        await connection.commit()
    } catch(err) {
        console.log(err)
        connection.rollback()
    }
}

export const updateCharacter = async (character, characterId, gameId) => {
    const { character_name, description, creator, character_img } = character
    try {
        await pool.query(`
            UPDATE characters SET character_name = ?, description = ?, creator = ?, game_id = ?, character_img = ? 
            WHERE character_id = ?;    
        `, [character_name, description, creator, gameId, character_img, characterId])
    } catch(err) {
        console.log(err)
    }
}

export const getCharactersByName = async (characterName) => {
    let name = `%${characterName}%`
    try {
        const [characters] = await pool.query(`
            SELECT character_id, character_img, character_name FROM characters WHERE character_name LIKE ?;    
        `, [name])

        return characters
    } catch(err) {
        console.log(err)
    }
}

export const updateProfileImg = async (profileImg, userId) => {
    try {
        await pool.query('UPDATE users SET user_img = ? WHERE user_id = ?;', [profileImg, userId])
    } catch(err) {
        console.log(err)
    }
}

export const deleteCharacter = async (characterId) => {
    try {
        await pool.query('DELETE FROM characters WHERE character_id = ?', [characterId])
    } catch(err) {
        console.log(err)
    }
}
