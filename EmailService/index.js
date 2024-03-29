// EmailService/index.js
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}.secrets` });
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(cors()); // Habilitar CORS
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Endpoint para enviar el token por correo electrónico
app.post('/sendEmail', async (req, res) => {
    const { email, token } = req.body; 
    console.log(email, ",", token);

    let message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Tu Token de Logeo al Sistema',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #4A90E2;">Bienvenido a Tangle Network!</h2>
                <p>Hola,</p>
                <p>Hemos generado un token de acceso para ti. Utiliza este token para iniciar sesión en nuestro sistema.</p>
                <div style="background-color: #F7F7F7; padding: 15px; border-left: 5px solid #4A90E2; margin: 20px 0;">
                    <strong>Token:</strong> <span style="color: #FF6F61;">${token}</span>
                </div>
                <p>Si no has solicitado este token, por favor ignora este mensaje o contacta con nuestro soporte.</p>
                <p>Saludos,</p>
                <p>El Equipo de Tangle Network</p>
            </div>
        `
    };

    try {
        await sgMail.send(message);
        console.log('Email enviado: ' + info.messageId);
        res.send('Email enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el email:', error);
        res.status(500).send('Error al enviar email');
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`EmailService running on port ${PORT}`);
});
