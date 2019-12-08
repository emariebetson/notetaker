// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================
const router = require("express").Router();
const path = require('path');
const fs = require('fs');

let id = 0;
let indexedData = [];
/* get the notes */
router.get('/create', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/db.json'), 'utf8', (err,data)  => {
    console.log(data);
    //id = 0;
    parsedData = JSON.parse(data)
    res.json(parsedData);
    
  });
});

router.delete('/notes/:id', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/db.json'), 'utf8', (err, data)  => {
    let parsedData = JSON.parse(data);
    let modifiedData = parsedData.filter(x => x.id !== parseInt(req.params.id))
    fs.writeFile(path.join(__dirname, '../data/db.json'), JSON.stringify(modifiedData), (err) => {
      if (err) throw err;
    });
  });   
  res.send('post sent');
  });



router.post('/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/db.json'), 'utf8', (err,data)  => {
      /*json data to array */
      let notes = JSON.parse(data);
      let newNote = req.body;
      if (notes.length === 0) {
        notes.push({
          ...newNote,
          id: 1});
      } else 
      {
        let prevNote = notes[notes.length - 1];
       notes.push( {
         ...newNote,
         id: prevNote.id + 1
       });
      }
      /* use normal write file to save to db.json */
      fs.writeFile(path.join(__dirname, '../data/db.json'), JSON.stringify(notes), (err) => {
        if (err) throw err;
        console.log('note saved');
      });
    });
    res.send('post sent');
    // A function for deleting a note from the db
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};
});


module.exports = router;
var tableData = require('../data/db.json');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests

  app.get("/api/notes", function(req, res) {
    res.json(tableData);
  });


  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware
    if (tableData.length < 5) {
      tableData.push(req.body);
      res.json(true);
    }
  });

  // ---------------------------------------------------------------------------
  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!

  app.post("/api/clear", function(req, res) {
    // Empty out the arrays of data
    tableData.length = 0;

    res.json({ ok: true });
  });
};
