require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const myVisaCollection = client.db('visaDB').collection('myVisa');

        app.get('/visas', async (req, res) => {
             
            const {search}=req.query
            let option ={}
            if(search){
                option ={visaType:{$regex:search,$options:'i'}}
            }

            const cursor = visaCollection.find(option);
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/visas/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await visaCollection.findOne(query);
            res.send(result)
        })


        app.get('/visa/:email', async (req, res) => {
            const email = req.params.email;
            const option = { email: email };
            const coursor = visaCollection.find(option);
            const result = await coursor.toArray()
            res.send(result)
        })


        app.post('/visas', async (req, res) => {
            const visa = req.body;
            const result = await visaCollection.insertOne(visa)
            res.send(result)
        })

        app.post('/myvisa', async (req, res) => {
            const myVisa = req.body;
            const result = await myVisaCollection.insertOne(myVisa);
            res.send(result)
        })
        app.get('/myvisa',async(req,res)=>{
            const {search}=req.query
            let option={};
            if(search){
                option={name:{$regex:search,$options:'i'}}
            }
            const coursor = myVisaCollection.find(option)
            const result = await coursor.toArray()
            res.send(result)
        })

        app.patch('/visas/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body
            const filter = { _id: new ObjectId(id) }
            const newData = {
                $set: {
                    name:updateData.name,
                    photo:updateData.photo,
                    visaType:updateData.visaType,
                    time:updateData.time,
                    age:updateData.age,
                    validity:updateData.validity,
                    method:updateData.method,
                    passpord:updateData.passpord,
                    photograph:updateData.photograph,
                    applicationForm:updateData.applicationForm,
                    discrip:updateData.discrip,
                    fee:updateData.fee
                }
            }
            const result = await visaCollection.updateOne(filter,newData)
            res.send(result)
        })
          
        app.delete('/visas/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:new ObjectId(id)};
            const result= await visaCollection.deleteOne(query)
            res.send(result)
        })

        app.delete('/myvisa/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={_id:new ObjectId(id)};
            const result = await myVisaCollection.deleteOne(query);
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