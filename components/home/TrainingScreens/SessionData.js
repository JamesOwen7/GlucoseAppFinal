import { StyleSheet, Image, TextInput,ScrollView, View, Text, Pressable, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup'
import Validator from 'email-validator'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../firebase'
import { doc, setDoc, collection } from "firebase/firestore";
import moment from 'moment';

const sessionLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Man_on_an_Exercise_Bike_Cartoon.svg/1280px-Man_on_an_Exercise_Bike_Cartoon.svg.png'

const SessionData = ({route, navigation}) => {

    const {glucose} = route.params
    const {time} = route.params
    const {duration} = route.params
    const {startTime} = route.params
    const {endTime} = route.params

    const [ low, setLow ] = useState(null)
    const [ moderate, setModerate ] = useState(null)
    const [high, setHigh] = useState(null)

  const SessionFormSchema = Yup.object().shape({
      notes: Yup.string().required().min(20, 'Notes are required, minimum of 20 characters'),
      name: Yup.string().required('You must enter name of the session'),
      type: Yup.string().required('You must enter a session type'),
      intensity: Yup.string().required('Please select the session intensity')
  })

  const onSessionForm = async (name, date, startTime, endTime, duration, type, intensity, notes, postImage, glucose, time) => {
    try { 
        const user = auth.currentUser
        await setDoc(doc(db, 'users', user.email, 'Training', name +' '+moment().format('LLL')), {
         name:name,
         date:date,
         startTime:startTime,
         endTime:endTime,
         duration:duration,
         type:type,
         intensity:intensity,
         notes:notes,
         postImage:sessionLogo, 
         glucose:glucose,
         time:time
      })
      .then(navigation.navigate('Session'))
    } catch(error) {
        Alert.alert(
            'Error occurred. Please re-try'
        )
        console.log(error)
    }
  }

  return (
    
    <ScrollView style={styles.wrapper}>
        <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image source={{ uri: sessionLogo, height: 200, width: 200}} />
        </View>
      <Formik
        initialValues={{
          name:'', date:moment().format('YYYY-MM-DD'), startTime: startTime, endTime:endTime, 
          duration:duration, type:'', intensity:'', notes:'', postImage:sessionLogo, glucose:glucose, time:time}}
        onSubmit={(values) => {
          onSessionForm(values.name, values.date, values.startTime, values.endTime, values.duration,
          values.type, values.intensity, values.notes, values.postImage, values.glucose, values.time)
      }}
        validationSchema={SessionFormSchema}
        validateOnMount={true}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <>

            <View style={styles.inputField}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Session Name'
              autoCapitalize='none'
              textContentType='name'
              autoFocus={true}
              onChangeText = {handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            </View>
            <View >
                <Text style={styles.userInfoTitle}>Date</Text>
                <View style={styles.inputField}>
                <Text>{moment().format('YYYY-MM-DD')}</Text>
                </View>

                <Text style={styles.userInfoTitle}>Start Time</Text>
                <View style={styles.inputField}>
                <Text>{startTime}</Text>
                </View>

                <Text style={styles.userInfoTitle}>Finish Time</Text>
                <View style={styles.inputField}>
                <Text>{endTime}</Text>
                </View>
                
                <Text style={styles.userInfoTitle}>Session Duration</Text>
                <View style={styles.inputField}>
                <Text>{duration}</Text>
                </View>
                
            </View>
            <View style={styles.inputField}>
                <TextInput 
                    placeholderTextColor='#444'
                    placeholder='Session Type e.g., Weight training'
                    autoCapitalize='none'
                    keyboardType=''
                    textContentType=''
                    autoFocus={true}
                    onChangeText = {handleChange('type')}
                    onBlur={handleBlur('type')}
                    value={values.type}
                />
            </View>

            <View style={{ flexDirection:"row" }}>
              <View style={styles.buttonStyle}>
                  <TouchableOpacity 
                    style={[styles.options, low ? {backgroundColor: '#0096F6'} : '' ]}
                    onPress={() => {setLow(true); setModerate(false); setHigh(false); values.intensity = 'Low Intensity'}}
                  >
                    <Text style={styles.optionsText} >Low</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.buttonStyle}>
                <TouchableOpacity
                  style={[styles.options, moderate ? {backgroundColor: '#0096F6'} : '' ]}
                  onPress={() => {setLow(false); setModerate(true); setHigh(false); values.intensity = 'Moderate Intensity'}}
                >
                    <Text style={styles.optionsText} >Moderate</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.buttonStyle}>
                <TouchableOpacity
                  style={[styles.options, {marginBottom:10},high ? {backgroundColor: '#0096F6'} : '' ]}
                  onPress={() => {setLow(false); setModerate(false); setHigh(true); values.intensity = 'High Intensity'}}
                >
                    <Text style={styles.optionsText} >High</Text>
                  </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.inputField, 
                {borderColor: values.notes.length < 1 || values.notes.length >= 20 ? '#111' : 'red'}
            ]}>
                <TextInput 
                    placeholderTextColor='#444'
                    placeholder='Athletes Notes'
                    autoCapitalize='none'
                    textContentType=''
                    autoFocus={true}
                    onChangeText = {handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    value={values.notes}
                    multiline={true}
                    numberOfLines={10}
                />
            </View>
            

            <Pressable 
                title='Submit' 
                style={styles.button(isValid)}
                onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Session</Text>
            </Pressable>

          </>
          )}
      </Formik>
      </View>
    </ScrollView>
    
  )
}

export default SessionData

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 10,
    },
    userInfoTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'left',
        marginLeft:5
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        // paddingTop: 50,
        paddingHorizontal: 12,
    },
    optionsText: {
        fontWeight: 'bold',
        color: '#111',
        fontSize: 15,
    },
    options: {
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#111',
        padding: 5,
        marginLeft: '9.5%'
    },
    buttonStyle: {
        marginHorizontal: '3.5%',
        marginTop: 5,
      },
    inputField: {
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#FAFAFA',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#111',
        marginLeft:5,
        marginRight:5
    },
    button: isValid => ({
      backgroundColor: isValid ? '#0096F6' : '#9ACAF7',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 42,
      borderRadius: 4,
      marginTop: 20,
      marginBottom: 20  
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

