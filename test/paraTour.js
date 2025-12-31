// const aliasTopTours = (req, res, next) => {
//   // Parse existing query parameters from the client
//   const clientParams = new URLSearchParams(req.url.split('?')[1] || '');
  
//   // Set default values (will be overridden if client provides them)
//   const defaultParams = {
//     sort: '-ratingsAverage,price',
//     fields: 'ratingsAverage,price,name,difficulty,summary',
//     limit: '5'
//   };
  
//   // Merge: client params override defaults
//   const mergedParams = { ...defaultParams, ...Object.fromEntries(clientParams) };
  
//   // Rebuild the URL with merged parameters
//   const queryString = new URLSearchParams(mergedParams).toString();
//   req.url = `/?${queryString}`;
  
//   next();
// };
```

// ## Example Usage:

// **1. Client uses defaults:**
// ```
// GET /api/v1/tours/top-5-cheap
// → Uses all defaults (limit=5, sort by rating & price, specific fields)
// ```

// **2. Client overrides limit:**
// ```
// GET /api/v1/tours/top-5-cheap?limit=10
// → Shows 10 tours instead of 5, keeps other defaults
// ```

// **3. Client adds custom sort:**
// ```
// GET /api/v1/tours/top-5-cheap?sort=-price
// → Sorts by price only, overrides the default sort
// ```

// **4. Client adds filtering:**
// ```
// GET /api/v1/tours/top-5-cheap?difficulty=easy
// → Uses defaults + filters for easy difficulty