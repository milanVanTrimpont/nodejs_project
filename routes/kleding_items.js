const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../db'); 

const router = express.Router();
router.use(bodyParser.json()); // Voor JSON-parsing

// validatie dat de gegevens niet leeg zijn
function validateKledingItem(data) {
  const { titel, content } = data;

  if (!titel || typeof titel !== 'string') {
      return { isValid: false, message: 'Titel mag niet leeg zijn en moet een string zijn.' };
  }

  if (!content || typeof content !== 'string') {
      return { isValid: false, message: 'Content mag niet leeg zijn en moet een string zijn.' };
  }

  return { isValid: true };
}



// endpoint voor kleding met een limit en offset (eerste 10 items laten zien)
router.get('/', async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;

  try {
      const [rows] = await pool.query('SELECT * FROM kleding_items LIMIT ? OFFSET ?', [parseInt(limit), parseInt(offset)]);
      res.json(rows);
  } catch (err) {
      console.error('Fout bij het ophalen van kleding items:', err.message);
      res.status(500).send('Error retrieving data from the database');
  }
});

// endpoint toevoegen voor het zoeken naar kleding
router.get('/zoeken', async (req, res) => 
{
  const { searchTerm } = req.query;

  if (!searchTerm) {
      return res.status(400).send('Zoekterm is vereist.');
  }

  try {
      const [rows] = await pool.query('SELECT * FROM kleding_items WHERE titel LIKE ? OR content LIKE ?', [`%${searchTerm}%`, `%${searchTerm}%`]);
      res.json(rows);
  } catch (err) {
      console.error('Fout bij het zoeken naar kleding items:', err.message);
      res.status(500).send('Error retrieving data from the database');
  }
});

// nieuwe kleren toevoegen
router.post('/toevoegen', async (req, res) => {
    const { titel, content } = req.body; 
    
    // validatie gebruiken
    const validation = validateKledingItem(req.body);
    if (!validation.isValid) {
        return res.status(400).send(validation.message);
    }
    try {
      // Voer een INSERT query uit
      const [result] = await pool.query(
        'INSERT INTO kleding_items (titel, content) VALUES (?, ?)',
        [titel, content] 
      );
      
      // bericht of het gelukt is of niet
      res.status(201).json({ 
        message: 'Data succesvol toegevoegd', 
        insertId: result.insertId 
      });
    } catch (err) {
      console.error('Fout bij toevoegen van data:', err);
      res.status(500).send('Er is een fout opgetreden bij het toevoegen van data');
    }
  });

  // kleiding stukken aanpassesn
  router.put('/aanpassen/:id', async (req, res) => {
    const { id } = req.params; 
    const { titel, content } = req.body; 
  
    //validatie gebruiken
    const validation = validateKledingItem(req.body);
    if (!validation.isValid) {
        return res.status(400).send(validation.message);
    }

    try {
      // Voer een UPDATE query uit
      const [result] = await pool.query(
        'UPDATE kleding_items SET titel = ?, content = ? WHERE id = ?',
        [titel, content, id] 
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Kleding item niet gevonden' });
      }
  
      res.json({ 
        message: 'kleding item is aangepast',
        affectedRows: result.affectedRows 
      });
    } catch (err) {
      console.error('Fout bij updaten van het kleding item:', err);
      res.status(500).send('Er is een fout opgetreden bij het updaten van data');
    }
  });
  

  // kleiding stukken verwijderen
  router.delete('/verwijderen/:id', async (req, res) => {
    const { id } = req.params; 
    
    try 
    {
        const [result] = await pool.query(
        'DELETE FROM kleding_items  WHERE id = ?;',
        [id] 
    );
  
    if (result.affectedRows === 0) 
    {
        return res.status(404).json({ message: 'Kleding item niet gevonden' });
    }
  
    res.json
    ({ 
        message: 'kleding item is verwijderd',
        affectedRows: result.affectedRows 
    });
    } 
    catch (err) 
    {
        console.error('Fout bij updaten van het kleding item:', err);
        res.status(500).send('Er is een fout opgetreden bij het updaten van data');
    }
  });

  module.exports = router;