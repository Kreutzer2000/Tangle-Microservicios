// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from './src/screens/LoginScreen';
import MainScreen from './src/screens/MainScreen'; // Asegúrate de crear este componente
import ProfileScreen from './src/screens/ProfileScreen'; // Asegúrate de tener esta pantalla
import RegisterScreen from './src/screens/RegisterScreen'; // Asegúrate de crear este componente
// Importa tus otras pantallas aquí

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="MainScreen" component={MainScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                {/* Configura aquí el resto de tus pantallas */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
