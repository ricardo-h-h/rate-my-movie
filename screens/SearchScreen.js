import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_KEY, API_BASE_URL, IMAGE_BASE_URL } from '../apiConfig'; 
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    const url = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (e) {
      setError('Falha ao buscar filmes. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate('MovieDetails', { movie: item })}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${item.title}`}
      accessibilityHint={`Lançado em ${item.release_date || 'N/A'}. Nota ${item.vote_average.toFixed(1)}`}
    >
      <Image
        style={styles.poster}
        source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
        accessibilityRole="image"
        accessibilityLabel={`Poster do filme ${item.title}`}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle} numberOfLines={1}>
          Lançamento: {item.release_date || 'N/A'}
        </Text>
        <View style={styles.ratingContainer} accessible={true} accessibilityLabel={`Nota média ${item.vote_average.toFixed(1)} de 10`}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.itemRating}>{item.vote_average.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por um filme..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch} 
          returnKeyType="search"
          accessibilityLabel="Campo de busca de filmes"
          accessibilityHint="Insira o nome do filme que deseja buscar"
        />
        <Button 
          title="Buscar" 
          onPress={handleSearch} 
          accessibilityLabel="Botão de buscar" 
          accessibilityHint="Pressione para iniciar a busca"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.centered} accessibilityLabel="A buscar filmes" />
      ) : error ? (
        <Text style={styles.errorText} accessible={true}>{error}</Text>
      ) : (
        <FlatList
          data={results}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText} accessible={true}>Nenhum resultado encontrado.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 44,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  list: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 16,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  itemRating: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchScreen;