import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '../firebaseConfig'; 
import * as ImagePicker from 'expo-image-picker'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const { user, userData } = useAuth(); 
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
      await uploadImage(result.assets[0].uri);
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
      await uploadImage(result.assets[0].uri);
    }
  };


  const uploadImage = async (uri) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profile_pics/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        profilePicUrl: downloadURL
      });
      Alert.alert('Sucesso!', 'A sua foto de perfil foi atualizada.');
    } catch (e) {
      console.error("Erro ao fazer upload da imagem: ", e);
      Alert.alert('Erro', 'Não foi possível atualizar a sua foto.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <TouchableOpacity 
        onPress={pickImage} 
        accessibilityRole="button"
        accessibilityLabel="Mudar foto de perfil"
        accessibilityHint="Pressione para abrir a sua galeria de fotos"
      >
        <Image
          style={styles.profilePic}
          source={{ uri: userData?.profilePicUrl || 'https://placehold.co/150x150/007bff/white?text=Perfil' }}
          accessibilityLabel={`Foto de perfil de ${userData?.name || 'utilizador'}`}
        />
        <Text style={styles.changePicText}>Mudar Foto (Galeria)</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 10 }} accessibilityLabel="A carregar" />}

      <Text style={styles.name} accessible={true}>Olá, {userData?.name}</Text>
      <Text style={styles.email} accessible={true}>Email: {userData?.email}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Tirar Foto (Câmara)" 
          onPress={takePhoto} 
          disabled={loading}
          accessibilityLabel="Tirar foto com a câmara"
          accessibilityHint="Pressione para abrir a câmara"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Logout" 
          onPress={handleLogout} 
          color="red" 
          disabled={loading} 
          accessibilityLabel="Botão de Logout"
          accessibilityHint="Pressione para sair da sua conta"
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75, 
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  changePicText: {
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    padding: 5,  
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  email: { 
    fontSize: 16, 
    color: 'gray', 
    marginTop: 5, 
    marginBottom: 30 
  },
  buttonContainer: {
    width: '80%', 
    marginVertical: 5,
  }
});

export default ProfileScreen;