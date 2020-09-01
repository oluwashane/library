const helper = require("./helper")
const fileUtil = require("./fileUtil")
const routeHandler = {}

routeHandler.Books = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        routeHandler._book[data.method](data, callback)
    } else {
        callback(405)
    }
    
}

//main book route object
routeHandler._book = {};

routeHandler._book.post = (data, callback) => {
    const name = typeof (data.payload.name) === "string" && data.payload.name.trim().length > 0 ? data.payload.name : false;
    const author = typeof (data.payload.author) === "string" && data.payload.author.trim().length > 0 ? data.payload.author : false;
    const publisher = typeof (data.payload.publisher) === "string" && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
    typeof (data.payload.copies) === "number" ? data.payload.copies : 0;
    if (name && price && author && publisher) {
        const fileName = "book"
        fileUtil.create("library", fileName, data.payload, (err) => {
            if (!err) {
                callback(200, { response: "book stored successfully"})
            } else {
                callback(400, {response: ""})
            }
        })
    } else {
        callback(400, {response: "The book's name, author, publisher must be provided"})
    }
}

routeHandler._book.get = (callback) => {
    const fileName = "book";
    fileUtil.read('library', fileName, (err, data) => {
        if (!err && data) {
            callback(200, { response: 'book retrieved', data: data });
        } else {
            callback(404, { err: err, data: data, message: 'could not retrieve book' });
        }
    });
}

routeHandler._book.put = (data, callback) => {
    const filename = "book";
    const newData = { id:data.query.id, update:data.payload};
    if(data.query.id) {
        fileUtil.update("library", filename, newData, (err,data) => {
            if (!err) {
                callback(200, {message: "Book updated successfully", data})
            } else {
                callback(400, "Error could not update book")
            }
        })
    }
}

routeHandler._book.delete = (data, callback) => {
    if (data.query.id) {
        const filename = 'book'
        fileUtil.delete('library', filename, data.query.id, (err, data) => {
            if (!err) {
                callback(200, { message: "Book deleted", data: data })
            } else {
                callback(404, { message: "Book not found" })
            }
        })
    } else {
        callback(400, { message: "Error Invalid Id" })
    }
}

routeHandler.Borrow = (data, callback) => {
    const acceptableMethods = ['post', 'put'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        routeHandler._borrow_book[data.method](data, callback)
    } else {
        callback(405, { message: "Error method not allowed" })
    }
}

// endpoint that handles collecting books from the library
routeHandler._borrow_book = {}

routeHandler._borrow_book.post = (data, callback)=> {
    const librarycard = data.payload.librarycard
    const title = data.payload.title
    if (librarycard && title) {
        helper.validateUser(librarycard, 'library', 'user', (data) => {
            console.log(data)
            if(data.length > 0) {
                const filename = "book";
                fileUtil.borrowbook('library', filename, title, (err, res) => {
                    if (!err) {
                        callback(200, {message: "request successful", data: res })
                    } else {
                        callback(404, {message: "Error book not found"})
                    }
                })
            } else {
                callback(403, { message: "Error in validation" })
            }
        })
    } else {
        callback(400, {message: "Error some query missing"})
    }
}

// handles return of borrowed book
routeHandler._borrow_book.put = (data, callback)=> {
    const librarycard = data.payload.librarycard
    const title = data.payload.title
    if (librarycard && title) {
        helper.validateUser(librarycard, 'library', 'user', (data) => {
            if(data.length > 0) {
                const filename = "book";
                fileUtil.returnbook('library', filename, title, (err, res) => {
                    if (!err) {
                        callback(200, {message: "Book returned successfully", data: res })
                    } else {
                        callback(404, {message: "Error book not found"})
                    }
                })
            } else {
                callback(403, { message: "Error in validation" })
            }
        })
    } else {
        callback(400, {message: "Error some query missing"})
    }
}

// user Handler
routeHandler.Users = (data, callback) => {
    const acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        routeHandler._user[data.method](data, callback)
    } else {
        callback(405, { message: "Error method not allowed" })
    }
    
}

routeHandler._user = {}

routeHandler._user.post = (data, callback) => {
    const name = typeof (data.payload.name) === "string" && data.payload.name.trim().length > 0 ? data.payload.name : false;
    const department = typeof (data.payload.department) === "string" && data.payload.department.trim().length > 0 ? data.payload.department : false;
    if (name && department) {
        const librarycard = helper.libraryCard()
        const userData = { name, department, librarycard }
        const filename = 'user'
        fileUtil.create('library', filename, userData, (err, data) => {
            if (!err) {
                callback(200, { message: "Account created successfully", data })
            } else {
                callback(500, {message: "our servers are down"})
            }
        })
    } else {
        callback(400, {message: "Error Invalid Data"})
    }
    
}

routeHandler.ping = (data, callback) => {
    callback(200, { response: "server is live" })
}

routeHandler.notFound = (data, callback) => {
    callback(404, { response: 'page not found' })
}

module.exports = routeHandler
