import { 
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    Image,
    Pressable,
    TextInput
} from 'react-native'
import React from 'react'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup'
import moment from 'moment'
import { auth, db } from '../../../firebase'
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

const glucoseLogo = 'https://t4.ftcdn.net/jpg/03/15/59/83/360_F_315598321_TnSo0epH6U8Sr2w3DnUyYjanFC1enee6.jpg'

const NewSession = ({navigation}) => {
    
  const addGlucoseSchema = Yup.object().shape({
    glucose: Yup.number().required().min(0.1).max(50)
  })

  const addGlucoseForm = async (glucose, postImage, date) => {
    try {
      const user = auth.currentUser
      await setDoc(doc(db, 'users', user.email, moment().format('YYYY-MM-DD'), 'Glucose ' + moment().format('LT')), {
        glucose: glucose,
        postImage: glucoseLogo,
        time: moment().format('LT'),
      })
      .then(navigation.goBack())
    } catch(error) {
      console.log(error)
    }
  }

  const multipleFunctions = ({handleSubmit}) => {
    handleSubmit

  }
    return (
      
      <View style={{backgroundColor: 'white', flex:1}}>
        <View style={styles.signUpContainer}>
            <TouchableOpacity onPress ={() => navigation.goBack()}>
            <Icon name={"arrow-back-circle"}  style ={{marginLeft:10}}
                size={40} color="#111" />
            </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
          <Image source={{ uri: glucoseLogo, height: 150, width: 150}}/>
        </View>

        <Formik 
            initialValues={{
              glucose: '', postImage: glucoseLogo, time: moment().format('LT')
            }}
            onSubmit={(values) => {
              addGlucoseForm(values.glucose, values.postImage, values.date)
            }}
            validationSchema={addGlucoseSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isValid}) => (
              <>
            <View style={styles.inputField}>
                <TextInput 
                placeholderTextColor='#444'
                placeholder='Add glucose levels during training (mmol/L)'
                autoCapitalize='none'
                keyboardType='number-pad'
                autoFocus={true}
                onChangeText = {handleChange('glucose')}
                onBlur={handleBlur('glucose')} 
                value={values.glucose}
                />
            </View>

            <Pressable 
                style={styles.button(isValid)} 
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
            
            </>
            )}
            </Formik>
    
        
      </View>
    );
}

export default NewSession

const styles = StyleSheet.create({
  startButtonStyle: {
    marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
    backgroundColor:'#01D702',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  button: isValid => ({
    backgroundColor: isValid ? '#01D702' : '#92F592',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  }),
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
 },
 logoContainer: {
  alignItems: 'center',
  marginTop: 60,
},
inputField: {
  borderRadius: 4,
  padding: 12,
  backgroundColor: '#FAFAFA',
  borderWidth: 1,
  borderColor: '#111',
  margin: 10
},
})