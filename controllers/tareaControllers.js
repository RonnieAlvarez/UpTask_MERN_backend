import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';
import mongoose from 'mongoose';

const agregarTarea = async (req, res) => {
	const { proyecto } = req.body;
	//console.log('agregar tarea: ',proyecto)
	const existeProyecto = await Proyecto.findById(proyecto);

	if (!existeProyecto) {
		const error = new Error('El proyecto no Existe');
		return res.status(404).json({ msg: error.message });
	}

	if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error('El usuario no tiene permisos para añadir');
		return res.status(403).json({ msg: error.message });
	}

	const new_id = new mongoose.Types.ObjectId();
	const tareaPorAlmacenar = new Tarea(req.body);
	tareaPorAlmacenar._id = new_id;

	try {
		const tareaAlmacenada = await Tarea.create(tareaPorAlmacenar);

		//TODO:
		//		console.log('id de ? : ',tareaAlmacenada)
		existeProyecto.tareas.push(tareaAlmacenada._id);
		await existeProyecto.save();
		//		console.log('tarea almacenada', tareaAlmacenada)
		res.json(tareaAlmacenada);
	} catch (error) {
		console.error(error);
	}
};

const obtenerTarea = async (req, res) => {
	const { id } = req.params;
	const tarea = await Tarea.findById(id).populate('proyecto');
	if (!tarea) {
		const error = new Error('Tarea no encontrada');
		return res.status(404).json({ msg: error.message });
	}
	if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error('Acción no válida');
		return res.status(403).json({ msg: error.message });
	}
	res.json(tarea);
};

const actualizarTarea = async (req, res) => {
	const { id } = req.params;
	const tarea = await Tarea.findById(id).populate('proyecto');
	if (!tarea) {
		const error = new Error('Tarea no encontrada');
		return res.status(404).json({ msg: error.message });
	}
	if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error('Acción no válida');
		return res.status(403).json({ msg: error.message });
	}
	tarea.nombre = req.body.nombre || tarea.nombre;
	tarea.descripcion = req.body.descripcion || tarea.descripcion;
	tarea.prioridad = req.body.prioridad || tarea.prioridad;
	tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

	try {
		const tareaAlmacendada = await tarea.save();
		res.json(tareaAlmacendada);
	} catch (error) {
		console.log(error);
	}
};

const eliminarTarea = async (req, res) => {
	const { id } = req.params;
	const tarea = await Tarea.findById(id).populate('proyecto');
	if (!tarea) {
		const error = new Error('Tarea no encontrada');
		return res.status(404).json({ msg: error.message });
	}
	if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error('Acción no válida');
		return res.status(403).json({ msg: error.message });
	}
	try {
		const proyecto = await Proyecto.findById(tarea.proyecto)
		proyecto.tareas.pull(tarea._id)

		await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);

		res.json({ msg: 'La tarea se Eliminó correctamente' });
	} catch (error) {
		console.log(error.message);
	}
};

const cambiarEstado = async (req, res) => {
	const { id } = req.params;
	const tarea = await Tarea.findById(id).populate('proyecto');
	if (!tarea) {
		const error = new Error('Tarea no encontrada');
		return res.status(404).json({ msg: error.message });
	}
	if (
		tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
		tarea.proyecto.colaboradores.some((colaborador) =>
			colaborador._id.toString() !== req.usuario._id.toString())
	) {
		const error = new Error('Acción no válida');
		return res.status(403).json({ msg: error.message });
	}
	tarea.estado = !tarea.estado
	tarea.completado = req.usuario._id
	await tarea.save();
	const tareaAlmacenada = await Tarea.findById(id).populate('proyecto').populate('completado');
	res.json(tareaAlmacenada);
};

export { agregarTarea, obtenerTarea, actualizarTarea, cambiarEstado, eliminarTarea };
