const router = require("express").Router();
const Note = require("../models/Notes.js");
const fetchuser = require("../middleware/getuser.js");
const { body, validationResult } = require("express-validator");

// Route:1 api/notes/add (POST) - Add a new note (Login required)
router.post(
  "/add",
  [
    body("title", "Enter  Title").notEmpty(),
    body("description", "Description cant be null").notEmpty(),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.id;
    const { title, description, tag } = req.body;
    try {
      const note = await Note.create({
        user: userId,
        title,
        description,
        tag,
      });
      res.json(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 2: api/notes/fetchallnotes (GET) - Fetch all notes (Login required)

router.get("/getallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 3: api/notes/delete (DELETE) - Delete a note (Login required)

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be delete and delete it
    
    let note = await Note.findById(req.params.id);
   
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Allow deletion only if user owns this Note
    if (note.user.toString() !== req.id) {
       
      return res.status(401).send("Not Allowed");
    }
    console.log(req.params.id)

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 4: api/notes/update (PUT) - Update a note (Login required)
router.put("/updatenote/:id", fetchuser, async (req, res) => {
 try{
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.json({ error: "Not Found" });
    }
    if (note.user.toString() !== req.id) {
      return res.status(401).send("Not Allowed");
    }

     // Find the note to be update and update it
    note =await Note.findByIdAndUpdate(req.params.id,req.body,{new:true})
      res.json({note})
 }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
        }
});


module.exports = router;
