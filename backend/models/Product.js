const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priceKES: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['clothes', 'food', 'utensils', 'furniture', 'supermarket'],
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    images: [String],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    campusLocation: {
      type: String,
      trim: true,
    },
    isService: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', ProductSchema);
