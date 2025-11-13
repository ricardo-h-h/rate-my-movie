import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para aceder à galeria.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri); 
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para aceder à câmara.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri, uid) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profile_pics/${uid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      await uploadTask;
      return await getDownloadURL(uploadTask.snapshot.ref);
    } catch (e) {
      console.error("Erro ao fazer upload da imagem: ", e);
      throw new Error("Não foi possível fazer o upload da foto de perfil.");
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    let profilePicUrl = null; 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (imageUri) {
        Alert.alert("Aguarde", "A criar conta e a fazer upload da sua foto...");
        profilePicUrl = await uploadImage(imageUri, user.uid);
      }

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        profilePicUrl: profilePicUrl,
      });
    } catch (error) {
      Alert.alert("Erro no Cadastro", error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title} accessible={true}>Criar Conta</Text>

      <TouchableOpacity 
        onPress={pickImage} 
        accessibilityRole="button"
        accessibilityLabel="Selecionar foto de perfil da galeria"
        accessibilityHint="Pressione para abrir a sua galeria de fotos"
      >
        <Image
          style={styles.profilePic}
          source={{ uri: imageUri || 'https://placehold.co/150x150/007bff/white?text=Perfil' }}
          accessibilityLabel={imageUri ? "Foto de perfil selecionada" : "Placeholder de foto de perfil"}
        />
        <Text style={styles.changePicText}>Escolher (Galeria)</Text>
      </TouchableOpacity>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Tirar Foto (Câmara)" 
          onPress={takePhoto} 
          disabled={loading}
          color="#555"
          accessibilityLabel="Tirar foto com a câmara"
          accessibilityHint="Pressione para abrir a câmara e tirar uma foto"
        />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
        accessibilityLabel="Campo de nome completo"
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Campo de e-mail"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (mín. 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        accessibilityLabel="Campo de senha"
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" accessibilityLabel="A processar cadastro" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button 
            title="Cadastrar" 
            onPress={handleRegister} 
            accessibilityLabel="Botão de Cadastrar" 
            accessibilityHint="Pressione para finalizar o seu cadastro"
          />
        </View>
      )}

      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')} 
        disabled={loading}
        accessibilityRole="link"
        accessibilityLabel="Ir para o login"
        accessibilityHint="Pressione se já tem uma conta"
      >
        <Text style={styles.switchText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  profilePic: {
    width: 120, 
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    alignSelf: 'center', 
  },
  changePicText: {
    color: '#007bff',
    textAlign: 'center',
    marginVertical: 10, 
    fontSize: 16,
    padding: 5,  
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 5,
  },
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

export default RegisterScreen;