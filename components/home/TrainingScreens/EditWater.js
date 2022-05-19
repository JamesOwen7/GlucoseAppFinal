import { 
    StyleSheet, 
    Text, 
    View,
    TouchableOpacity,
    Image,
    TextInput,
    Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../../../firebase'
import { doc, setDoc, collection, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import HistoryScreen, { date } from '../HistoryScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { waterLogo } from '../FoodScreens/AddWater';
import moment from 'moment'
import FoodScreen, { item } from '../FoodScreens/FoodScreen';

const EditWater = ({navigation, item}) => {

  const [waterData, setWaterData] = useState(null)

  const getWater = async() => {
    const user = auth.currentUser
    // console.log(date)
    const docRef = doc(db, 'users', user.email, moment(date).format('YYYY-MM-DD'), 'Water 5:26 PM')
    
    onSnapshot(docRef, (doc) => {
      const data=doc.data()
      console.log(item)
      setWaterData(data)
    })
  }

  useEffect(() => {
    getWater()
  }, [])

  const handleUpdate = async() => {
    const user = auth.currentUser
    const docRef = doc(db, 'users', user.email, moment(date).format('YYYY-MM-DD'), item)
    await updateDoc(docRef, {
        water: waterData.water
      })
      .then(() => {
        console.log('Water diary updated!')
        Alert.alert(
          'Water diary updated!'
         )
      })
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

    <View style={styles.inputField}>
                <TextInput 
                placeholderTextColor='#444'
                placeholder='Add water amount (ml)'
                keyboardType='number-pad'
                value={waterData ? waterData.water : ''}
                onChangeText={(txt) => setWaterData({...waterData, water: txt})}
                />
    </View>

    <TouchableOpacity style={styles.button} onPress={() => {handleUpdate()}}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        
    </View>
    
  )
}

export default EditWater

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
    button: {
        backgroundColor: '#0096F6',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        borderRadius: 0,
        marginTop: 10,
        marginLeft: 140,
        marginRight: 140,
      },
})