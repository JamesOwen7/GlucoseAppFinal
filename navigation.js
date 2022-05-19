import React from 'react'
import { Button, TouchableOpacity } from 'react-native'
import { getAuth, signOut } from "firebase/auth";
import { auth } from './firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import { createBottomTabNavigator, keyboardHidesTabBar } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraImage from './components/editProfileScreen/CameraImage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FoodScreen from './components/home/FoodScreens/FoodScreen';
import Header from './components/home/Header';
import TrainingScreen from './components/home/TrainingScreens/TrainingScreen';
import HistoryScreen from './components/home/HistoryScreen';
import AddGlucose from './components/home/TrainingScreens/AddGlucose';
import AddWater from './components/home/FoodScreens/AddWater';
import AddFood from './components/home/FoodScreens/AddFood';
import EditWater from './components/home/TrainingScreens/EditWater';
import EditFood from './components/home/TrainingScreens/EditFood';
import AddWeight from './components/home/FoodScreens/AddWeight';
import FoodGraphs from './components/home/FoodScreens/FoodGraphs';
import NewSession from './components/home/TrainingScreens/NewSession';
import SessionData from './components/home/TrainingScreens/SessionData';

const handleSignout = async () => {
  await signOut(auth)
  .then(() => {console.log('Signed Out Successfully')
}) .catch((error) => {
  console.log('Error')
})
}

const Stack = createNativeStackNavigator()

const screenOptions = {
    headerShown: false,
    keyboardHidesTabBar: true,
}

export const SignedOutStack = () => (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={screenOptions}
      > 
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name='SignupScreen'
          component={SignupScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
)

const Tab = createBottomTabNavigator();

export const SignedInStack = () => (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={screenOptions}
        options={{keyboardHidesTabBar: true}}  
      >
        <Tab.Screen name="Main" component={HomeTabs} 
        options={() => ({
          tabBarIcon: ({color, size}) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
          
        })}/>
        <Tab.Screen name="Profile" component={ProfileStack}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="person-outline" size={22} color={color} />
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
)


const TopTab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <>
    <Header />
    <TopTab.Navigator
      const screenOptions = {{
        tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold' },
    }}
    >
      <TopTab.Screen name="Food" component={FoodStack} />
      <TopTab.Screen name="Training" component={TrainingStack} />
      <TopTab.Screen name="History" component={HistoryStack} />
    </TopTab.Navigator>
    </>
  );
}

export const TrainingStack = () => (
  <Stack.Navigator 
    screenOptions={screenOptions}
  >
    <Stack.Screen name="Session" component={TrainingScreen}/>
    <Stack.Screen name="NewSession" component={NewSession} />
    <Stack.Screen name="AddGlucose" component={AddGlucose} />
    <Stack.Screen name="SessionData" component={SessionData} />
  </Stack.Navigator>
)

export const FoodStack = () => (
  <Stack.Navigator 
    screenOptions={screenOptions}
  >
    <Stack.Screen name="Food" component={FoodScreen}/>
    <Stack.Screen name="AddWater" component={AddWater} />
    <Stack.Screen name="AddFood" component={AddFood} />
    <Stack.Screen name="AddWeight" component={AddWeight} />
    <Stack.Screen name="FoodGraphs" component={FoodGraphs} />
  </Stack.Navigator>
)

export const HistoryStack = () => (
  <Stack.Navigator 
    screenOptions={screenOptions}
  >
    <Stack.Screen name="Food" component={HistoryScreen}/>
    <Stack.Screen name="EditWater" component={EditWater} />
    <Stack.Screen name="AddFood" component={AddFood} />
  </Stack.Navigator>
)

export const ProfileStack = () => (
      <Stack.Navigator >
        <Stack.Screen name="You" component={ProfileScreen}
          options={{
            headerRight: () => (
              <TouchableOpacity onPress={() => {handleSignout()}}>
                <Icon name="log-out-outline" size={30}/>
              </TouchableOpacity>
            ),
        }}
        />
        <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
        <Stack.Screen name="Take Photo" component={CameraImage} />
      </Stack.Navigator>
)


