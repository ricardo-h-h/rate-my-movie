import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Nosso arquivo de config
import { doc, onSnapshot } from 'firebase/firestore';

// 1. Criar o Contexto
const AuthContext = createContext();

// 2. Criar o Provedor
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // O usuário do Firebase Auth
  const [userData, setUserData] = useState(null); // Nossos dados (nome, foto) do Firestore
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Declarar a função de limpeza do Firestore no escopo do useEffect
    let unsubscribeFromFirestore = null; 

    // 2. Criar o listener principal do Auth
    const unsubscribeFromAuth = onAuthStateChanged(auth, (firebaseUser) => {
      
      // 4. LIMPAR qualquer listener antigo (de um utilizador anterior)
      //    antes de criar um novo.
      if (unsubscribeFromFirestore) {
        unsubscribeFromFirestore();
      }

      if (firebaseUser) {
        // === Utilizador LOGADO ===
        setUser(firebaseUser); 

        // 3. Criar o NOVO listener do Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeFromFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data()); 
          } else {
            setUserData(null); 
          }
          setLoading(false); // 5. Parar o loading SÓ DEPOIS de carregar os dados
        }, (error) => {
          // Erro ao ler o Firestore (ex: permissões)
          console.error("Erro no listener do Firestore:", error);
          setUserData(null);
          setLoading(false); // Parar o loading mesmo se der erro
        });

      } else {
        // === Utilizador DESLOGADO ===
        setUser(null);
        setUserData(null);
        setLoading(false); // 5. Parar o loading
        
        // 4. (Já foi feito no topo, mas garantimos aqui também)
        // A lógica principal é que o 'unsubscribeFromFirestore'
        // do utilizador anterior já foi limpo.
      }
    });

    // 6. Função de limpeza principal do useEffect
    // Isto é chamado quando o AuthProvider é desmontado
    return () => {
      unsubscribeFromAuth(); // Limpa o listener do Auth
      if (unsubscribeFromFirestore) {
        unsubscribeFromFirestore(); // Limpa o listener do Firestore
      }
    };
  }, []); // Array de dependências vazio, executa apenas uma vez

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook customizado para facilitar o uso
export const useAuth = () => {
  return useContext(AuthContext);
};