import React from 'react';
import { Button, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MainScreen = ({ navigation }) => {

    // Función para manejar la navegación a otros componentes o realizar otras acciones
    const handleAction = (action) => {
        switch (action) {
            case 'logout':
                // Implementa tu lógica para cerrar sesión
                navigation.navigate('Login');
                break;
            case 'profile':
                // Navegar a la pantalla de perfil
                // navigation.navigate('ProfileScreen');
                break;
            // Agrega aquí más casos según tus necesidades
            default:
                break;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Red Tangle Cliente/Servidor</Text>
                <Text style={styles.subtitle}>Realizado por Renzo Di Paola Jara</Text>
                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://example.com/cv')}>
                        <Text style={styles.link}>Ver CV</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://example.com/trabajo')}>
                        <Text style={styles.link}>Ver trabajo relacionado</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                {/* Aquí puedes implementar la lógica para subir archivos, consultar datos, etc. */}
                <Text style={styles.sectionTitle}>Acciones</Text>
                {/* Ejemplo de botones para diferentes acciones */}
                <Button title="Mi Perfil" onPress={() => handleAction('profile')} />
                <Button title="Subir Archivo" onPress={() => handleAction('upload')} />
                <Button title="Cerrar Sesión" onPress={() => handleAction('logout')} />
                {/* Agrega más botones o componentes según necesites */}
            </View>
            {/* Agrega aquí más secciones o componentes según tu aplicación */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    // Agrega más estilos según necesites
});

export default MainScreen;
