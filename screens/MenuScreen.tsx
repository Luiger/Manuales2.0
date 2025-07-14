import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AuthService } from '../src/services/auth.service';
import { UserService } from '../src/services/user.service';
import HeaderAvatar from '../components/HeaderAvatar';
// 1. Se importa el nuevo ícono 'ChevronLeftIcon' y se elimina 'ArrowLeftIcon'
import { ChevronRightIcon, ArrowRightOnRectangleIcon, PencilSquareIcon, KeyIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';

const MenuScreen = () => {
    const router = useRouter();
    const [user, setUser] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await UserService.getProfile();
            if(response.success && response.data) {
                setUser({
                    name: `${response.data.Nombre} ${response.data.Apellido}`,
                    email: response.data.Email,
                });
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await AuthService.logout();
        router.replace('/login');
    };

    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#1E3A8A" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header manual para tener control total sobre el layout y la flecha */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    {/* 2. Se utiliza el nuevo ícono ChevronLeftIcon */}
                    <ChevronLeftIcon size={28} color="#1F2937" />
                </TouchableOpacity>
            </View>

            {/* Contenido principal de la pantalla */}
            <View style={styles.content}>
                <View>
                    <View style={styles.profileSection}>
                        <HeaderAvatar />
                        <Text style={styles.profileName}>{user.name}</Text>
                        <Text style={styles.profileSubtitle}>Cuenta Personal</Text>
                    </View>

                    <View style={styles.menuItemsContainer}>
                        <MenuItem 
                            text="Editar Perfil" 
                            icon={<PencilSquareIcon color="#4B5563" />}
                            onPress={() => router.push('/(profile)/edit')}
                        />
                        <MenuItem 
                            text="Cambiar Contraseña" 
                            icon={<KeyIcon color="#4B5563" />}
                            onPress={() => router.push('/(profile)/change-password')}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <ArrowRightOnRectangleIcon color="#EF4444" style={{marginRight: 8}}/>
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

type MenuItemProps = {
    text: string;
    icon: React.ReactNode;
    onPress: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ text, icon, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        {icon}
        <Text style={styles.menuItemText}>{text}</Text>
        <ChevronRightIcon color="#9CA3AF" style={{ marginLeft: 'auto' }}/>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50, 
    },
    backButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    centered: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    profileSection: { 
        alignItems: 'center',
        paddingBottom: 24,
    },
    profileName: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginTop: 12 
    },
    profileSubtitle: { 
        fontSize: 16, 
        color: '#6B7280', 
        marginTop: 4 
    },
    menuItemsContainer: { 
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 16,
    },
    menuItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 16, 
        paddingHorizontal: 24 
    },
    menuItemText: { 
        fontSize: 18, 
        marginLeft: 16 
    },
    logoutButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 20,
        borderTopWidth: 1, 
        borderTopColor: '#E5E7EB' 
    },
    logoutText: { 
        fontSize: 18, 
        color: '#EF4444', 
        fontWeight: 'bold' 
    },
});

export default MenuScreen;
