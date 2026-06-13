const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const router = express.Router();

const sampleProducts = [
  {
    _id: '1',
    name: 'JKUAT Hoodie',
    description: 'Comfortable university hoodie',
    priceKES: 1500,
    category: 'clothes',
    images: [],
    stock: 20,
    campusLocation: 'Main Campus',
  },
  {
    _id: '2',
    name: 'Campus Mug',
    description: 'Ceramic mug with JKUAT logo',
    priceKES: 400,
    category: 'utensils',
    images: [],
    stock: 50,
    campusLocation: 'Main Campus',
  },
];

const isDbReady = () => mongoose.connection.readyState === 1;

const buildProductQuery = (query) => {
  const filters = {};

  if (query.category) filters.category = query.category;
  if (query.minPrice) filters.priceKES = { ...filters.priceKES, $gte: Number(query.minPrice) };
  if (query.maxPrice) filters.priceKES = { ...filters.priceKES, $lte: Number(query.maxPrice) };
  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { campusLocation: { $regex: query.search, $options: 'i' } },
    ];
  }
  if (query.campusLocation) {
    filters.campusLocation = { $regex: query.campusLocation, $options: 'i' };
  }

  return filters;
};

router.get('/', async (req, res) => {
  const defaultMax = 20000;
  const query = buildProductQuery(req.query);

  if (!isDbReady()) {
    const min = Number(req.query.minPrice) || 0;
    const max = Number(req.query.maxPrice) || defaultMax;
    const search = (req.query.search || '').toLowerCase();
    const category = req.query.category;

    let results = sampleProducts.filter((item) => item.priceKES >= min && item.priceKES <= max);
    if (category) results = results.filter((item) => item.category === category);
    if (search) {
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.campusLocation.toLowerCase().includes(search)
      );
    }

    return res.json(results);
  }

  try {
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Product list error:', error);
    res.status(500).json({ message: 'Unable to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Unable to load product' });
  }
});

router.post('/', async (req, res) => {
  const { name, description, priceKES, category, vendor, images, stock, campusLocation, isService } = req.body;
  if (!name || !description || priceKES == null || !category) {
    return res.status(400).json({ message: 'Missing required product fields' });
  }

  try {
    const newProduct = await Product.create({
      name,
      description,
      priceKES,
      category,
      vendor,
      images: images || [],
      stock: stock || 0,
      campusLocation,
      isService: Boolean(isService),
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Unable to create product' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Unable to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Unable to delete product' });
  }
});

module.exports = router;
