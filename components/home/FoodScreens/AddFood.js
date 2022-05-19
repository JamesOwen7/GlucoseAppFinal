import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView, 
  Pressable,
  Button,
  TouchableHighlight
} from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../../../firebase'
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { Formik } from 'formik';
import * as Yup from 'yup'
import moment from 'moment'

export const foodLogo = 'https://media.idownloadblog.com/wp-content/uploads/2016/11/GIF-Banana.png'


const AddFood = ({navigation}) => {

  const [ pre, setPre ] = useState(null)
  const [ post, setPost ] = useState(null)
  const [during, setDuring] = useState(null)

  const addFoodSchema = Yup.object().shape({
    title: Yup.string().required('A title is required'),
    food: Yup.string().required('Food name is required'),
    foodTiming: Yup.string().required('Please select whether this is a pre or post training meal'),
    carbs: Yup.string().required('Please enter the amount of carbohydrates in this meal in grams'),
    protein: Yup.string().required('Please enter the amount of protein in this meal in grams'),
    fat: Yup.string().required('Please enter the amount of fat in this meal in grams'),
})

  const addFoodForm = async (title, food, foodTiming, carbs, protein, fat, postImage, date) => {
  try {
    const user = auth.currentUser
    await setDoc(doc(db, 'users', user.email, moment().format('YYYY-MM-DD'), title +' '+ moment().format('LT')), {
      title: title,
      food: food,
      foodTiming: foodTiming,
      carbs: carbs,
      protein: protein,
      fat: fat,
      postImage: foodLogo,
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
                size={40} color="#1abc9c" />
            </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
        <Image source={{ uri: foodLogo, height: 100, width: 100}}/>
        </View>
        <ScrollView style={{}}>
          <Formik 
            initialValues={{
              title:'', food:'', foodTiming:'', carbs:'', protein:'', fat:'', postImage: '', date: serverTimestamp()
            }}
            onSubmit={(values) => {
              addFoodForm(values.title, values.food, values.foodTiming, values.carbs, values.protein, values.fat, values.postImage, values.date)
            }}
            validationSchema={addFoodSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isValid}) => (
              <>
            <View style={styles.inputField}>
              <TextInput 
                placeholderTextColor='#444'
                placeholder='Meal Title'
                autoCapitalize='none'
                autoFocus={true}
                onChangeText = {handleChange('title')}
                onBlur={handleBlur('title')} 
                value={values.title}
              />
            </View>

            <View style={styles.inputField}>
              <TextInput 
                placeholderTextColor='#444'
                placeholder='Food'
                autoCapitalize='none'
                autoFocus={true}
                onChangeText = {handleChange('food')}
                onBlur={handleBlur('food')} 
                value={values.food}
              />
            </View>
            
            <View >
                <Text style={{
                  marginLeft:10, 
                  justifyContent:'flex-start', 
                  fontWeight: 'bold',
                  paddingBottom:5
                  }}>
                  Meal Timing
                  </Text>
              </View>
            <View style={{ flexDirection:"row" }}>
              <View style={styles.buttonStyle}>
                  <TouchableOpacity 
                    style={[styles.options, pre ? {backgroundColor: '#1abc9c'} : '' ]}
                    onPress={() => {setPre(true); setDuring(false); setPost(false); values.foodTiming = 'Pre-Training'}}
                  >
                    <Text style={styles.optionsText} >Pre</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.buttonStyle}>
                <TouchableOpacity
                  style={[styles.options, during ? {backgroundColor: '#1abc9c'} : '' ]}
                  onPress={() => {setDuring(true); setPost(false); setPre(false); values.foodTiming = 'During Training'}}
                >
                    <Text style={styles.optionsText} >During</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.buttonStyle}>
                <TouchableOpacity
                  style={[styles.options, post ? {backgroundColor: '#1abc9c'} : '' ]}
                  onPress={() => {setPre(false); setDuring(false); setPost(true); values.foodTiming = 'Post-Training'}}
                >
                    <Text style={styles.optionsText} >Post</Text>
                  </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputField}>
              <TextInput 
                style={{flex: 1}}
                placeholderTextColor='#444'
                placeholder='Carbs (grams)'
                autoCapitalize='none'
                keyboardType='number-pad'
                autoFocus={true}
                onChangeText = {handleChange('carbs')}
                onBlur={handleBlur('carbs')} 
                value={values.carbs}
              />
              </View>

              <View style={styles.inputField}>
              <TextInput 
                style={{flex: 1}}
                placeholderTextColor='#444'
                placeholder='Protein (grams)'
                autoCapitalize='none'
                keyboardType='number-pad'
                autoFocus={true}
                onChangeText = {handleChange('protein')}
                onBlur={handleBlur('protein')} 
                value={values.protein}
              />
              </View>

              <View style={styles.inputField}>
              <TextInput 
                // style={{flex: 1}}
                placeholderTextColor='#444'
                placeholder='Fat (grams)'
                autoCapitalize='none'
                keyboardType='number-pad'
                autoFocus={true}
                onChangeText = {handleChange('fat')}
                onBlur={handleBlur('fat')} 
                value={values.fat}
              />
              </View>

              <Pressable 
                  title='Submit'
                  style={styles.button(isValid)} 
                  onPress={handleSubmit} >
                  <Text style={styles.buttonText}>Submit</Text>
              </Pressable>
              </>
            )}
            </Formik>
        </ScrollView>
    </View>
  )
}


export default AddFood

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 0,
},
nutrientField: {
  flexDirection: 'row',
  // flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 12,
  backgroundColor: '#FAFAFA',
  borderWidth: 1,
  borderColor: '#111',
  margin: 10
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
    marginTop: 10,
    marginBottom: 0,
 },
 buttonText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 20,
},
optionsText: {
  fontWeight: 'bold',
  color: '#111',
  fontSize: 15,
},
button: isValid => ({
    backgroundColor: isValid ? '#1abc9c' : '#b9f5a9', 
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    borderRadius: 0,
    marginTop: 10,
    marginLeft: 135,
    marginRight: 135,
    marginBottom: 10
  }),
  buttonStyle: {
    marginHorizontal: 20,
    marginTop: 5,
  },
  options: {
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#111',
    padding: 5,
    marginLeft: '9.5%'
  }
})