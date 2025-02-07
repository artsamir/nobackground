require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Serve static frontend files (Fix for Cannot GET /)
app.use(express.static(path.join(__dirname, 'public')));

// Root route to serve `index.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/remove-background', upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;

        const response = await axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            headers: {
                'X-Api-Key': process.env.REMOVE_BG_API_KEY,
            },
            data: {
                image_file_b64: imageBuffer.toString('base64'),
                size: 'auto'
            },
            responseType: 'arraybuffer'
        });

        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).send('Error removing background');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
