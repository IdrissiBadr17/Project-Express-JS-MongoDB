import qs from "qs";
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Build the query
    // `this.queryString` can be either a string (raw querystring)
    // or an object (Express `req.query`). Handle both safely.

    // console.log(typeof this.queryString); // object

    const queryObj =
      typeof this.queryString !== "string" ?
        qs.parse(this.queryString)
      : { ...this.queryString };

    // 1) Filtering
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((e) => delete queryObj[e]);

    // console.log(this.queryString, queryObj);

    // const tours = await Tour.find({
    //   duration: { $eq: 5 },
    //   difficulty: "easy",
    // });
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 3) Sorting
    /*
    ascending -> 1
    descending -> -1
    example: sort=price,ratingAverage
    1) sort('price ratingAverage')
    2) sort('-price -ratingAverage')
    */

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // 4) Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    // 5) Pagination

    // page=2&limit=10  ->
    // page 1: 1-10, page 2: 11-20, page 3: 21-30
    
    this.page = Number(this.queryString.page) || 1;
    this.limit = Number(this.queryString.limit) || 10;

    const skip = (this.page - 1) * this.limit;

    this.query = this.query.skip(skip).limit(this.limit);

    return this;
  }
}

export default ApiFeatures;
