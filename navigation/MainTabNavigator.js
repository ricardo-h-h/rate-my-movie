import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Importamos os ecrãs
import SearchScreen from '../screens/SearchScreen';
import MyMoviesScreen from '../screens/MyMoviesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';

// Precisamos de ícones
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// RF03 e RF04 (Busca e Detalhes) são uma pilha
const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Search" 
      component={SearchScreen} 
      options={{ title: 'Buscar Filmes' }} 
    />
    <Stack.Screen 
      name="MovieDetails" 
      component={MovieDetailScreen} 
      // RF07: Label descritivo para o botão "Voltar"
      options={{ title: 'Detalhes do Filme', headerBackTitle: 'Voltar' }}
    />
  </Stack.Navigator>
);

// RF05 (Meus Filmes)
const MyMoviesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MyMovies" 
      component={MyMoviesScreen} 
      options={{ title: 'Meus Filmes' }} 
    />
    <Stack.Screen 
      name="MovieDetails" 
      component={MovieDetailScreen} 
      // RF07: Label descritivo para o botão "Voltar"
      options={{ title: 'Detalhes do Filme', headerBackTitle: 'Voltar' }}
    />
  </Stack.Navigator>
);

// RF02 (Perfil)
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ title: 'Meu Perfil' }} 
    />
  </Stack.Navigator>
);

// O Navegador Principal com os Separadores (Abas) em baixo
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Escondemos o header do TabNavigator
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'SearchStack') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MyMoviesStack') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          // RF07: Adiciona 'accessibilityLabel' ao ícone (importante)
          // (O React Navigation usa o 'tabBarIcon' para isto de forma inteligente,
          // mas o 'tabBarAccessibilityLabel' na opção abaixo é o principal)
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="SearchStack" 
        component={SearchStack} 
        options={{ 
          title: 'Buscar',
          // RF07: Label para o leitor de ecrã
          tabBarAccessibilityLabel: 'Buscar Filmes, Separador 1 de 3'
        }} 
      />
      <Tab.Screen 
        name="MyMoviesStack" 
        component={MyMoviesStack} 
        options={{ 
          title: 'Meus Filmes',
          // RF07: Label para o leitor de ecrã
          tabBarAccessibilityLabel: 'Meus Filmes, Separador 2 de 3'
        }} 
      />
      <Tab.Screen 
        name="ProfileStack" 
        component={ProfileScreen} 
        options={{ 
          title: 'Perfil',
          // RF07: Label para o leitor de ecrã
          tabBarAccessibilityLabel: 'Perfil, Separador 3 de 3'
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;