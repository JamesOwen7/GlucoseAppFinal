import { 
    StyleSheet,
    Text, 
    View,
    TextInput,
    Image,
    TouchableOpacity, 
    Pressable
} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup'
import moment from 'moment'
import { auth, db } from '../../../firebase'
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

export const waterLogo = 'https://t3.ftcdn.net/jpg/02/77/06/14/360_F_277061445_eAEjq2r3mppjbCywKSdLDZKgRMKj13xV.jpg'

const AddWater = ({navigation}) => {

    const addWaterSchema = Yup.object().shape({
        water: Yup.number().required().max(10000)
    })

    const addWaterForm = async (water, postImage, date) => {
        try {
          const user = auth.currentUser
          await setDoc(doc(db, 'users', user.email, moment().format('YYYY-MM-DD'), 'Water ' + moment().format('LT')), {
            water: water,
            postImage: waterLogo,
            date: serverTimestamp(),
          })
          .then(navigation.goBack())
        } catch(error) {
          console.log(error)
        }
    }

  return (
    <View style={{backgroundColor: 'white', flex:1}}>
        <View style={styles.signUpContainer}>
            <TouchableOpacity onPress ={() => navigation.goBack()}>
            <Icon name={"arrow-back-circle"}  style ={{marginLeft:10}}
                size={40} color="#347deb" />
            </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
        <Image source={{ uri: waterLogo, height: 100, width: 100}}/>
        </View>

        <Formik 
            initialValues={{
              water: '', postImage: waterLogo, date: serverTimestamp()
            }}
            onSubmit={(values) => {
              addWaterForm(values.water, values.postImage, values.date)
            }}
            validationSchema={addWaterSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isValid}) => (
              <>
            <View style={styles.inputField}>
                <TextInput 
                placeholderTextColor='#444'
                placeholder='Add water amount (ml)'
                autoCapitalize='none'
                keyboardType='number-pad'
                autoFocus={true}
                onChangeText = {handleChange('water')}
                onBlur={handleBlur('water')} 
                value={values.water}
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
  )
}

export default AddWater

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