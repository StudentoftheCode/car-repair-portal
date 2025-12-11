const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  description: { type: String, required: true },
  part: { type: String, default: "" },
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const RepairSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    vin: { 
        type: String, 
        required: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    dateBroughtIn: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Diagnostic', 'In Progress', 'Finishing Up', 'Completed'],
      default: 'Diagnostic',
    },

    notes: [noteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Repair', RepairSchema);