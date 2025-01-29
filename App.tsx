import './gesture-handler';
import {useColorScheme, StatusBar, Alert, Linking} from 'react-native';
import {PaperProvider, useTheme} from 'react-native-paper';

import {DarkTheme, LightTheme} from './src/core/theme/theme';
import {useEffect} from 'react';
import BottomNavigationBar from './src/navigation/BottomNavigationBar';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef, isReadyRef} from './RootNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import GrantPermissionDialog from './src/core/shared/components/GrantPermissionDialog';

import nodejs from 'nodejs-mobile-react-native';
import {useBottomNavigationBarState} from './src/navigation/useBottomNavigationBarState';
import {PluginViewModel} from './src/features/plugins/presentation/viewmodels/PluginViewModel';
import {usePluginStore} from './src/features/plugins/presentation/state/usePluginStore';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useInstallPluginDialogStore} from './src/features/plugins/presentation/state/useInstallPluginDialogStore';
import constants from './src/core/utils/constants';
import InstallPluginDialog from './src/core/shared/components/InstallPluginDialog';
import ConfirmOrDenyDialog from './src/core/shared/components/ConfirmOrDenyDialog';

const Stack = createNativeStackNavigator();

export default function App() {
  // Start nodejs
  useEffect(() => {
    nodejs.start('main.js');
    // nodejs.channel.addListener('message', message => {
    //   Alert.alert('From NodeJS', message);
    // });
  });

  // Dark mode handling
  const colorScheme = useColorScheme();

  useEffect(() => {}, [colorScheme]);

  const {setPlugins} = usePluginStore(state => state);

  // Check if app & navigation is ready
  useEffect(() => {
    const loadPluginsOnMount = async () => {
      const plugins = await new PluginViewModel().loadAllPluginsFromStorage();

      if (plugins.status === 'success') {
        setPlugins(plugins.data!);
      }
    };

    loadPluginsOnMount();
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const {
    setVisible: setInstallVisible,
    setPlugin,
    loading,
    setLoading,
    setOnConfirm: setInstallOnConfirm,
  } = useInstallPluginDialogStore(state => state);

  const pluginViewModel = new PluginViewModel();

  useEffect(() => {
    Linking.addEventListener('url', async ({url}) => {
      if (loading) {
        return;
      }
      if (url.startsWith(constants.PLUGIN_SCHEME)) {
        setLoading(true);

        const manifestUrl = url.replace(constants.PLUGIN_SCHEME, 'http://');

        await pluginViewModel.fetchManifest(manifestUrl).then(result => {
          switch (result.status) {
            case 'success': {
              setPlugin(result.data);
              setInstallOnConfirm(async () => {
                await pluginViewModel.fetchPlugin(result.data).then(result => {
                  switch (result.status) {
                    case 'success': {
                      pluginViewModel.registerPlugin(result.data).then(() => {
                        setInstallVisible(false);
                      });
                      break;
                    }
                    case 'error': {
                      console.error(result.error);
                      break;
                    }
                    default:
                      break;
                  }
                });
              });
              break;
            }
            case 'error': {
              console.error(result.error);
              break;
            }
            default:
              break;
          }
        });
        setInstallVisible(true);
        setLoading(false);
      }
    });
  }, []);

  const theme = useTheme();

  const {deletePlugin, pluginToDelete, setPluginToDelete} = usePluginStore(
    state => state,
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
          }}>
          <PaperProvider
            theme={colorScheme === 'dark' ? DarkTheme : LightTheme}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                isReadyRef.current = true;
              }}>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Root" component={BottomNavigationBar} />
              </Stack.Navigator>
              <GrantPermissionDialog />
              <StatusBar
                backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
                barStyle={
                  colorScheme === 'dark' ? 'light-content' : 'dark-content'
                }
              />
            </NavigationContainer>
            <GrantPermissionDialog />
            <InstallPluginDialog />
            {pluginToDelete && (
              <ConfirmOrDenyDialog
                visible={Boolean(pluginToDelete)}
                onConfirm={async () => {
                  await deletePlugin(pluginToDelete);
                  return setPluginToDelete(null);
                }}
                onCancel={() => setPluginToDelete(null)}
                title={`Delete ${pluginToDelete.name}?`}
                reason="Are you sure you want to delete this plugin?"
              />
            )}
          </PaperProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
