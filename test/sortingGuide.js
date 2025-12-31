// import express, { json } from 'express';
// import { connect, Schema, model } from 'mongoose';

// const app = express();
// app.use(json());

// // Connect to MongoDB
// connect('mongodb://localhost:27017/myapp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Product Schema
// const productSchema = new Schema({
//   name: String,
//   price: Number,
//   rating: Number,
//   stock: Number,
//   category: String,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Product = model('Product', productSchema);

// // ============================================
// // 1. BASIC SORTING - Single Field
// // ============================================

// // Sort by price ascending
// // GET /api/products/sort-basic?sortBy=price
// app.get('/api/products/sort-basic', async (req, res) => {
//   try {
//     const { sortBy } = req.query;
    
//     // Method 1: Using string
//     const products = await Product.find().sort(sortBy || 'createdAt');
    
//     // Method 2: Using object
//     // const products = await Product.find().sort({ price: 1 }); // 1 = ascending
    
//     res.status(200).json({
//       success: true,
//       count: products.length,
//       data: products
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// });

// // ============================================
// // 2. ASCENDING vs DESCENDING
// // ============================================

// // GET /api/products/sort-order?sortBy=price&order=desc
// app.get('/api/products/sort-order', async (req, res) => {
//   try {
//     const { sortBy = 'createdAt', order = 'asc' } = req.query;
    
//     // Method 1: Using prefix (- for descending)
//     const sortField = order === 'desc' ? `-${sortBy}` : sortBy;
//     const products = await Product.find().sort(sortField);
    
//     // Method 2: Using object with 1 or -1
//     // const sortOrder = order === 'asc' ? 1 : -1;
//     // const products = await Product.find().sort({ [sortBy]: sortOrder });
    
//     res.status(200).json({
//       success: true,
//       sorting: { field: sortBy, order },
//       count: products.length,
//       data: products
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// });

// // ============================================
// // 3. MULTIPLE FIELD SORTING
// // ============================================

// // GET /api/products/sort-multiple?sort=price,rating
// // GET /api/products/sort-multiple?sort=-price,rating (price desc, rating asc)
// app.get('/api/products/sort-multiple', async (req, res) => {
//   try {
//     const { sort } = req.query;
    
//     if (sort) {
//       // Convert comma-separated to space-separated
//       // "price,rating" => "price rating"
//       // "-price,rating" => "-price rating"
//       const sortBy = sort.split(',').join(' ');
//       const products = await Product.find().sort(sortBy);
      
//       res.status(200).json({
//         success: true,
//         sorting: sortBy,
//         count: products.length,
//         data: products
//       });
//     } else {
//       // Default sort
//       const products = await Product.find().sort('-createdAt');
      
//       res.status(200).json({
//         success: true,
//         count: products.length,
//         data: products
//       });
//     }
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// });

// // ============================================
// // 4. SORTING WITH FILTERING
// // ============================================

// // GET /api/products/filter-sort?category=electronics&sort=-price
// app.get('/api/products/filter-sort', async (req, res) => {
//   try {
//     const { category, minPrice, maxPrice, sort = '-createdAt' } = req.query;
    
//     // Build filter
//     const filter = {};
//     if (category) filter.category = category;
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }
    
//     // Apply filter and sort
//     const sortBy = sort.split(',').join(' ');
//     const products = await Product.find(filter).sort(sortBy);
    
//     res.status(200).json({
//       success: true,
//       filter,
//       sorting: sortBy,
//       count: products.length,
//       data: products
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// });

// // ============================================
// // 5. SORTING WITH PAGINATION
// // ============================================

// // GET /api/products/paginate-sort?page=1&limit=10&sort=-price
// app.get('/api/products/paginate-sort', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const sort = req.query.sort || '-createdAt';
//     const skip = (page - 1) * limit;
    
//     const sortBy = sort.split(',').join(' ');
    
//     const products = await Product.find()
//       .sort(sortBy)
//       .limit(limit)
//       .skip(skip);
    
//     const total = await Product.countDocuments();
    
//     res.status(200).json({
//       success: true,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//       totalProducts: total,
//       sorting: sortBy,
//       data: products
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// });

// // ============================================
// // 6. ADVANCED SORTING - All Features Combined
// // ============================================

// // GET /api/products/advanced?category=electronics&minPrice=100&sort=-price,rating&page=1&limit=10
// app.get('/api/products/advanced', async (req, res) => {
//   try {
//     // Destructure query parameters
//     const {
//       category,
//       minPrice,
//       maxPrice,
//       minRating,
//       sort = '-createdAt',
//       page = 1,
//       limit = 10
//     } = req.query;
    
//     // 1) Build filter
//     const filter = {};
//     if (category) filter.category = category;
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }
//     if (minRating) filter.rating = { $gte: Number(minRating) };
    
//     // 2) Build sort
//     const sortBy = sort.split(',').join(' ');
    
//     // 3) Pagination
//     const pageNum = parseInt(page);
//     const limitNum = parseInt(limit);
//     const skip = (pageNum - 1) * limitNum;
    
//     // 4) Execute query
//     const products = await Product.find(filter)
//       .sort(sortBy)
//       .limit(limitNum)
//       .skip(skip);
    
//     const total = await Product.countDocuments(filter);
    
//     res.status(200).json({
//       success: true,
//       filter,
//       sorting: sortBy,
//       page: pageNum,
//       limit: limitNum,
//       totalPages: Math.ceil(total / limitNum),
//       totalProducts: total,
//       count: products.length,
//       data: products
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// });

// // ============================================
// // 7. SORTING USING OBJECT NOTATION
// // ============================================

// // Hardcoded sorting examples
// app.get('/api/products/sort-examples', async (req, res) => {
//   try {
//     // Example 1: Sort by price ascending
//     const byPriceAsc = await Product.find().sort({ price: 1 });
    
//     // Example 2: Sort by price descending
//     const byPriceDesc = await Product.find().sort({ price: -1 });
    
//     // Example 3: Sort by multiple fields
//     const multiSort = await Product.find().sort({ price: 1, rating: -1 });
    
//     // Example 4: Sort using string notation
//     const stringSort = await Product.find().sort('price -rating');
    
//     // Example 5: Sort descending using prefix
//     const prefixSort = await Product.find().sort('-price');
    
//     res.status(200).json({
//       success: true,
//       examples: {
//         byPriceAsc: byPriceAsc.slice(0, 3),
//         byPriceDesc: byPriceDesc.slice(0, 3),
//         multiSort: multiSort.slice(0, 3),
//         stringSort: stringSort.slice(0, 3),
//         prefixSort: prefixSort.slice(0, 3)
//       }
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// });

// // ============================================
// // 8. CUSTOM SORTING LOGIC
// // ============================================

// // GET /api/products/custom-sort?type=popular
// app.get('/api/products/custom-sort', async (req, res) => {
//   try {
//     const { type } = req.query;
    
//     let sortOption;
    
//     switch (type) {
//       case 'popular':
//         sortOption = { rating: -1, price: 1 }; // High rating, low price
//         break;
//       case 'newest':
//         sortOption = { createdAt: -1 };
//         break;
//       case 'cheapest':
//         sortOption = { price: 1 };
//         break;
//       case 'expensive':
//         sortOption = { price: -1 };
//         break;
//       case 'best-rated':
//         sortOption = { rating: -1 };
//         break;
//       default:
//         sortOption = { createdAt: -1 };
//     }
    
//     const products = await Product.find().sort(sortOption);
    
//     res.status(200).json({
//       success: true,
//       sortType: type || 'default',
//       count: products.length,
//       data: products
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// });

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log('\n=== SORTING EXAMPLES ===');
//   console.log('1. Basic sort:');
//   console.log('   GET /api/products/sort-basic?sortBy=price');
//   console.log('\n2. With order:');
//   console.log('   GET /api/products/sort-order?sortBy=price&order=desc');
//   console.log('\n3. Multiple fields:');
//   console.log('   GET /api/products/sort-multiple?sort=price,rating');
//   console.log('   GET /api/products/sort-multiple?sort=-price,rating');
//   console.log('\n4. With filtering:');
//   console.log('   GET /api/products/filter-sort?category=electronics&sort=-price');
//   console.log('\n5. With pagination:');
//   console.log('   GET /api/products/paginate-sort?page=1&limit=10&sort=-price');
//   console.log('\n6. Advanced (all features):');
//   console.log('   GET /api/products/advanced?category=electronics&minPrice=100&sort=-price,rating&page=1&limit=10');
//   console.log('\n7. Custom sorting:');
//   console.log('   GET /api/products/custom-sort?type=popular');
//   console.log('   GET /api/products/custom-sort?type=cheapest');
// });

/*
SORTING SYNTAX SUMMARY:
========================

1. String notation:
   .sort('price')           // Ascending
   .sort('-price')          // Descending (minus prefix)
   .sort('price rating')    // Multiple fields (space-separated)
   .sort('-price rating')   // price desc, rating asc

2. Object notation:
   .sort({ price: 1 })      // Ascending (1)
   .sort({ price: -1 })     // Descending (-1)
   .sort({ price: 1, rating: -1 })  // Multiple fields

3. Query string format:
   ?sort=price              // Ascending
   ?sort=-price             // Descending
   ?sort=price,rating       // Multiple (comma-separated)
   ?sort=-price,rating      // Mixed order

IMPORTANT NOTES:
=================
- Default sort order is ascending (1 or no prefix)
- Use minus (-) prefix or -1 for descending
- Multiple sort fields are applied in order (left to right)
- Sort before pagination for consistent results
- Sort performance: Create indexes on frequently sorted fields
*/