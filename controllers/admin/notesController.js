// controllers/admin/notesController.js
const Repair = require('../../models/Repair');

module.exports = {

  /*
  |--------------------------------------------------------------------------
  | Add Note (POST)
  |--------------------------------------------------------------------------
  */
  addNote: async (req, res) => {
    try {
      const { description, part, quantity, price } = req.body;

      await Repair.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            notes: {
              description,
              part: part || "",
              quantity: quantity ? Number(quantity) : 1,
              price: price ? Number(price) : 0,
            }
          }
        }
      );

      res.redirect(`/admin/job/${req.params.id}`);

    } catch (err) {
      console.error("❌ Error adding note:", err);
      res.status(500).send("Failed to add note.");
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Delete Note (POST)
  |--------------------------------------------------------------------------
  */
  deleteNote: async (req, res) => {
    try {
      await Repair.findByIdAndUpdate(
        req.params.id,
        { $pull: { notes: { _id: req.params.noteId } } }
      );

      res.redirect(`/admin/job/${req.params.id}`);

    } catch (err) {
      console.error("❌ Error deleting note:", err);
      res.status(500).send("Failed to delete note.");
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Edit/Update Note (POST)
  |--------------------------------------------------------------------------
  */
  updateNote: async (req, res) => {
    try {
      const { description, part, quantity, price } = req.body;

      await Repair.updateOne(
        { _id: req.params.id, "notes._id": req.params.noteId },
        {
          $set: {
            "notes.$.description": description,
            "notes.$.part": part || "",
            "notes.$.quantity": quantity ? Number(quantity) : 1,
            "notes.$.price": price ? Number(price) : 0,
          }
        }
      );

      res.redirect(`/admin/job/${req.params.id}`);

    } catch (err) {
      console.error("❌ Error updating note:", err);
      res.status(500).send("Failed to update note.");
    }
  }

};