import express from 'express';
import {
	obtenerProyectos,
	nuevoProyecto,
	obtenerProyecto,
	editarProyecto,
	eliminarProyecto,
	buscarColaborador,
	agregarColaborador,
	eliminarColaborador,
//	obtenerTareas,
} from '../controllers/proyectoControllers.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').get(checkAuth, obtenerProyectos).post(checkAuth, nuevoProyecto);
router.route('/:id').get(checkAuth, obtenerProyecto).put(checkAuth, editarProyecto).delete(checkAuth, eliminarProyecto);
//router.get('/tareas/:id', checkAuth, obtenerTareas);
router.post('/colaboradores', checkAuth, buscarColaborador)
router.post('/colaboradores/:id', checkAuth, agregarColaborador);
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador);
export default router;
