const express = require('express')
const app = express()
const port = 3001

const config = require('./config/key')
const bodyParser = require('body-parser')
const { User } = require('./models/Users')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)  // 경고 메시지 제거

// 연결 옵션 설정
const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(config.mongoURI, connectOptions)
    .then(() => console.log('MongoDB Connected Successfully...'))
    .catch(err => console.log('MongoDB Connection Error:', err))
    
app.get('/', (req, res) => {
    res.send('Hello World! 오호라디야. :D')
        })


app.post('/register', (req, res) => {
    //회원 가입할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어줘야 한다.
    const user = new User(req.body)

    user.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 