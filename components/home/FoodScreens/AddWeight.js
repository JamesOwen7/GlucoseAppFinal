import { 
    StyleSheet,
    Text, 
    View,
    TouchableOpacity,
    Image,
    TextInput,
    Pressable 
} from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import { auth, db } from '../../../firebase'
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import * as Yup from 'yup'
import moment from 'moment'

export const weightLogo = 'https://st2.depositphotos.com/7303196/11164/v/600/depositphotos_111640636-stock-illustration-the-concept-of-weight-loss.jpg'


const AddWeight = ({navigation}) => {
  
  const [weight, setWeight] = useState(0)

  const addWeightSchema = Yup.object().shape({
        weight: Yup.number().required().max(200).min(30)
  })

  const addWeightForm = async ( postImage, date) => {
        try {
          const user = auth.currentUser
          await setDoc(doc(db, 'users', user.email, 'weight', moment().format('MM.DD')), {
            weight: weight,
            postImage: weightLogo,
            date: serverTimestamp(),
          })
          .then((weight) => {})
        } catch(error) {
          console.log(error)
        }
  }

  const weightUpdate = async() => {
    const user = auth.currentUser
    const docRef = doc(db, 'users', user.email)
    await updateDoc(docRef, {
        weight: weight,
      })
      .then(() => {
        console.log('Weight updated!')
      })
  }


  return (
    <View style={{backgroundColor: 'white', flex:1}}>
      <View style={styles.signUpContainer}>
            <TouchableOpacity onPress ={() => navigation.goBack()}>
            <Icon name={"arrow-back-circle"}  style ={{marginLeft:10}}
                size={40} color="#F86D4F" />
            </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
        <Image source={{ uri: weightLogo, height: 100, width: 100}}/>
        </View>

        <Formik 
            initialValues={{
              weight: '', postImage: weightLogo, date: serverTimestamp()
            }}
            onSubmit={(values) => {
              addWeightForm(values.weight, values.postImage, values.date)
            }}
            validationSchema={addWeightSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isValid}) => (
              <>
            <View style={styles.inputField}>
                <TextInput 
                placeholderTextColor='#444'
                placeholder='Add todays weight (kg)'
                autoCapitalize='none'
                keyboardType='number-pad'
                autoFocus={true}
                onChangeText = {(text) => setWeight(text)}
                // onBlur={handleBlur('weight')} 
                value={weight}
                />
            </View>

            <TouchableOpacity 
                style={styles.button(isValid)} 
                onPress={() => {weightUpdate(); addWeightForm(); navigation.goBack()}}
            >
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            </>
            )}
            </Formik>
    </View>
  )
}

export default AddWeight

const styles = StyleSheet.create({
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
    signUpContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
     },
     buttonText: {
        fontWeight: '600',
        color: '#fff',
        fontSize: 20,
    },
    button: isValid => ({
        backgroundColor: isValid ? '#0096F6' : '#9ACAF7',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        borderRadius: 0,
        marginTop: 10,
        marginLeft: 140,
        marginRight: 140,
      }),
})