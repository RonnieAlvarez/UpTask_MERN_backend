import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => { 
const {email,nombre,token} = datos;
  
  const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
  
  // informacion del email

  const info = await transport.sendMail({
    from: '"Uptask - Administrador de Proyectos" <proyectos@uptask.com>',
    to: email,
    subject: "UpTask - Confirma tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola: ${nombre} Confirma tu cuenta en UpTask</p>
    <p>Tu cuenta esta casi lista, solo falta que confirmes en el siguiente enlace:</p>
    
    <A href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</A>

    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  })
}

export const emailOlvidePassword = async (datos) => {
	const { email, nombre, token } = datos;
	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	// informacion del email

	const info = await transport.sendMail({
		from: '"Uptask - Administrador de Proyectos" <proyectos@uptask.com>',
		to: email,
		subject: 'UpTask - Restablece tu Password',
		text: 'Restablece tu Password en UpTask',
		html: `<p>Hola: ${nombre} Has solicitado restablecer tu password en UpTask</p>
    <p>Para generar un nuevo password sigue el siguiente enlace:</p>
    
    <A href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</A>

    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    `,
	});
};