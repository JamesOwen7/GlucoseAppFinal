import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity, StatusBar, Button, Dimensions } from 'react-native'
import React, {useState, useEffect, useContext} from 'react';
import EditProfileScreen from './EditProfileScreen';
// import { getUser } from '../components/editProfileScreen/UserData';
import { auth, db } from '../firebase'
import { doc, setDoc, collection, getDoc, onSnapshot, query, deleteDoc } from "firebase/firestore";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import moment from 'moment'


const ProfileScreen = ({navigation}) => {

  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)
  const [weights, setWeights] = useState([0])
  const [dates, setDates] = useState([0])

  const getUser = () => {
    const user = auth.currentUser
    const docRef = doc(db, 'users', user.email)
    
    onSnapshot(docRef, (doc) => {
      const data=doc.data()
      // console.log(data, data.name)
      setCurrentLoggedInUser(data)
    })
  }

  const expiredWeightDoc = () => {
    const user = auth.currentUser
    const docRef = doc(db, 'users', user.email, 'weight', moment().subtract(30,'d').format('MM.DD'))
    deleteDoc(docRef)
    .then(() => {
      
    })
  }

  const getWeight = () => {
    try {
      
      const user = auth.currentUser
      const colRef = query(collection(db, 'users', user.email, 'weight'))

      const unsubscribe = onSnapshot(colRef, ( querySnapshot) => {
        const data = []
        const weights = []
        const dates = []
        querySnapshot.forEach((doc) => {
          data.push({...doc.data(), id: doc.id })
          
          
        })
        for (let n = 0; n < data.length; n++) {
          weights.push(parseFloat(data[n].weight))
          dates.push(data[n].id)
          
        }
        console.log(weights)
        // console.log(dates)
        setWeights(weights)
        setDates(dates)
      })

    } catch(error) {

      console.log(error)

    }
  }

  useEffect(() => {
    getUser()
    getWeight()
    expiredWeightDoc()
  }, [])

  return(
    <SafeAreaView style={styles.wrapper}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator = {false}
        >
            <Image style={styles.userImg} source={{uri: currentLoggedInUser ? currentLoggedInUser.userImg || 'https://i.dlpng.com/static/png/6950136_preview.png'  : 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'}} />
            <Text style={styles.userName}>{currentLoggedInUser ? currentLoggedInUser.name : 'Name'}</Text>
            <View style={styles.userBtnWrapper}>
                <TouchableOpacity style={styles.userBtn} 
                    onPress={() => {navigation.push('Edit Profile')}}>
                    <Text style={styles.userBtnTxt}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.userInfoWrapper}>
              <View style={styles.userInfoItem}>
                <Text style={styles.userInfoTitle}>{currentLoggedInUser ? currentLoggedInUser.sport : 'Sport'}</Text>
                <Text style={styles.userInfoSubTitle}>Sport</Text>
              </View>
              <View style={styles.userInfoItem}>
                <Text style={styles.userInfoTitle}>{currentLoggedInUser ? currentLoggedInUser.height : 'Height'}</Text>
                <Text style={styles.userInfoSubTitle}>Height</Text>
              </View>
              <View style={styles.userInfoItem}>
                <Text style={styles.userInfoTitle}>{currentLoggedInUser ? currentLoggedInUser.weight : 'Weight'}</Text>
                <Text style={styles.userInfoSubTitle}>Weight</Text>
              </View>

            </View>
            <View style={styles.graphContainer}>
              <Text style={styles.userInfoTitle}>Weight Tracker (kg)</Text>
              <LineChart
                data={{
                  labels: dates,
                  datasets: [
                    {
                      data: weights,
                    }
                  ]
                }}
                width={350} // from react-native
                // verticalLabelRotation={310}
                height={250}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: "#0C4FF6",
                  backgroundGradientFrom: "#223BEA",
                  backgroundGradientTo: "#E06ED0",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  }
                }}
                // bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


export default ProfileScreen

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        // marginTop:StatusBar.currentHeight
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    graphContainer: {
      flex: 1,
      backgroundColor: '#fff',
      marginBottom:10
    },
    userImg: {
      height: 150,
      width: 150,
      borderRadius: 75,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
    },
    aboutUser: {
      fontSize: 12,
      fontWeight: '600',
      color: '#666',
      textAlign: 'center',
      marginBottom: 10,
    },
    userBtnWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 10,
    },
    userBtn: {
      borderColor: '#2e64e5',
      borderWidth: 2,
      borderRadius: 3,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginHorizontal: 5,
    },
    userBtnTxt: {
      color: '#2e64e5',
    },
    userInfoWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginVertical: 20,
    },
    userInfoItem: {
      justifyContent: 'center',
    },
    userInfoTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
    },
    userInfoSubTitle: {
      fontSize: 12,
      color: '#666',
      textAlign: 'center',
    },
  });