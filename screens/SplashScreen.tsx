import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';

// --- Explicación de las importaciones ---
// React y useEffect: Son el núcleo de React. `useEffect` nos permite ejecutar código después de que el componente se renderice, ideal para la redirección.
// View, Text, Image, StyleSheet: Componentes básicos de React Native para construir la interfaz.
//    - View: Es un contenedor similar a un `<div>` en la web.
//    - Text: Para mostrar texto.
//    - Image: Para mostrar imágenes.
//    - StyleSheet: Para crear y organizar los estilos de una manera optimizada.
// useRouter: Es un "hook" de `expo-router` que nos permite controlar la navegación entre pantallas.
// nativewind: Ya no se necesita la función `styled`. NativeWind ahora permite usar `className` directamente en los componentes de React Native.

// --- Definición del componente SplashScreen ---
// Este es el componente funcional que define nuestra pantalla de bienvenida.
const SplashScreen = () => {
  // --- Variables y Hooks ---
  // router: Es una instancia del hook `useRouter`. Lo usaremos para navegar a la pantalla de login.
  const router = useRouter();

  // --- Lógica de redirección ---
  // useEffect se ejecuta una vez que el componente se ha montado en la pantalla.
  useEffect(() => {
    // setTimeout es una función de JavaScript que ejecuta un código después de un tiempo determinado.
    // Aquí, esperaremos 3000 milisegundos (3 segundos).
    const timer = setTimeout(() => {
      // router.replace('/login') navega a la pantalla de 'login'.
      // Usamos 'replace' en lugar de 'push' para que el usuario no pueda volver atrás al Splash Screen desde la pantalla de login.
      // Hacemos un type casting a Href para solucionar el error de tipado de Expo Router.
      router.replace('/login' as Href);
    }, 3000);

    // Esta es una función de limpieza. Si el componente se desmonta antes de que pasen los 3 segundos,
    // se cancelará el temporizador para evitar errores.
    return () => clearTimeout(timer);
  }, []); // El array de dependencias está vacío, por lo que el efecto solo se ejecuta una vez.

  // --- Renderizado de la Interfaz (UI) ---
  // Se usan estilos de StyleSheet para asegurar el centrado.
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        Manuales de Contrataciones
      </Text>
    </View>
  );
};

// --- Estilos ---
// Se utiliza StyleSheet para un control más preciso y robusto del diseño.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center',   // Centra horizontalmente
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937', // Gris oscuro
    textAlign: 'center',
  },
});

export default SplashScreen;
