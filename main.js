//load the 4 libraries
const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default
const GIPHY_URL = 'https://api.giphy.com/v1/gifs/search'

//configure the PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const API_KEY = process.env.API_KEY || ""; 


//create an instance of express
const app = express()

//configure handlebars
app.engine('hbs', handlebars({ defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

//configure app
app.get(['/', '/index.html'],
    (req, resp) => {
        //status 200
        resp.status(200)
        resp.type('text/html')
        resp.render('index')
    }
)


/*https://api.giphy.com/v1/gifs/search
?api_key=NSnjXDerUUQrLAJG1gPXIvY90Eudc4Nd
&q=noodles
&limit=25
&offset=0
&rating=g
&lang=en
*/

app.get('/search', 
    async (req, resp) => {
        const search = req.query['search-term']

        console.info('search-term: ', search)

     //construct the url with the query parameters
        const url = withQuery(
            GIPHY_URL,
            {
                api_key: API_KEY,
                q: search,
                limit: 10,
            }
        )

        const result = await fetch(url)
        const giphys = await result.json()
        
        console.info('giphys: \n', giphys)

        resp.status(200)
        resp.end
    }
)


if (API_KEY)
    app.listen(PORT, () => {
        console.info(`Application started on port ${PORT} at ${new Date()}`)
        console.info(`with API Key: ${API_KEY}`)
    }) 
else
    console.error('API Key is not set')


//load/mount the static resources directory
app.use(express.static(__dirname + '/static'))
