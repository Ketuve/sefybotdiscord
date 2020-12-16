const { youNeedAWaifu } = require('../features/waifu/messages')

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    discriminator: {
        type: String,
        required: true,
    },
    at: {
        type: String,
        required: true,
    },
    trainCooldown: {
        type: Date,
        required: true,
    },
    fightCooldown: {
        type: Date,
        required: true,
    },
    availableFights: {
        type: Number,
        default: 5,
        required: true,
    },
    adventureCooldown: {
        type: Date,
        required: true,
    },
    isekaiCooldown: {
        type: Date,
        required: true,
    },
    combatsWon: {
        type: Number,
        required: true,
    },
    waifu: {
        name: String,
        attack: Number,
        defense: Number,
        health: Number,
    },
})

const userExists = async (user, prefix) => {
    const response = {}

    try {
        const discordId = user.discordId
        const userExists = await User.findOneAndUpdate({ discordId }, { username: user.username, discriminator: user.discriminator })

        if (userExists) {
            response.user = userExists
        } else {
            response.message = youNeedAWaifu(user, prefix)
        }

    } catch (e) {
        console.log(e)
        response.query = `there's been an error, please try again later!`
    }

    return response
}

const userExistsById = async (id) => {
    const response = {}

    try {
        const discordId = id
        const userExists = await User.findOne({ discordId })

        if (userExists) {
            response.user = userExists

        } else {
            response.query = `that user does not exist or doesn't have a waifu!`

        }

    } catch (e) {
        console.log(e)
        response.query = `there's been an error, please try again later!`
    }

    return response
}

const User = mongoose.model("User", userSchema)

module.exports = {
    User,
    userExists,
    userExistsById
}