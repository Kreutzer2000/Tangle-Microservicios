// scr/screens/LoginScreen.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            // Limpia los campos cuando la pantalla pierde el enfoque
            clearFields();
        });

        return unsubscribe;
    }, [navigation]);

    const clearFields = () => {
        setUsername('');
        setPassword('');
        setToken('');
    };

    const validateInput = () => {
        // Agrega aquí las validaciones que necesitas
        if (!username.trim() || !password.trim() || !token.trim()) {
            alert('Por favor complete todos los campos requeridos para iniciar sesión.');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateInput()) {
            return;
        }
        
        try {
            // Aquí agregarías la lógica para llamar a tu API
            console.log('Username:', username);
            console.log('Password:', password);
            console.log('Token:', token);

            const response = await axios.post('http://192.168.198.124:3004/login', { // http://192.168.198.124:3004/login // http://192.168.18.27:3004/login
                usuario: username,
                contrasena: password,
                token: token,
            });
            console.log('Response:', response.data);
            if (response.data.userId) {
                // Aquí debes guardar el token en algún lugar seguro
                // como AsyncStorage o tu estado global si estás usando Redux o Context API.
                // Por ejemplo: AsyncStorage.setItem('accessToken', response.data.token);
                // AsyncStorage.setItem('userId', response.data.userId);

                navigation.navigate('MainScreen', { userId: response.data.userId });
                // navigation.navigate('Drawer', {
                //     screen: 'Home',
                //     params: { userId: response.data.userId },
                // });
                clearFields();
            } else {
                Alert.alert('Error', 'UserId no está presente en la respuesta del servidor');
            }

        } catch (error) {
            console.error(error);
            let message = 'Error al iniciar sesión en el servidor';
            if (error.response && error.response.status === 401) {
                message = 'Su Contraseña o Usuario son incorrectos';
            }
            Alert.alert('Error', message);
        }
    };

    // Nueva función para manejar la navegación al registro
    const navigateToRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Nombre de usuario"
                style={styles.input}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                value={token}
                onChangeText={setToken}
                placeholder="Token"
                style={styles.input}
            />
            <Button title="Iniciar Sesión" onPress={handleLogin} />
            {/* <Button
                title="Registrarse"
                onPress={navigateToRegister}
                color="blue" // O el color que prefieras
            /> */}

            {/* Si prefieres un texto presionable en lugar de un botón: */}
            <Text onPress={navigateToRegister} style={styles.registerText}>
                ¿No tienes una cuenta? Regístrate aquí
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginVertical: 8,
        fontSize: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginVertical: 8,
    },
    registerText: {
        color: 'blue', // O el color que prefieras
        marginTop: 20,
        textAlign: 'center',
    },
});

export default LoginScreen;
