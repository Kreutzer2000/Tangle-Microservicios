// EmailService/index.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors()); // Habilitar CORS
app.use(express.json());

// Configuración del transportador SMTP para Outlook
let transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
        user: 'rdipaolaj@outlook.com',
        pass: '12Enero2000***'
    }
});

// Endpoint para enviar el token por correo electrónico
app.post('/sendEmail', async (req, res) => {
    const { email, token } = req.body; // Asumimos que el email y token son enviados en el cuerpo de la solicitud

    let mailOptions = {
        from: 'rdipaolaj@outlook.com',
        to: email,
        subject: 'Tu Token de Logeo al Sistema',
        text: `Tu token es: ${token} \nUsa este token para entrar al sistema.`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email enviado: ' + info.response);
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
