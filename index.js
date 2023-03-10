const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

morgan.token('person', (req) => {
  if (req.method === 'POST') return JSON.stringify(req.body);
  return null;
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person'
  )
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.get('/info', (request, response) => {
  const totalPeople = persons.length;
  const date = new Date();
  response.send(
    `Phonebook has info for ${totalPeople} people <br> <br> ${date}`
  );
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.phoneNumber) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    name: body.name,
    number: body.phoneNumber,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
