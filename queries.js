// ================================
// BASIC CRUD OPERATIONS
// ================================

// 1. Find all books in a specific genre (example: Fiction)
db.books.find({ genre: "Fiction" });


// 2. Find books published after a certain year (example: after 1950)
db.books.find({ published_year: { $gt: 1950 } });


// 3. Find books by a specific author (example: George Orwell)
db.books.find({ author: "George Orwell" });


// 4. Update the price of a specific book (example: "1984")
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 15.99 } }
);


// 5. Delete a book by its title (example: "The Great Gatsby")
db.books.deleteOne({ title: "The Great Gatsby" });



// ================================
// ADVANCED QUERIES
// ================================

// 6. Find books that are in stock AND published after 2000
db.books.find({
  in_stock: true,
  published_year: { $gt: 2000 }
});


// 7. Projection: return only title, author, and price (hide _id)
db.books.find(
  {},
  { _id: 0, title: 1, author: 1, price: 1 }
);


// 8. Sorting books by price ascending
db.books.find().sort({ price: 1 });


// 9. Sorting books by price descending
db.books.find().sort({ price: -1 });


// 10. Pagination — 5 books per page

// Page 1
db.books.find().skip(0).limit(5);

// Page 2
db.books.find().skip(5).limit(5);



// ================================
// AGGREGATION PIPELINES
// ================================

// 11. Average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
]);


// 12. Find the author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);


// 13. Group books by publication decade and count them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $substr: [{ $subtract: ["$published_year", { $mod: ["$published_year", 10] }] }, 0, 4] },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      totalBooks: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);



// ================================
// INDEXING
// ================================

// 14. Create an index on title
db.books.createIndex({ title: 1 });


// 15. Create a compound index on author + published_year
db.books.createIndex({ author: 1, published_year: -1 });


// 16. Use explain() to demonstrate performance improvement
db.books.find({ title: "1984" }).explain("executionStats");
