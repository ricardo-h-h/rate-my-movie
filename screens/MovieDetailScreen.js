import React, { useState, useEffect, useMemo } from 'react'; 
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGE_BASE_URL } from '../apiConfig';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import { useAuth } from '../contexts/AuthContext'; 
import { Rating } from 'react-native-ratings';

const MovieDetailScreen = ({ route }) => {
  const { movie } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userRating, setUserRating] = useState(0); 

  const { user } = useAuth();
  const userId = user?.uid;

  // (Funções useMemo, useEffect, handleToggleSave
  //  permanecem as mesmas da última vez)
  // ... (useMemo, useEffect, handleToggleSave) ...
  const movieDocRef = useMemo(() => {
    if (userId && movie?.id) {
      return doc(db, 'users', userId, 'watched_movies', movie.id.toString());
    }
    return null; 
  }, [userId, movie?.id]);

  useEffect(() => {
    if (!movieDocRef) {
      setIsChecking(false);
      return;
    }
    const checkIfSaved = async () => {
      setIsChecking(true);
      try {
        const docSnap = await getDoc(movieDocRef);
        if (docSnap.exists()) {
          setIsSaved(true);
          setUserRating(docSnap.data().userRating || 0); 
        } else {
          setIsSaved(false);
          setUserRating(0); 
        }
      } catch (error) {
        console.error("Erro ao verificar filme salvo:", error);
        setIsSaved(false); 
        setUserRating(0);
      } finally {
        setIsChecking(false);
      }
    };
    checkIfSaved();
  }, [movieDocRef]); 

  const handleToggleSave = async () => {
    if (!movieDocRef) {
      Alert.alert("Erro", "Não foi possível salvar, utilizador não encontrado.");
      return;
    }
    if (!isSaved && userRating === 0) {
      Alert.alert("Avaliação necessária", "Por favor, dê uma nota (1-10) ao filme antes de salvar.");
      return;
    }
    setIsSaving(true); 
    try {
      if (isSaved) {
        await deleteDoc(movieDocRef);
        setIsSaved(false);
        setUserRating(0); 
        Alert.alert("Removido!", `${movie.title} foi removido da sua lista.`);
      } else {
        await setDoc(movieDocRef, {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          overview: movie.overview, 
          vote_count: movie.vote_count,
          userRating: userRating, 
        });
        setIsSaved(true);
        Alert.alert("Salvo!", `${movie.title} foi adicionado à sua lista com nota ${userRating}.`);
      }
    } catch (error) {
      console.error("Erro ao salvar filme: ", error);
      Alert.alert("Erro", "Não foi possível atualizar a sua lista.");
    } finally {
      setIsSaving(false); 
    }
  };


  // Renderização do botão de salvar
  const renderSaveButton = () => {
    if (isChecking) {
      return <ActivityIndicator size="small" color="#007bff" style={styles.buttonSpacer} accessibilityLabel="A verificar se o filme está salvo" />;
    }
    
    if (isSaving) {
      return <ActivityIndicator size="small" color="#007bff" style={styles.buttonSpacer} accessibilityLabel="A salvar alterações" />;
    }
    
    const buttonTitle = isSaved ? "Remover da Lista" : `Salvar com Nota ${userRating}/10`;

    return (
      <View style={styles.buttonSpacer}>
        <Button
          title={buttonTitle}
          onPress={handleToggleSave}
          color={isSaved ? "#E53935" : "#007bff"}
          // RF07: Label do botão muda dinamicamente
          accessibilityLabel={isSaved ? "Botão Remover da Lista" : `Botão Salvar com Nota ${userRating} de 10`}
          disabled={!isSaved && userRating === 0} 
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          style={styles.poster}
          source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
          // RF07: Label da imagem
          accessibilityRole="image"
          accessibilityLabel={`Poster do filme ${movie.title}`}
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title} accessible={true}>{movie.title}</Text>
          
          {/* RF04 - Secção de Avaliação do Utilizador */}
          <Text style={styles.ratingTitle} accessible={true}>Minha Avaliação</Text>
          <View 
            style={styles.ratingContainer}
            // RF07: Label para o componente de estrelas
            accessible={true}
            accessibilityLabel={`Minha avaliação atual: ${userRating} de 10 estrelas. Pressione para avaliar.`}
          >
            <Rating
              type='star'
              ratingCount={10} // Escala de 1 a 10
              imageSize={30}
              startingValue={userRating} // Começa com a nota salva
              onFinishRating={(rating) => setUserRating(rating)} // Atualiza o estado da nota
              tintColor='#f5f5f5' // Cor de fundo do ecrã de detalhes
            />
          </View>
          
          {/* Botão de Salvar (RF05) */}
          {renderSaveButton()}
          
          <View style={styles.infoContainer}>
            <View style={styles.infoBox} accessible={true} accessibilityLabel={`Nota média: ${movie.vote_average.toFixed(1)} de 10, com ${movie.vote_count} votos`}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.infoText}>{movie.vote_average.toFixed(1)} / 10</Text>
              <Text style={styles.infoSubText}>{movie.vote_count} votos</Text>
            </View>
            <View style={styles.infoBox} accessible={true} accessibilityLabel={`Data de lançamento: ${movie.release_date || 'N/A'}`}>
              <Ionicons name="calendar" size={24} color="#888" />
              <Text style={styles.infoText}>{movie.release_date || 'N/A'}</Text>
              <Text style={styles.infoSubText}>Lançamento</Text>
            </View>
          </View>

          <Text style={styles.overviewTitle}>Sinopse</Text>
          <Text style={styles.overview} accessible={true}>{movie.overview || 'Sinopse não disponível.'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' }, 
  poster: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  ratingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  ratingContainer: {
    backgroundColor: '#f5f5f5',
    alignItems: 'flex-start', 
    marginBottom: 10,
    // RF07: Garantir alvo de toque mínimo
    minHeight: 44,
    justifyContent: 'center'
  },
  buttonSpacer: {
    marginVertical: 20, 
    minHeight: 44, // RF07
    justifyContent: 'center'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    backgroundColor: '#fff', 
    padding: 15,
    borderRadius: 10,
  },
  infoBox: {
    alignItems: 'center',
    minHeight: 44, // RF07
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  infoSubText: {
    fontSize: 12,
    color: 'gray',
  },
  overviewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default MovieDetailScreen;