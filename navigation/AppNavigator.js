import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
// Importamos o navegador de separadores (tabs)
import MainTabNavigator from './MainTabNavigator'; 
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  // Mostra um "loading" enquanto o Firebase verifica o login
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // === STACK PRINCIPAL (Usuário Logado) ===
          // Mostra os separadores
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          // === STACK DE AUTENTICAÇÃO (Usuário Deslogado) ===
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;