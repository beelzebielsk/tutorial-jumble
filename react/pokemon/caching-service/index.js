/* Cacher:
 * 1.  Accept HTTP Request on behalf of another servce.
 * 2.  Pick out the protocol, and URI (without hostname) from the URL
 *     of the request.
 * 3.  Redirect (resend) the request to some other host, but with same
 *     protocol and non-host part of the URI.
 * 4.  Upon receipt of the request, store the content of the response
 *     in a dictionary, where they key is the URI "leaf", and the
 *     value is the content.
 *
 * if the same request is made again, go to the dictionary of old
 * requests instead of making a new request.
 *
 * Why do this in a separate program?
 *   The react app restarts often. I figure that the caching service
 *   should be in a separate place since restarting might kill the
 *   cached responses. I could've done something where the caching
 *   service lives inside of the react app, and it keeps writing its
 *   data to disk to keep the cached responses, then reads that data
 *   from disk when the app starts up again, but that's more work.
 *
 * Why did I not look for a pre-built version?
 *  Curiosity.
 */

let http = require('http');
let Pokedex = require('pokedex-promise-v2');
let P = new Pokedex();

let requestListener = (req, res) => {
    console.log("Received request!");
    console.log(req.headers);
    console.log(req.url);
    P.resource(req.url)
    .then(response => {
        console.log("Got response!");
        let body = JSON.stringify(response);
        res.writeHead(200, {
            'Content-Length' : body.length,
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        })
        res.end(body);
    });
}

let server = http.createServer(requestListener);
server.listen(8000);
