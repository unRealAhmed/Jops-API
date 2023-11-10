module.exports = class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = JSON.parse(JSON.stringify(queryString));
    this.excludedFields = ['page', 'sort', 'limit', 'fields']; // Fields to exclude from filtering
  }

  // Filter the query based on query parameters
  filter() {
    const queryObj = JSON.parse(JSON.stringify(this.queryString));

    const filteredQuery = Object.keys(queryObj)
      .filter(key => !this.excludedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = queryObj[key];
        return obj;
      }, {});

    let queryStr = JSON.stringify(filteredQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // Return the APIFeatures instance for method chaining
  }

  // Sort the query based on the sort parameter
  sort() {
    if (this.queryString.sort) {
      const { sort } = this.queryString;
      let sortFields;

      // Add custom sorting options
      if (sort === 'latest') {
        sortFields = '-createdAt';
      } else if (sort === 'oldest') {
        sortFields = 'createdAt';
      } else if (sort === 'a-z') {
        sortFields = 'position';
      } else if (sort === 'z-a') {
        sortFields = '-position';
      } else {
        // Default sorting by createdAt
        sortFields = 'createdAt';
      }

      this.query.sort(sortFields);
    } else {
      // Default sorting by createdAt if no sort parameter is provided
      this.query.sort('createdAt');
    }

    return this;
  }


  // Paginate the results based on the page and limit parameters
  paginate() {
    if (this.queryString.page) {
      const page = parseInt(this.queryString.page, 10) || 1;
      const limit = parseInt(this.queryString.limit, 10) || 100;
      const skip = (page - 1) * limit;
      this.query.skip(skip).limit(limit);
    }
    return this;
  }

  // Select specific fields to include in the query results
  selectFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
};