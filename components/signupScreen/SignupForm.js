import { StyleSheet, TextInput,ScrollView, View, Text, Pressable, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup'
import Validator from 'email-validator'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase'
import { doc, setDoc, collection } from "firebase/firestore";
// import onSignupContextProvider from './SignUpFirebase';

const SignupForm = ({navigation}) => {

  const SignupFormSchema = Yup.object().shape({
      email: Yup.string().email().required('An email is required'),
      username: Yup.string().required().min(2, 'A username is required'),
      password: Yup.string()
      .required()
      .min(6, 'Your password has to have at least 8 characters'),
      name: Yup.string().required('You must enter your name'),
      birthday: Yup.string().min(10).max(10),
      sport: Yup.string(),
      height: Yup.number().min(54, 'Min value is 54cm').max(272, 'Max value is 272cm'),
      weight: Yup.number().min(10, 'Min value is 10kg').max(250, 'Max value is 250kg')
  })

  const onSignup = async (email, password, username, name, birthday, sport, height, weight) => {
    try { 
      const authUser = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', authUser.user.email), {
          owner_uid: authUser.user.uid,
          username: username,
          email: authUser.user.email,
          name: name,
          birthday: birthday,
          sport: sport,
          height: height,
          weight: weight,
          userImg: null,
      })
      
    } catch(error) {
        Alert.alert(
            "Sign up Error",
            'Username or email may already be in use',
            [
              {
                  text: 'Retry',
                  onPress: () => console.log(error),
                  styles: 'cancel',
              },
              { text: 'Log In', onPress: () => navigation.goBack()}
              
          ]
        )
    }
  }

  return (
    <ScrollView style={styles.wrapper}>

      <Formik
        initialValues={{
          email:'', username: '', password:'', name: '', birthday: '', height:'', sport:'', weight:''}}
        onSubmit={(values) => {
          onSignup(values.email, values.password, values.username, values.name, values.birthday, values.sport, values.height, values.weight)
      }}
        validationSchema={SignupFormSchema}
        validateOnMount={true}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <>

            <View style={styles.inputField}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Name'
              autoCapitalize='none'
              textContentType='name'
              autoFocus={true}
              onChangeText = {handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            </View>

            <View style={[styles.inputField, 
                {borderColor: values.email.length < 1 || Validator.validate(values.email) ? '#111' : 'red'}
            ]}>
                <TextInput 
                    placeholderTextColor='#444'
                    placeholder='Email'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    autoFocus={true}
                    onChangeText = {handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                />
            </View>

            <View style={[styles.inputField, 
                {borderColor: values.username.length < 1 || values.username.length >= 2 ? '#111' : 'red'}
            ]}>
                <TextInput 
                    placeholderTextColor='#444'
                    placeholder='Username'
                    autoCapitalize='none'
                    textContentType='username'
                    autoFocus={true}
                    onChangeText = {handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                />
            </View>
            
            <View style={[styles.inputField, 
                {borderColor: 1 > values.password.length || values.password.length >= 6 ? '#111' : 'red'}
            ]}>
                <TextInput 
                    placeholderTextColor='#444'
                    placeholder='Password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType='password'
                    onChangeText = {handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                />
            </View>

            <View style={styles.inputField}>
              {/* <Text>Birthday</Text> */}
              <TextInput 
                placeholderTextColor='#444'
                placeholder='Birthday - dd/mm/yyyy'
                autoCapitalize='none'
                autoFocus={true}
                onChangeText = {handleChange('birthday')}
                onBlur={handleBlur('birthday')}
                value={values.birthday}
              />
              {/* <DateField
                labelDate="Input date"
                labelMonth="Input month"
                labelYear="Input year"
                onSubmit={(value) => console.log(value)}
                onChangeText = {handleChange('birthday')}
                onBlur={handleBlur('birthday')}
                value={values.birthday}
              /> */}
            </View>

            <View style={styles.inputField}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Sport'
              autoCapitalize='none'
              autoFocus={true}
              onChangeText = {handleChange('sport')}
              onBlur={handleBlur('sport')}
              value={values.sport}
            />
            </View>

            <View style={styles.inputField}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Weight (kg)'
              autoCapitalize='none'
              keyboardType='number-pad'
              autoFocus={true}
              onChangeText = {handleChange('weight')}
              onBlur={handleBlur('weight')}
              value={values.weight}
            />
            </View>

            <View style={styles.inputField}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Height (cm)'
              autoCapitalize='none'
              keyboardType='number-pad'
              autoFocus={true}
              onChangeText = {handleChange('height')}
              onBlur={handleBlur('height')}
              value={values.height}
            />
            </View>
            
            <View style={{alignItems: 'flex-end'}}>
                <Text style={{ color: '#6BB0F5'}}>Forgot password?</Text>
            </View>

            <Pressable 
                titleSize={20} 
                style={styles.button(isValid)}
                onPress={handleSubmit}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>

            <View style={styles.signUpContainer}>
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress ={() => navigation.goBack()}>
                    <Text style={{ color: '#6BB0F5' }}> Log In</Text>
                </TouchableOpacity>
            </View>
          </>
          )}
      </Formik>
      
    </ScrollView>
  )
}

export default SignupForm

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 50,
    },
    inputField: {
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#FAFAFA',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#111',
    },
    button: isValid => ({
      backgroundColor: isValid ? '#0096F6' : '#9ACAF7',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 42,
      borderRadius: 4,
      marginTop: 20,  
    }),
    buttonText: {
        fontWeight: '600',
        color: '#fff',
        fontSize: 20,
    },
    signUpContainer: {
       flexDirection: 'row',
       width: '100%',
       justifyContent: 'center',
       marginTop: 20,
       marginBottom: 10,
    },
})