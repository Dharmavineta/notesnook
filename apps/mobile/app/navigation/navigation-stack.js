import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import Container from '../components/container';
import Intro from '../components/intro';
import Favorites from '../screens/favorites';
import Home from '../screens/home';
import Notebook from '../screens/notebook';
import Notebooks from '../screens/notebooks';
import { ColoredNotes } from '../screens/notes/colored';
import { Monographs } from '../screens/notes/monographs';
import { TaggedNotes } from '../screens/notes/tagged';
import { TopicNotes } from '../screens/notes/topic-notes';
import { Search } from '../screens/search';
import Settings from '../screens/settings';
import AppLock from '../screens/settings/app-lock';
import Tags from '../screens/tags';
import Trash from '../screens/trash';
import { eSendEvent } from '../services/event-manager';
import SettingsService from '../services/settings';
import useNavigationStore from '../stores/use-navigation-store';
import { useSelectionStore } from '../stores/use-selection-store';
import { useThemeStore } from '../stores/use-theme-store';
import { history } from '../utils';
import { rootNavigatorRef } from '../utils/global-refs';
import { hideAllTooltips } from '../hooks/use-tooltip';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingStore } from '../stores/use-setting-store';
const NativeStack = createNativeStackNavigator();
const IntroStack = createNativeStackNavigator();

/**
 * Intro Stack:
 *
 * Welcome Page
 * Select Privacy Mode Page
 * Login/Signup Page
 *
 */

const IntroStackNavigator = () => {
  const colors = useThemeStore(state => state.colors);
  return (
    <IntroStack.Navigator
      screenOptions={{
        headerShown: false,
        lazy: false,
        animation: 'none',
        contentStyle: {
          backgroundColor: colors.bg
        }
      }}
      initialRouteName={'Intro'}
    >
      <NativeStack.Screen name="Intro" component={Intro} />
      <NativeStack.Screen name="AppLock" component={AppLock} />
    </IntroStack.Navigator>
  );
};

const Tabs = React.memo(
  () => {
    const colors = useThemeStore(state => state.colors);
    const homepage = SettingsService.get().homepage;
    const introCompleted = useSettingStore(state => state.settings.introCompleted);
    const height = useSettingStore(state => state.dimensions.height);
    const insets = useSafeAreaInsets();
    const screenHeight = height - (50 + insets.top + insets.bottom);
    React.useEffect(() => {
      setTimeout(() => {
        useNavigationStore.getState().update({ name: homepage });
      }, 1000);
    }, []);

    return (
      <NativeStack.Navigator
        tabBar={() => null}
        initialRouteName={!introCompleted ? 'Welcome' : homepage}
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          lazy: false,
          animation: 'none',
          contentStyle: {
            backgroundColor: colors.bg,
            height: !introCompleted ? undefined : screenHeight
          }
        }}
      >
        <NativeStack.Screen name="Welcome" component={IntroStackNavigator} />
        <NativeStack.Screen name="Notes" component={Home} />
        <NativeStack.Screen name="Notebooks" component={Notebooks} />
        <NativeStack.Screen options={{ lazy: true }} name="Favorites" component={Favorites} />
        <NativeStack.Screen options={{ lazy: true }} name="Trash" component={Trash} />
        <NativeStack.Screen options={{ lazy: true }} name="Tags" component={Tags} />
        <NativeStack.Screen name="Settings" component={Settings} />
        <NativeStack.Screen options={{ lazy: true }} name="TaggedNotes" component={TaggedNotes} />
        <NativeStack.Screen options={{ lazy: true }} name="TopicNotes" component={TopicNotes} />
        <NativeStack.Screen options={{ lazy: true }} name="ColoredNotes" component={ColoredNotes} />
        <NativeStack.Screen options={{ lazy: true }} name="Monographs" component={Monographs} />
        <NativeStack.Screen options={{ lazy: true }} name="Notebook" component={Notebook} />
        <NativeStack.Screen options={{ lazy: true }} name="Search" component={Search} />
      </NativeStack.Navigator>
    );
  },
  () => true
);

export const NavigationStack = React.memo(
  () => {
    const clearSelection = useSelectionStore(state => state.clearSelection);

    const onStateChange = React.useCallback(() => {
      if (history.selectionMode) {
        clearSelection(true);
      }
      hideAllTooltips();
      eSendEvent('navigate');
    });

    return (
      <Container>
        <NavigationContainer onStateChange={onStateChange} ref={rootNavigatorRef}>
          <Tabs />
        </NavigationContainer>
      </Container>
    );
  },
  () => true
);