import express from "express"
import dotenv from "dotenv"
import conectarDB from "./config/db.js"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import proyectoRoutes from "./routes/proyectoRoutes.js"
import tareaRoutes from "./routes/tareaRoutes.js"
import cors from 'cors'

const app = express()
app.use(express.json())

dotenv.config()
conectarDB()

app.use(function (req, res, next) {
    console.log("%s %s", req.method, req.url);
    next();
});



//Configurar Cors
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function(origin, callback) {
    if (whiteList.includes(origin)) {
      //Puede consultar la API
      callback(null,true);
    } else {
      //No esta permitido el acceso
      callback(new Error('Error de Cors'));
    }
  }
}

//app.use(cors(corsOptions))
app.use(cors());

//ROUTING
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);


const PORT = process.env.PORT || 4000
const servidor = app.listen(PORT, () => {
  {
  console.log(`listening on port ${PORT}`)
  }
})

//socket io server

import { Server } from "socket.io"
import { actualizarTarea } from "./controllers/tareaControllers.js"

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  }
})

io.on('connection', (socket) => {
  console.log("Conectado a Socket.io")
  socket.on('Abrir Proyecto', (proyecto) => {
    socket.join(proyecto)
  })

  socket.on('nueva tarea', (tarea) => {
    const proyecto = tarea.proyecto
    socket.to(proyecto).emit('tarea agregada',tarea)
  })

  socket.on('eliminar tarea', tarea => {
    const proyecto = tarea.proyecto
    socket.to(proyecto).emit('tarea eliminada', tarea)
  })
  
  socket.on('actualizar Tarea', (tarea) => {
    const proyecto = tarea.proyecto._id
    socket.to(proyecto).emit("tarea actualizada",tarea)
  })
  socket.on("cambiar estado", (tarea) => {
    const proyecto = tarea.proyecto._id
    socket.to(proyecto).emit('nuevo estado',tarea)
  })
})