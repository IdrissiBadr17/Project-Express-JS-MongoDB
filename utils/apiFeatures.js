import qs from "qs";
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Build the query
    const queryObj = qs.parse(this.queryString);

    // 1) Filtering
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((e) => delete queryObj[e]);

    // console.log(req.query, queryObj);

    // const tours = await Tour.find({
    //   duration: { $eq: 5 },
    //   difficulty: "easy",
    // });
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(queryStr);
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
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
