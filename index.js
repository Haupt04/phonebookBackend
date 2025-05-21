import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const generateId = () => {
  return String(Math.floor(Math.random() * 10000000))
}



let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(data)
   
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number){
      return response.status(400).json({error: 'content missing'})
    }

    const check = data.find(d => d.name == body.name)

    if (check){
      return response.status(400).json({error: 'name must be unique'})
    }

    const entry = {
      id: generateId(),
      name: body.name,
      number: body.number
    }

    data = data.concat(entry)
   
    response.json(data)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = data.find(dat => dat.id === id)

    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
   
})

app.get("/info", (request, response) => {
  const paragraph1 = `Phonebook has info for ${data.length} people `;
  const paragraph2 = new Date()
  response.send(`<p>${paragraph1}</p><p>${paragraph2}</p>`);
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  data = data.filter(d => d.id !== id)

  response.status(204).end()
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})