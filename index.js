const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const app = express();
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
app.use(bodyParser.urlencoded({ extended: true }));
const JWT_SECRET = "4c0d608098b78d61cf5654965dab8b53632bf831dc6b43f29289411376ac107b";
const authenticateToken = require("./auth")

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});
app.use(express.json())

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const isUser = await prisma.user.findUnique({
            where: { email }
        });
        if (isUser) {
            res.status(400).send({ message: 'Email already exist.' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        res.status(200).send({ data: user, message: 'User registered successfully!' });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "something went wrong"
        })
    }
});

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(400).send({
                message: 'Invalid email or password.'
            });
            return;
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.send('Invalid email or password.');
            return;
        }
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "180000000s" })
        res.cookie('userId', user.id);
        res.cookie('email', user.email);
        res.cookie('token', token);
        res.status(200).send({ data: { user, token }, message: "User authenticated successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "something went wrong"
        })
    }

});

app.get('/movies', async (req, res) => {
    res.sendFile(__dirname + '/movies.html');
})

app.post('/movies', authenticateToken, async (req, res) => {
    try {
        const { movieName, rating, cast, genre, releaseDate, userId } = req.body;
        const movie = await prisma.movie.create({
            data: {
                movieName,
                rating: rating,
                cast: { set: cast },
                genre,
                releaseDate: releaseDate,
                user: { connect: { id: userId } } // Connect the movie to the user
            }
        });
        res.status(200).send({ data: movie, message: "movies added successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "something went wrong"
        })
    }

});

app.get('/movies/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const movies = await prisma.movie.findMany({
            where: { userId }
        });
        res.status(200).send({ data: movies, message: "movies fetched successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "something went wrong" });
    }

});

app.put('/movies/:movieId', authenticateToken, async (req, res) => {
    try {
        const { movieName, rating, cast, genre, releaseDate, userId } = req.body;
        const movieId = parseInt(req.params.movieId, 10);
        const movie = await prisma.movie.update({
            where: {
                id: movieId
            },
            data: {
                movieName,
                rating,
                cast: { set: cast },
                genre,
                releaseDate,
            }
        });
        res.status(200).send({ data: movie, "message": "data updated successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Could not update the movie.' });
    }
});

app.delete('/movies/:id', authenticateToken, async (req, res) => {
    try {
        const movieId = parseInt(req.params.id);
        const deletedMovie = await prisma.movie.delete({
            where: {
                id: movieId
            }
        });
        res.status(200).send({ message: 'Movie deleted successfully', data: deletedMovie });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Could not delete the movie' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
