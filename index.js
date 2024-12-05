require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
const app = express()

// middleware
app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.dsghf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

       const visaCollection = client.db('visaDB').collection('visa');
        
       app.get('/visas',async(req,res)=>{
           const cursor = visaCollection.find();
           const result = await cursor.toArray()
           res.send(result)
       })

       app.post('/visas',async(req,res)=>{
        const visa = req.body;
        const result =await visaCollection.insertOne(visa)
        res.send(result)
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
    res.send('assignment is running')
})
app.listen(port, () => {
    console.log(`assignment running on ${port}`)
})