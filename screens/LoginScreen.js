import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Erro no Login", "E-mail ou senha inválidos.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title} accessible={true}>Rate My Movie</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Campo de e-mail"
        accessibilityHint="Insira o seu e-mail de cadastro"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Campo de senha"
        accessibilityHint="Insira a sua senha"
      />
      <Button 
        title="Login" 
        onPress={handleLogin} 
        accessibilityLabel="Botão de Login" 
        accessibilityHint="Pressione para entrar na sua conta"
      />
      <TouchableOpacity 
        onPress={() => navigation.navigate('Register')}
        accessibilityRole="link"
        accessibilityLabel="Ir para o cadastro"
        accessibilityHint="Pressione se ainda não tem uma conta"
      >
        <Text style={styles.switchText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: {
    height: 50, 
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  switchText: { 
    color: '#007bff', 
    textAlign: 'center', 
    marginTop: 20,
    fontSize: 16,
    padding: 10, 
  },
});

export default LoginScreen;