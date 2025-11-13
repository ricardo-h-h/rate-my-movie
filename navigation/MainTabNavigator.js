import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import SearchScreen from '../screens/SearchScreen';
import MyMoviesScreen from '../screens/MyMoviesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
      options={{ title: 'Detalhes do Filme', headerBackTitle: 'Voltar' }}
    />
  </Stack.Navigator>
);

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
      options={{ title: 'Detalhes do Filme', headerBackTitle: 'Voltar' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ title: 'Meu Perfil' }} 
    />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'SearchStack') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MyMoviesStack') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
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
          tabBarAccessibilityLabel: 'Buscar Filmes, Separador 1 de 3'
        }} 
      />
      <Tab.Screen 
        name="MyMoviesStack" 
        component={MyMoviesStack} 
        options={{ 
          title: 'Meus Filmes',
          tabBarAccessibilityLabel: 'Meus Filmes, Separador 2 de 3'
        }} 
      />
      <Tab.Screen 
        name="ProfileStack" 
        component={ProfileScreen} 
        options={{ 
          title: 'Perfil',
          tabBarAccessibilityLabel: 'Perfil, Separador 3 de 3'
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;