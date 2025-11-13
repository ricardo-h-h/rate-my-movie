import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import { useAuth } from '../contexts/AuthContext'; 
import { IMAGE_BASE_URL } from '../apiConfig';
import { Ionicons } from '@expo/vector-icons';

const MyMoviesScreen = ({ navigation }) => {
  const [savedMovies, setSavedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth(); 
  const userId = user?.uid; 

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setSavedMovies([]); 
      return; 
    }
    setLoading(true); 
    const moviesCollectionRef = collection(db, 'users', userId, 'watched_movies');
    const unsubscribe = onSnapshot(moviesCollectionRef, (snapshot) => {
      const moviesData = snapshot.docs.map(doc => doc.data());
      setSavedMovies(moviesData);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar filmes salvos: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]); 

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate('MovieDetails', { movie: item })}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${item.title}`}
      accessibilityHint={`Sua nota: ${item.userRating || 'não avaliado'} de 10`}
    >
      <Image
        style={styles.poster}
        source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
        accessibilityRole="image"
        accessibilityLabel={`Poster do filme ${item.title}`}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>
          Lançamento: {item.release_date || 'N/A'}
        </Text>
        
        {item.userRating > 0 ? (
          <View style={styles.userRatingContainer} 
            accessible={true} 
            accessibilityLabel={`Sua nota: ${item.userRating} de 10`}
          >
            <Ionicons name="star" size={16} color="#007bff" />
            <Text style={styles.userRatingText}>Minha Nota: {item.userRating}/10</Text>
          </View>
        ) : (
          <Text style={styles.itemSubtitle}>Sem avaliação</Text>
        )}
        
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.centered} accessibilityLabel="A carregar os seus filmes" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={savedMovies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText} accessible={true}>Você ainda não salvou nenhum filme.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    minHeight: 44, 
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  userRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#e6f2ff',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start', 
  },
  userRatingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0056b3',
  },
});

export default MyMoviesScreen;