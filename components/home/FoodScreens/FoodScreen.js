import { 
  StyleSheet, 
  Text, 
  View, 
  LogBox, 
  ScrollView,
  TouchableOpacity
 } from 'react-native'
import React, { useEffect, useState } from 'react'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddWater from './AddWater';
import AddFood from './AddFood';
import Postcard from './postcard';
import { waterLogo } from './AddWater';
import { foodLogo } from './AddFood';
import { FlatList } from 'react-native-gesture-handler';
import { auth, db } from '../../../firebase'
import { doc, setDoc, collection, query, getDocs, onSnapshot, orderBy, QuerySnapshot } from "firebase/firestore";
import moment from 'moment'
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';

const FoodScreen = ({navigation}) => {

  const [posts, setPosts] = useState(null)
  //const [loading, setLoading] = useState(true)

  const fetchData = async() => {
    try {
      
      const user = auth.currentUser
      const colRef = query(collection(db, 'users', user.email, moment().format('YYYY-MM-DD')), orderBy('date', 'desc'))

      const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
        const posts = []
        querySnapshot.forEach((doc) => {
          posts.push({...doc.data(), id: doc.id})
        })
        console.log(posts)
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
      {/* <ScrollView style={{backgroundColor: 'white', margin: 10, }} showsVerticalScrollIndicator={false}> */}
      <View style={styles.headerBorder}>
        <Text style={styles.header}>Today's Diary</Text>

        <TouchableOpacity onPress={() => {navigation.push('FoodGraphs')}}>
        <FontAwesome5 name='chart-pie' size={20} style={styles.pieChartIcon} />
        </TouchableOpacity>
        
      </View>
      
        <FlatList 
          style={{marginTop: 20}}
          data={posts}
          renderItem={({item}) => <Postcard item={item} navigation={navigation}/>}
          keyExtractor={item => item.name}
        />
       
      
        <ActionButton buttonColor='#347deb' style={styles.buttonPosition} >
            <ActionButton.Item buttonColor='#34e1eb' title="Water" onPress={() => {navigation.push('AddWater')}}>
              <Icon name="water" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1abc9c' title="Food" onPress={() => {navigation.push('AddFood')}}>
              <MaterialCommunityIcons name="food-apple" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#F86D4F' title="Weight" onPress={() => {navigation.push('AddWeight')}}>
              <MaterialCommunityIcons name="scale-bathroom" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
      </View>
  )
}

export default FoodScreen

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 25,
        height: 25,
        color: 'white',
      },
    buttonPosition: {
      justifyContent: 'flex-end',
      alignItems:'flex-end',
      position: 'absolute',
      bottom: 20,
      right: 10
    },
    pieChartIcon: {
      justifyContent: 'flex-end',
      alignItems:'flex-end',
      position: 'absolute',
      bottom:5,
      right: 10
    },
    header: {
      justifyContent:'center',
      alignSelf:'center',
      fontSize: 20,
      marginTop: 10,
      fontWeight: 'bold',
    },
    headerBorder: {
      borderBottomColor: '#111',
      borderColor: 'transparent',
      borderWidth: 5,
      paddingBottom: 10,
      fontFamily: 'Roboto'
    }
})