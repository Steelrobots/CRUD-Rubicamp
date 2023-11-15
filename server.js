const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 3000
const _dirname = path.resolve()
const datapath = path.join(_dirname, 'db', 'data.json')
const data = fs.readFileSync(datapath)
const obj = JSON.parse(data)

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('list', { data: obj })
})

app.get('/add', (req, res) => {
    res.render('add')
})
app.post('/add', (req, res) => {
    let newData = {
        name: req.body.name,
        height: req.body.height,
        weight: req.body.weight,
        birthdate: req.body.birthdate,
        married: req.body.married
    }
    if (newData.married == 'true') {
        newData.married = true
        obj.push(newData)
    } else if (newData.married == 'false') {
        newData.married = false
        obj.push(newData)
    } else if (newData.married == 'null') {
        newData.married = null
        obj.push(newData)
    }
    console.log(newData)
    fs.writeFileSync(datapath, JSON.stringify(obj, null, 3), 'utf-8')
    res.redirect('/')
})

app.get('/edit/:index', (req, res) => {
    const index = req.params.index
    const item = obj[index]
    res.render('update', { item })
})

app.post('/edit/:index', (req, res) => {
    const index = req.params.index;
    obj[index] = {
        name: req.body.name, height: req.body.height,
        weight: req.body.weight, birthdate: req.body.birthdate, married: req.body.married
    }
    if (obj[index].married == 'true') {
        obj[index].married = true
    } else if (obj[index].married == 'false') {
        obj[index].married = false
    } else if (obj[index].married == 'null') {
        obj[index].married = null
    }
    console.log(obj[index])
    fs.writeFileSync(datapath, JSON.stringify(obj, null, 3), 'utf-8')
    res.redirect('/')
})

app.get('/delete/:index', (req, res) => {
    const index = req.params.index;
    obj.splice(index, 1);
    fs.writeFileSync(datapath, JSON.stringify(obj, null, 3), 'utf-8')
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Example app listening on port : ${port}`)
})