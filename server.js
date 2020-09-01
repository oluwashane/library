const http = require("http");
const url = require("url");
const { StringDecoder } = require('string_decoder');
const routeHandler = require('./lib/routehandler');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    const trimmedPath = pathName.replace(/^\/+|\/+$/g, "")
    const queryObject = parsedUrl.query;
    const method = req.method.toLowerCase();
    const headers = req.headers

    const decoder = new StringDecoder('utf-8');
    let buffer = ''
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    req.on('end', () => {
        buffer += decoder.end()
        const parsedPayLoad = JSON.parse(buffer);
        
        const data = {
            trimmedPath: trimmedPath,
            query: queryObject,
            method: method,
            headers: headers,
            payload: parsedPayLoad
        }

        // console.log(parsedUrl)

        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notFound
        chosenHandler(data, (statusCode, result) => {
            statusCode = typeof (statusCode) === 'number'? statusCode : 200;
            result = typeof (res) === 'object'? result : {}

            const responseObj = JSON.stringify(result)
            
            res.setHeader("content-type", "application/json")
            res.writeHead(statusCode)
            res.write(responseObj)
            res.end()
        })
        
    })
})

const PORT = 8080
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const router = {
    ping: routeHandler.ping,
    books: routeHandler.Books,
    borrow: routeHandler.Borrow,
    user: routeHandler.Users,
    notFound: routeHandler.notFound
}
