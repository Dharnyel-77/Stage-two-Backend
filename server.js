const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Person = require('./Models/personModel');

const mongoUri =
  "mongodb+srv://Dharnyel_77:mUuYC0Zb0EbNzg2x@cluster0.zovbnvc.mongodb.net/PersonAPI?retryWrites=true&w=majority&ssl=true";

app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.get("/", (req, res) => {
  res.send("Hello Person API");
});

app.get("/api", (req, res) => {
  res.send("This should be the first route");
});

app.get("/api", async (req, res) => {
  try {
    const persons = await Person.find({});
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);
    res.status(200).json(person);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api", async (req, res) => {
  try {
    const person = await Person.create(req.body);
    res.status(200).json(person);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const options = { new: true };
    const person = await Person.findByIdAndUpdate(id, req.body, options);
    if (!person) {
      return res
        .status(404)
        .json({ message: `cannot find any person with ID:${id}` });
    }
    const updatedPerson = await Person.findById(id);
    res.status(200).json(updatedPerson);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findByIdAndDelete(id);
    if (!person) {
      return res
        .status(404)
        .json({ message: `cannot find any person with ID:${id}` });
    }
    res
      .status(200)
      .json({ message: `Document with ID:${id} has been deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const port = process.env.PORT || 8000;
mongoose.set("strictQuery", false);
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB"),
      app.listen(port, () => {
        `Server s running on port ${port}`;
      });
  })

  .catch((error) => {
    console.log(error);
  });
