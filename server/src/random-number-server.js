const express = require ('express');
const app = express();
const port = 3001;

function randInt(min, max) {
    let range = max - min;
    return Math.floor(Math.random() * range) + min;
}

app.get('/', (req, res) => {
    res.send(`
        <h1>RANDOM NUMBER GENERATOR </h1> 
        <p> come @ me bruh / refresh each page below to keep the random goin'<p>    
        <li><a href="/random">Random </a></li> 
        <li><a href="/random/99">Random number with 99 </a></li> 
        <li><a href="/random/1/100">Random number from 1 to 100</a></li> 
        `);
});    

/* Visiting this route should return a JSON response with the
 * following information:
 * from: 0 (the minimum value generated)
 * to: 9 (the maximum value generated)
 * number: random number in between 'from' and 'to'.
 */
app.get('/random', (req, res) => {

    let from = 0
    let to = 9
    let number = randInt(min, max);

    res.json({
        from : from,
        to : to,
        number : number
    })
});

/* This route contains a URL parameter: 'to'. This describes the
 * maximum value for your randomly generated number.
 *
 * Visiting this route should return a JSON response with the
 * following information:
 * from: 0 (the minimum value generated)
 * to: the maximum value generated
 * number: random number in between 'from' and 'to'.
 */
app.get('/random/:to', (req, res) => {
    
    let from = 0
    let to = Number (req.params.to )
    let number = randInt(from, to);

    res.json({
        from : from,
        to : to,
        number : number
    })

});


/* Visiting this route should return a JSON response with the
 * following information:
 * from: the minimum value generated
 * to: the maximum value generated
 * number: random number in between 'from' and 'to'.
 */
app.get('/random/:from/:to', (req, res) => {

    let from =  Number (req.params.from )
    let to = Number (req.params.to )
    let number = randInt(from, to);

    res.json({
        from : from,
        to : to,
        number : number
    })
    
   
   });

app.listen(port, () => {
    console.log(`Server started on Port 3001`);
})
