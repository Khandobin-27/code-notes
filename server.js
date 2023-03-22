const express = require('express')
const mongoose = require('mongoose')
const favicon = require('serve-favicon');
const path = require('path');
require('dotenv').config();
const Document = require('./models/Document') 

const app = express()
const PORT = process.env.PORT || 3030; 

app.set('views', './views');
app.set('view engine', 'ejs')
app.use(express.static('public'))
//get the form data
app.use(express.urlencoded({ extended: true }))
// Serve favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.png'))) 


//database
mongoose.connect('mongodb+srv://Cluster35383:91wZ3z746j6FgDUY@cluster35383.3rog2sw.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//check the database connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


app.get('/', (req, res)=> {
const code = `Welcome to the e-notes! 

PLease explore the most efficient way of sharing notes!
Here is another line of code!`
    res.render('code-display', { code, language: 'plaintext'})
})



app.get('/new-note', (req, res) => {
    res.render('new-note')
})


app.post('/save', async (req, res)=> {
    const { value } = req.body
    try {
        const document = await Document.create({value})
        res.redirect(`/${document.id}`)
    } catch (e) {
        //save the input text in case post error
        res.render('new-note', { value })
    }
})


//get single saved document route id
app.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const document = await Document.findById(id)
        res.render('code-display', { code: document.value })
    } catch {
        res.redirect('/')
    }
})

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}...`)
})