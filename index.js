const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const categorieRoutes = require('./routes/categorie'); 
const kledingItemsRoutes = require('./routes/kleding_items');
const pool = require('./db');

const app = express(); 
app.use(bodyParser.json());  // Voor JSON-parsing

// route naar doc file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentatie.html')); 
});

// route naar categorie bestand
app.use('/categorie', categorieRoutes);  
// route naar kleding bestand
app.use('/kleding_items', kledingItemsRoutes); 

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));