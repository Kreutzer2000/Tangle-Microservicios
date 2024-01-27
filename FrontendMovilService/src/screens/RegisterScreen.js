// src/screens/RegisterScreen.js
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

const RegisterScreen = ({ navigation }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');

    // Funciones de validación
    const esSoloLetras = (input) => /^[a-zA-Z\s]+$/.test(input);
    const esUsuarioValido = (input) => /^[a-zA-Z0-9]+$/.test(input);
    const esSoloNumeros = (input) => /^\d+$/.test(input);
    const esCorreoValido = (email) => /\S+@\S+\.\S+/.test(email);

    const handleRegister = async () => {
        // Validaciones
        if (!esSoloLetras(nombre) || !esSoloLetras(apellido)) {
            Alert.alert('Error', 'Nombre y apellido solo deben contener letras.');
            return;
        }
        if (!esUsuarioValido(usuario)) {
            Alert.alert('Error', 'El usuario solo puede contener letras y números.');
            return;
        }
        if (!esCorreoValido(email)) {
            Alert.alert('Error', 'El email no es válido.');
            return;
        }
        if (!esSoloNumeros(telefono)) {
            Alert.alert('Error', 'El teléfono solo puede contener números.');
            return;
        }
        if (!nombre || !apellido || !email || !telefono || !usuario || !contrasena) {
            Alert.alert('Error', 'Todos los campos son obligatorios.');
            return;
        }

        // Aquí deberías añadir más validaciones según tus necesidades...
        
        try {
            // Hacer la petición POST al servidor para registrar al usuario
            const response = await axios.post('http://192.168.18.27:3004/register', {
                nombre,
                apellido,
                email,
                usuario,
                contrasena,
                telefono
            });

            if (response.status === 201) {
                Alert.alert('Éxito', 'El usuario ha sido registrado exitosamente.', [
                    { text: "OK", onPress: () => navigation.navigate('Login') }
                ]);
            } else {
                Alert.alert('Error', 'Error al registrar usuario');
            }
        } catch (error) {
            console.error(error);
            let message = 'Error al registrar usuario';
            if (error.response && error.response.data) {
                message = error.response.data.message || message;
            }
            Alert.alert('Error', message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Registro de Usuario</Text>
            <TextInput
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre"
                style={styles.input}
            />
            <TextInput
                value={apellido}
                onChangeText={setApellido}
                placeholder="Apellido"
                style={styles.input}
            />
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                style={styles.input}
            />
            <TextInput
                value={telefono}
                onChangeText={setTelefono}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                style={styles.input}
            />
            <TextInput
                value={usuario}
                onChangeText={setUsuario}
                placeholder="Nombre de Usuario"
                style={styles.input}
            />
            <TextInput
                value={contrasena}
                onChangeText={setContrasena}
                placeholder="Contraseña"
                secureTextEntry
                style={styles.input}
            />
            <Button title="Registrar" onPress={handleRegister} />
            <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}>
                ¿Ya tienes una cuenta? Inicia sesión aquí
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
    },
    loginLink: {
        color: 'blue',
        marginTop: 15,
        textAlign: 'center',
    },
});

export default RegisterScreen;