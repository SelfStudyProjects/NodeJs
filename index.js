const express = require('express')
const app = express()
const port = 3001
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const bodyParser = require('body-parser')
const { User } = require('./models/Users')
const { auth } = require('./middleware/auth')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
}

mongoose.connect(config.mongoURI, connectOptions)
    .then(() => console.log('MongoDB Connected Successfully...'))
    .catch(err => console.log('MongoDB Connection Error:', err))
    
app.get('/', (req, res) => {
    res.send('Hello World! 오호라디야. :D')
        })

app.post('/api/users/register', (req, res) => {
    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if(err) return res.json({ success: false, err });
        if(existingUser) {
            return res.json({
                success: false,
                message: "이미 사용 중인 이메일입니다."
            });
        }

        const user = new User(req.body);
        user.save((err, doc) => {
            if(err) {
                console.log('Save Error:', err);
                return res.json({ success: false, err });
            }
            return res.status(200).json({
                success: true,
                userData: doc
            });
        });
    });
})

app.post('/api/users/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({ 
                    loginSuccess: false, 
                    message: "비밀번호가 틀렸습니다." 
                });
            }

            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                
                res.cookie("x_auth", user.token)
                   .status(200)
                   .json({ 
                       loginSuccess: true, 
                       userId: user._id 
                   });
            });
        });
    });
})

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 