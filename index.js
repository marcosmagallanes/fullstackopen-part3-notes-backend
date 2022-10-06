const express = require('express')
const app = express()
const nanoid = require('nanoid')
const morgan = require('morgan')

app.use(express.json());

morgan.token('data', (req, res) => {
  const { body } = req
  return JSON.stringify(body)
})
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];



app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.json({
    num_of_entries: phonebook.length,
    timestamp: Date()
  })
})

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.get("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const filteredPhonebook = phonebook.filter(item => item.id === id)

  if (filteredPhonebook.length === 1) {
    res.json(...filteredPhonebook)
  } else {
    res.json({ error: 'no entry found by that id' })
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id);

  let returnObj;

  const filteredPhonebook = phonebook.filter((item) => {
    if (item.id === id) {
      returnObj = item
      return false
    } else return true
  });

  if (returnObj) res.json({
    deleted: returnObj,
  })
  else res.json({ error: 'no entry found by that id to delete'})
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number) {
    res.json({ error: 'name or number is missing'})
  } else {

    const nameExists = phonebook.map(entry => entry.name).includes(name)

    console.log(phonebook.map((entry) => entry.name));
    console.log(nameExists)    

    if (nameExists) {
      res.json({ error: "existing entry found by that name" }); 
    } else {
      const newEntry = {
        name,
        number,
        id: nanoid(6),
      };
      phonebook = phonebook.concat(newEntry);
      res.json(newEntry);
    }
  }
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})