const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require('dotenv').config(); 

app.use(cors());
app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster1.ofi7kql.mongodb.net/?appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const animalsCollection = client.db("animalCheckerDB").collection("animals");
    const categoriesCollection = client.db("animalCheckerDB").collection("categories");

    // add animal
    app.post("/animals", async(req, res) => {
        const animalDetails = req.body;
        const result = await animalsCollection.insertOne(animalDetails);
        res.send(result);
    })

    // get all animals
    app.get("/animals", async(req, res) => {
        const result = await animalsCollection.find().toArray();
        res.send(result);
    })

    // add category
    app.post("/category", async(req, res) => {
      const categoryName = req.body;
      const result = await categoriesCollection.insertOne(categoryName);
      res.send(result);
    })

    // get all categories
    app.get("/category", async(req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Animal Checker')
})

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})