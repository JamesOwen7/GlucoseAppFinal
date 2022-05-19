import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Platform,
  Alert
 } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from 'reanimated-bottom-sheet'
import Animated from 'react-native-reanimated'
import { auth, db } from '../../firebase'
import { doc, setDoc, collection, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

const EditProfileForm = ({navigation}) => {

  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)
  const [userData, setUserData] = useState(null)

  const getUser = async() => {
    const user = auth.currentUser
    const docRef = doc(db, 'users', user.email)
    
    onSnapshot(docRef, (doc) => {
      const data=doc.data()
      console.log(data, data.name)
      setUserData(data)
    })
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleUpdate = async() => {
    const user = auth.currentUser
    const docRef = doc(db, 'users', user.email)
    await updateDoc(docRef, {
        name: userData.name,
        email: userData.email,
        weight: userData.weight,
        height: userData.height,
        sport: userData.sport
      })
      .then(() => {
        console.log('User updated!')
        Alert.alert(
          'Your profile has been updated successfully!'
         )
      })
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{margin: 20, marginTop: 0,
        opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0))}}>
        <View style={styles.action}>
          <FontAwesome name='user-o' size={20} style={{alignItems:'center', marginLeft: 10, marginBottom: 10}}/>
          <TextInput 
            placeholder='Name'
            placeholderTextColor='#666666'
            value={userData ? userData.name : ''}
            onChangeText={(txt) => setUserData({...userData, name: txt})}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name='user-o' size={20} style={{alignItems:'center', marginLeft: 10, marginBottom: 10}}/>
          <TextInput 
            placeholder='Username'
            placeholderTextColor='#666666'
            value={userData ? userData.username : ''}
            onChangeText={(txt) => setUserData({...userData, username: txt})}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>

        <View style={styles.action}>
          <MaterialCommunityIcons name='email' size={20} style={{alignItems:'center', marginLeft: 10, marginBottom: 10}}/>
          <TextInput 
            placeholder='Email'
            placeholderTextColor='#666666'
            keyboardType='email-address'
            textContentType='emailAddress'
            value={userData ? userData.email : ''}
            onChangeText={(txt) => setUserData({...userData, email: txt})}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name='birthday-cake' size={20} style={{alignItems:'center', marginLeft: 10, marginBottom: 10}}/>
          {/* <BirthDatePicker /> */}
          <TextInput 
            placeholder='Birthday'
            placeholderTextColor='#666666'
            value={userData ? userData.birthday : ''}
            autoCorrect={false}
            style={styles.textInput}
          />
          {/* <Text style={{color: '#666666'}}>Birthday</Text> */}
        </View>

        <View style={styles.action}>
          <MaterialIcons name='sports-soccer' size={20} style={{alignItems:'center', marginLeft: 10, marginBottom: 10}}/>
          <TextInput 
            placeholder='Sport'
            placeholderTextColor='#666666'
            value={userData ? userData.sport : ''}
            onChangeText={(txt) => setUserData({...userData, sport: txt})}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>

        <View style={styles.action}>
          <MaterialCommunityIcons name='human-male-height' size={20} style={{alignItems:'center', marginLeft: 10, marginBottom: 10}}/>
          <TextInput 
            placeholder='Height'
            placeholderTextColor='#666666'
            keyboardType='number-pad'
            value={userData ? userData.height : ''}
            onChangeText={(number) => setUserData({...userData, height: number})}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome5 name='weight' size={20} style={{alignItems:'center', marginLeft: 10, marginBottom: 10}}/>
          <TextInput 
            placeholder='Weight'
            placeholderTextColor='#666666'
            keyboardType='number-pad'
            value={userData ? userData.weight : ''}
            onChangeText={(number) => setUserData({...userData, weight: number})}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity style={styles.commandButton} onPress={() => {handleUpdate(); navigation.push('You')}}>
          <Text style={styles.panelButtonTitle}>Submit</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default EditProfileForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputField: {
    borderRadius: 4,
    padding: 20,
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    borderWidth: 1,
},
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderBottomColor: '#666666',
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    marginLeft: 10
  },
});