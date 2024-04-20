import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

/******************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Herramienta de gestión de los tokens de autenticación
 * 
 ******************************************/

interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone: number;
  type: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  //Buscamos si el usuario tiene un token guardado en el local (no ha hecho logout)
  useEffect(() => {
    const token = localStorage.getItem('token');
      try {
        if (token) {
          // Decodificar el token para obtener los datos del usuario
          const decodedToken = jwtDecode(token) as { userId: string, email: string, name: string, surname: string, phone: number, type: string };;
          // Establecer el usuario con los datos obtenidos del token
          const userData: User = {
            id: decodedToken.userId,
            email: decodedToken.email,
            name: decodedToken.name,
            surname: decodedToken.surname,
            phone: decodedToken.phone,
            type: decodedToken.type
          };
          setUser(userData);
          localStorage.setItem('id', userData.id);
        }
      } catch (error) {
        //console.log('Token no valido:', error);
      }

  }, []);


  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token) as { userId: string, email: string, name: string, surname: string, phone: number, type: string };
    const userData: User = {
      id: decodedToken.userId,
      email: decodedToken.email,
      name: decodedToken.name,
      surname: decodedToken.surname,
      phone: decodedToken.phone,
      type: decodedToken.type
    };
    setUser(userData);
    setToken(token);
    localStorage.setItem('id', userData.id);
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    navigate('/', { replace: true });
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
