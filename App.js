import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomePage/HomeScreen';
import SignupScreen from './screens/Signup/SignupScreen';
import LoginScreen from './screens/LoginPage/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import store from './ReduxStore/Store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CategoryScreen from './screens/Category/CategoryScreen';

const Drawer = createDrawerNavigator();
const queryClient = new QueryClient();

function AppContent() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Category" component={CategoryScreen} />
      {!isLoggedIn && (
        <>
          <Drawer.Screen name="SignUp" component={SignupScreen} />
          <Drawer.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </QueryClientProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  // Your styles here
});
