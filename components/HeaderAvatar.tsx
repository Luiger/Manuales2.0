import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserService } from '../src/services/user.service'; // Usamos el nuevo servicio
import { useIsFocused } from '@react-navigation/native';

const HeaderAvatar = () => {
    const [initials, setInitials] = useState('');
    const isFocused = useIsFocused(); // Hook para saber si la pantalla está activa

    useEffect(() => {
        const fetchInitials = async () => {
            const response = await UserService.getProfile();
            if (response.success && response.data) {
                const { Nombre, Apellido } = response.data;
                const firstInitial = Nombre ? Nombre.charAt(0) : '';
                const lastInitial = Apellido ? Apellido.charAt(0) : '';
                setInitials(`${firstInitial}${lastInitial}`.toUpperCase());
            }
        };

        if(isFocused){
           fetchInitials();
        }
    }, [isFocused]); // Se ejecuta cada vez que la pantalla obtiene foco

    return (
        <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1E3A8A', // Color primario
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HeaderAvatar;
