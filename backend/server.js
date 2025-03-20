const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = 5001;
const cors = require('cors');
const swaggerDocs = require('./swagger.js');
const swaggerUi = require('swagger-ui-express');

const JWT_SECRET = 'secret';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
});

const Item = sequelize.define('Item', {
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING },
    user_id: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
});

User.hasMany(Item);
Item.belongsTo(User);


app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 8);
    try {
        const user = await User.create({ email, password: hashPassword });
        res.status(201).json({ user });
    } catch (err) {
        res.status(400).json({ error: 'User already exists.' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
    }
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });
    try {
        const decoded = jwt.decode(token, 'secret');
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};


app.get('/api/items', verifyToken, async (req, res) => {
    const items = await Item.findAll({ where: { user_id: req.userId } });
    res.status(200).json({ items });
});

app.get('/api/items/:id', verifyToken, async (req, res) => {
    const item = await Item.findByPk(req.params.id);
    if (item) res.status(200).json({ item });
    else res.status(404).json({ error: 'Item not found' });
});

app.post('/api/items', verifyToken, async (req, res) => {
    const { title, description, category } = req.body;
    const newItem = await Item.create({
        title,
        description,
        category,
        user_id: req.userId,
    });
    res.status(201).json({ newItem });
});

app.put('/api/items/:id', verifyToken, async (req, res) => {
    const { title, description, category } = req.body;
    const item = await Item.findByPk(req.params.id);
    if (item && item.user_id === req.userId) {
        item.title = title;
        item.description = description;
        item.category = category;
        await item.save();
        res.status(200).json({ item });
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});

app.delete('/api/items/:id', verifyToken, async (req, res) => {
    const item = await Item.findByPk(req.params.id);
    if (item && item.user_id === req.userId) {
        await item.destroy();
        res.status(200).json({ message: 'Item deleted' });
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


