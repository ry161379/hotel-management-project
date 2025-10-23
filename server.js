// backend/server.js

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const connectDB = require('./config/db'); // MongoDB connection

// Load JSON data for dynamic pages
const roomsData = require('./data/rooms.json');
const restaurantData = require('./data/restaurant.json');

const app = express();
const PORT = process.env.PORT || 4000;

// ------------------- MIDDLEWARE -------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (CSS, JS, images) from parent folder
app.use(express.static(path.join(__dirname, '..')));

// ------------------- CONNECT DATABASE -------------------
connectDB(); // Connect to MongoDB

// ------------------- DATABASE MODEL -------------------
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// ------------------- FRONTEND ROUTES -------------------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'index.html')));
app.get('/rooms', (req, res) => res.sendFile(path.join(__dirname, '..', 'rooms.html')));
app.get('/restaurant', (req, res) => res.sendFile(path.join(__dirname, '..', 'restaurant.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, '..', 'contact.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, '..', 'about.html')));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, '..', 'services.html')));
app.get('/gallery', (req, res) => res.sendFile(path.join(__dirname, '..', 'gallery.html')));
app.get('/booking', (req, res) => res.sendFile(path.join(__dirname, '..', 'booking.html')));

// ------------------- API ROUTES -------------------
app.get('/api/rooms', (req, res) => res.json(roomsData));
app.get('/api/restaurant', (req, res) => res.json(restaurantData));

// ------------------- CONTACT FORM ROUTE -------------------
app.post('/contact', async (req, res) => {
    console.log('Contact form hit:', req.body); // debug

    try {
        const { name, email, phone, subject, message } = req.body;

        // -------- SAVE TO MONGODB --------
        const newContact = new Contact({ name, email, phone, subject, message });
        await newContact.save();
        console.log(`Saved contact to MongoDB: ${name} | ${email}`);

        // -------- SAVE TO FILE --------
        const folderPath = path.resolve(__dirname, 'contact');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log(`Created folder: ${folderPath}`);
        }

        const timestamp = Date.now();
        const safeName = name.replace(/[^a-z0-9]/gi, '_'); // sanitize filename
        const fileName = `${timestamp}_${safeName}.json`;
        const filePath = path.join(folderPath, fileName);

        const contactData = { name, email, phone, subject, message, date: new Date() };

        try {
            fs.writeFileSync(filePath, JSON.stringify(contactData, null, 2));
            console.log(`Saved contact to file: ${fileName}`);
        } catch (fileErr) {
            console.error('Failed to save contact file:', fileErr);
        }

        // -------- RESPONSE --------
        res.send('Thank you for contacting us! Your message has been saved.');
    } catch (err) {
        console.error('Error saving contact:', err);
        res.status(500).send('Failed to save your message. Please try again.');
    }
});

// ------------------- START SERVER -------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
