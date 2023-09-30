import mongoose from "mongoose";
import bcrypt from "bcrypt";
const usuarioSchema = mongoose.Schema(
	{
	
		nombre: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		token: {
			type: String,
		},
		confirmado: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

usuarioSchema.pre('save', async function(next) {
	//verifica que el usuario no ah sido modificado
	if (!this.isModified('password')) {
		next()
	}
	//cambia el password a hash
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
	return await bcrypt.compare(passwordFormulario,this.password);
}

const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario