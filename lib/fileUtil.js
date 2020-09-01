const path = require("path");
const fs = require("fs");
const helper = require("./helper")
const lib = {
    baseURL: path.join(__dirname, '/../.data/')
}
// methods in lib  create, read, update, delete;
lib.create = (dir, fileName, parentData, callback) => {
    var filePath = lib.baseURL + dir + "\\" + fileName + ".json";
    fs.open(filePath, "r", (err, fd) => {
        if (!err && fd) {
            fs.readFile(fd, 'utf-8', (err, data) => {
                if(!err && data) {
                    const parseData = JSON.parse(data);
                    const obj = [...parseData];
                    const id = helper.randomIdGen()
                    parentData["id"] = id
                    obj.push(parentData)
                    const wData = JSON.stringify(obj);
                    fs.writeFile(filePath, wData, (err) => {
                        if (!err) {
                            fs.close(fd, (err) => {
                                if(!err) {
                                    callback(false, parentData)
                                } else {
                                    callback("failed to close file")
                                }
                            })
                        } else {
                            callback("Error failed to write to file")
                        }
                    })
                } else {
                    callback("Error occurred while reading file")
                }
            })
        } else {
            callback("Error file does not exist.")
        }  
    })
}

lib.read = (dir, filename, callback) => {
    const filePath = lib.baseURL + dir + "\\" + filename + ".json";
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (!err && data) {
            callback(false, JSON.parse(data))
        } else {
            callback(err, data)
        }
    })
}

lib.update = (dir, filename, data, callback) => {
    const filePath = lib.baseURL + dir + "\\" + filename + ".json";
    const bookId = data.id
    const update = data.update 
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (!err && data) {
            const db = JSON.parse(data);
            let validate
            const helper = db.map(data => {
                validate = (data.id === bookId) ? {...data, ...update} : null
                return {...data, ...validate}
            })
            fs.writeFile(filePath, JSON.stringify(helper), (err) => {
                if (!err) {
                    callback(false, validate)
                } else {
                    callback("Error could not write file.")
                }
            })
        } else {
            callback(err, data)
        }
    })
}

lib.delete = (dir, filename, id, callback) => {
    const filePath = lib.baseURL + dir + "\\" + filename + ".json";
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (!err && data) {
            const db = JSON.parse(data);
            const newData = db.filter(data => data.id !== id)
            fs.writeFile(filePath, JSON.stringify(newData), (err) => {
                if(!err) {
                    callback(false)
                } else {
                    callback(err)
                }
            })
            // bug fix show err if id not found
        } else { 
            callback(err, data)
        }
    })
}

// Borrow section handles everything about borrowing and returning of book

lib.borrowbook = (dir, filename, parentData, callback) => {
    const filePath = lib.baseURL + dir + "\\" + filename + ".json";
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (!err && data) {
            const db = JSON.parse(data);
            const updatedQuantity = db.find(data => {
                if (data.name.toLowerCase() == parentData.toLowerCase()) {
                    data.copies -= 1;
                    return data
                }
            })
            if (updatedQuantity && updatedQuantity.copies >= 0) {
                const requestedBook = { name:updatedQuantity.name, author:updatedQuantity.author, publisher:updatedQuantity.publisher, price:updatedQuantity.price };
                fs.writeFile(filePath, JSON.stringify(db), (err) => {
                    if (!err) {
                        callback(false, requestedBook)
                    } else {
                        callback("Error could not write file.")
                    }
                })
            } else {
                callback("Error book not found or out of stock")
            }
        } else {
            callback(err, data)
        }
    })
}

lib.returnbook = (dir, filename, parentData, callback) => {
    const filePath = lib.baseURL + dir + "\\" + filename + ".json";
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (!err && data) {
            const db = JSON.parse(data);
            const updatedQuantity = db.find(data => {
                if (data.name.toLowerCase() == parentData.toLowerCase()) {
                    data.copies += 1; 
                    return data
                }
            })
            if (updatedQuantity && updatedQuantity.copies >= 0) {
                const requestedBook = { name:updatedQuantity.name, author:updatedQuantity.author, publisher:updatedQuantity.publisher };
                fs.writeFile(filePath, JSON.stringify(db), (err) => {
                    if (!err) {
                        callback(false, requestedBook)
                    } else {
                        callback("Error could not write file.")
                    }
                })
            } else {
                callback("Error book not found or out of stock")
            }
        } else {
            callback(err, data)
        } 
    })
}



module.exports = lib
