import { 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  View,
  Button, 
  StatusBar,
  TouchableOpacity,
  Text,
  LogBox
} from 'react-native'
import React, {useState, useEffect} from 'react'
import { getAuth, signOut } from "firebase/auth";
import { auth, db } from '../../../firebase';
import { doc, setDoc, collection, query, getDocs, onSnapshot, orderBy, QuerySnapshot } from "firebase/firestore";
import { NavigationContainer } from '@react-navigation/native';
import EditProfileScreen from '../../../screens/EditProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';
import GraphCard from './graphcard';

const TrainingScreen = ({navigation}) => {

  const [posts, setPosts] = useState(null)

  const fetchData = async() => {
    try {
      
      const user = auth.currentUser
      const colRef = query(collection(db, 'users', user.email, 'Training'), orderBy('date', 'desc'))

      const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        const posts = []
        querySnapshot.forEach((doc) => {
          posts.push({...doc.data(), id: doc.id})
        })
        // console.log(posts)
        //console.log(doc.water)
        setPosts(posts)
      })

    } catch(error) {

      console.log(error)

    }
  }

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    fetchData()
  }, [])

  return (
    <View style={{flex: 1, backgroundColor:'white'}}>

      <FlatList
        style={{marginTop:20}}
        data={posts}
        renderItem={({item}) => <GraphCard item={item} />}
        keyExtractor={item => item.name}
      />

      <TouchableOpacity
        style={{
          borderWidth:1,
          borderColor:'rgba(0,0,0,0.2)',
          alignItems:'center',
          justifyContent:'center',
          width:75,
          height:75,
          backgroundColor:'#111',
          borderRadius:50,
          marginTop:500,
          marginLeft:250,
          position:'absolute'
        }}
        onPress={() => {navigation.push('NewSession')}}
      >
        <Icon name={"barbell-outline"}  size={40} color="#fff" />
      </TouchableOpacity>
      
    </View >
  )
}

export default TrainingScreen

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop:StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
})