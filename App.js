import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';

// O App.js agora só "provê" os contextos e chama o navegador
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}