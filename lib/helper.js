const fs = require('fs')
const path = require('path');

const doc = {
    baseURL: path.join(__dirname, '/../.data/')
}

const helper = {}

helper.randomIdGen = () => {
    const defaultLength= 20;

    const hash = "abcdefghijklmnopqrstuvwxyz1234567890";
    let storeId = ''
    for (let i = 0; i < defaultLength; i++) {
        storeId += hash.charAt(Math.floor(Math.random() * hash.length))
    }
    return storeId
}

helper.libraryCard = () => {
    const defaultLength= 4;

    const hash = "abcdefghijklmnopqrstuvwxyz1234567890";
    let cardId = ''
    for (let i = 0; i < defaultLength; i++) {
        cardId += hash.charAt(Math.floor(Math.random() * hash.length))
    }
    return cardId
}

// mini validation
helper.validateUser = (id, dir, filename, callback) => {
    const filePath = doc.baseURL + dir + "\\" + filename + ".json";
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (!err && data) {
            const users = JSON.parse(data)
            const result = users.filter(user => user.librarycard === id)
            callback(result)
        } else {
            console.log("Error file does not exist")
        }
    })
}

module.exports = helper;