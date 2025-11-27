const express = require("express")
const morgan = require ("morgan")
const cors = require('cors')
const app = express()
const port = 3001

app.use(cors())
app.use(express.json())
app.use(express.static("dist"))
morgan.token('content', (req, res)=>{
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
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
const letters= [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z'
]


app.get('/', (req, res)=>{
    res.send("<h1>Phonebook Backend</h1>")
    
})

app.get("/api/persons",(req, res)=>{
    res.json(persons)
})

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people <br> ${new Date()}</p>`)
})

app.get("/api/persons/:id", (req, res) =>{
     const id = req.params.id
     const person = persons.find( person => person.id === id)
   
     if (person){
      res.json(person)
     }else{
      res.status(404).json({error : "Oops! person not found!"}).end()
      //res.status(404).end()
     }   
})

app.delete("/api/persons/:id", (req, res) =>{
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)
  res.json(persons)
})
/*
const generatedId = () => {
   const lastId =  persons.length > 0 
    ? Math.max(...persons.map(person => person.id))
    : 0
return((lastId + 1).toString())

}*/

const randomId = ()=>{
  const numb = ()=> Math.ceil(Math.random()*9)
  const letr = ()=> letters [(Math.floor(Math.random()*letters.length))]
 const id = letr() + numb() + letr() + numb() + numb() +letr()
 return id
}
//console.log(randomId())



app.post("/api/persons", (req, res)=>{
  const body = req.body
  const person ={
    id : randomId(),
    name : body.name,
    number : body.number,
    date : new Date(),
  }

const nameExist = body.name ? persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase()) : []

if(nameExist.length > 0 ){
  res.status(400).json({error : 'name must be unique'})

} else if( !body.name || !body.number ){
  res.status(400).json({error:"name and number must be filled"})
} else{
  persons = persons.concat(person)
  res.json(persons) 
}

  
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})