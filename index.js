const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jerry:tj2364458@cluster0.g2sqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 오호라디야. :D')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})