import { KeyboardAvoidingView, StyleSheet, TextInput, View, TouchableOpacity, Text, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase.js'
import LoginForm from '../components/loginScreen/LoginForm.js';

const logo = 'http://clipart-library.com/img1/154220.jpg'

const LoginScreen = ({navigation}) => (
  <View style={styles.container}>
      <View style={styles.logoContainer}>
          <Image source={{ uri: logo, height: 100, width: 100}} />
      </View>
        <LoginForm navigation={navigation} />
  </View>
  
)

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 50,
        paddingHorizontal: 12,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
})


