const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const { MongoClient } = require("mongodb");

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// MongoDB Atlas Connection URI
const uri = process.env.MONGODB_URI; // Correct way to access environment variable

// Validate that the URI is defined
if (!uri) {
  console.error("MONGODB_URI is not defined in the .env file");
  process.exit(1);
}

const client = new MongoClient(uri);
// MongoDB Atlas Connection URI

const dbName = "dataofchallan"; // Replace with your database name
const collectionName = "data123"; // Replace with your collection name

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from the "public" folder

// Connect to MongoDB
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("uri",dotenv.parse.MONGODB_URI);
    console.error("Error connecting to MongoDB Atlas:", err);
  });

  // API Endpoint to Fetch Data by Field Name
app.get("/search/:field", async (req, res) => {
    const { field } = req.params; // Extract the field from the URL
  
    try {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      // Query MongoDB to check if a field with the given name exists
      const result = await collection.findOne({ [field]: { $exists: true } });
  
      if (result) {
        console.log("Fetched Data:", result[field]); // Log the fetched field's value
        res.json({ data: result[field] }); // Send the value of the matched field
      } else {
        console.log("No data found for the given field:", field); // Log message if no data is found
        res.json({ message: "No data found for this field." });
      }
    } catch (err) {
      console.log("MongoDB URI:", uri);
      console.error("Error fetching data from MongoDB:", err);
      res.status(500).send("Error fetching data from MongoDB.");
    }
  });

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
