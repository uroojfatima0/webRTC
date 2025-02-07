const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.static(__dirname)); // Serve static files

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});