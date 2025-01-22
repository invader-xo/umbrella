import './gesture-handler';
import {
  useColorScheme,
  StyleSheet,
  View,
  StatusBar,
  Linking,
} from 'react-native';
// import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {Button, PaperProvider, Snackbar} from 'react-native-paper';

import {DarkTheme, LightTheme} from './src/core/theme/theme';
import {useEffect, useState} from 'react';
import BottomNavigationBar from './src/navigation/BottomNavigationBar';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef, isReadyRef} from './RootNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InstallPluginDialog from './src/core/shared/components/InstallPluginDialog';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import GrantPermissionDialog from './src/core/shared/components/GrantPermissionDialog';
// import * as RNFS from '@dr.pogodin/react-native-fs';

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {}, [colorScheme]);

  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            colorScheme === 'dark'
              ? DarkTheme.colors.background
              : LightTheme.colors.background,
        }}>
        <PaperProvider theme={colorScheme === 'dark' ? DarkTheme : LightTheme}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              isReadyRef.current = true;
            }}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name="Root" component={BottomNavigationBar} />
            </Stack.Navigator>
            <InstallPluginDialog />
            <GrantPermissionDialog />
            <StatusBar
              backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
              barStyle={
                colorScheme === 'dark' ? 'light-content' : 'dark-content'
              }
            />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
