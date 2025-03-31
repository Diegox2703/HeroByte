import redisClient from "../redis.js"

export const getCharacterDetailsRedis = async (id) => {
    try {
        const character = await redisClient.get(`character:${id}`)
        return character
    } catch (error) {
        console.log(error)
    }
}

export const characterDetailsExist = async (id) => {
    try {
        const exist = await redisClient.exists(`character:${id}`)
        return exist
    } catch (error) {
        console.log(error)
    }
}

export const saveCharacterDetails = async (character, id) => {
    try {
        await redisClient.setEx(`character:${id}`, 3600, JSON.stringify(character))
    } catch (error) {
        console.log(error)
    }
}

export const deleteCharacterDetails = async (id) => {
    try {
        await redisClient.del(`character:${id}`)
    } catch (error) {
        console.log(error)
    }
}

export const getUserProfileRedis = async (username) => {
    try {
        const userProfile = await redisClient.get(`userProfile:${username}`)
        return userProfile
    } catch (error) {   
        console.log(error)
    }
}

export const userProfileExist = async (username) => {
    try {
        const exist = await redisClient.exists(`userProfile:${username}`)
        return exist
    } catch (error) {
        console.log(error)
    }
}

export const saveUserProfile = async (userProfile, username) => {
    try {
        await redisClient.setEx(`userProfile:${username}`, 3600, JSON.stringify(userProfile))
    } catch (error) {
        console.log(error)
    }
}
