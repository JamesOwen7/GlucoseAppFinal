import { StyleSheet, Text, View, Button, Dimensions, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { auth, db } from '../../../firebase'
import { doc, setDoc, collection, query, getDocs, onSnapshot, orderBy, QuerySnapshot } from "firebase/firestore";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment'

const screenWidth = Dimensions.get("window").width;

const FoodGraphs = ({navigation}) => {
    
    const [posts, setPosts] = useState(null)
    const [macros, setMacros] = useState([{
        name:'Carbohydrates',
        grams: 0,
        color: "#17F60C",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Protein",
        grams: 0,
        color: "#F00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Fat",
        grams: 0,
        color: "red",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    }
    ])

    const [pre, setPre] = useState([0, 0, 0])
    const [during, setDuring] =useState([0, 0, 0])
    const [post, setPost] = useState([0, 0, 0])

    const getMacros = async(date) => {
        try {
          
          const user = auth.currentUser
          const colRef = query(collection(db, 'users', user.email, moment().format('YYYY-MM-DD')), orderBy('date', 'desc'))
    
          const unsubscribe = onSnapshot(colRef, ( querySnapshot) => {
            const posts = []
            const data = []
            let carbTotal = 0
            let proteinTotal = 0
            let fatTotal = 0

            let preCarbs = 0
            let preProteins = 0
            let preFats = 0

            let duringCarbs = 0
            let duringProteins = 0
            let duringFats = 0

            let postCarbs = 0
            let postProteins = 0
            let postFats = 0

            querySnapshot.forEach((doc) => {
              posts.push({...doc.data(), id: doc.id})
            })

            for (let n = 0; n < posts.length; n++) {
              if (posts[n].carbs) {
                  carbTotal += parseFloat(posts[n].carbs)
                  proteinTotal += parseFloat(posts[n].protein)
                  fatTotal += parseFloat(posts[n].fat)
              } else {
                  
              }
          }

          for (let n = 0; n < posts.length; n++) {
                
            if (posts[n].foodTiming === 'Pre-Training') {
                preCarbs += parseFloat(posts[n].carbs)
                preProteins += parseFloat(posts[n].protein)
                preFats += parseFloat(posts[n].fat)
            } else if (posts[n].foodTiming === 'During Training') {
                duringCarbs += parseFloat(posts[n].carbs)
                duringProteins += parseFloat(posts[n].protein)
                duringFats += parseFloat(posts[n].fat)
            } else if (posts[n].foodTiming === 'Post-Training') {
                postCarbs += parseFloat(posts[n].carbs)
                postProteins += parseFloat(posts[n].protein)
                postFats += parseFloat(posts[n].fat)
            } else {
                console.log('Not a food document')
            }
            
          }
          setPosts(posts)

          setMacros([{
              name:'g Carbs',
              grams: carbTotal,
              color: "#17F60C",
              legendFontColor: "#ffff",
              legendFontSize: 15
          },
          {
              name: "g Protein",
              grams: proteinTotal,
              color: "#4655DB",
              legendFontColor: "#ffff",
              legendFontSize: 15
          },
          {
              name: "g Fat",
              grams: fatTotal,
              color: "red",
              legendFontColor: "#ffff",
              legendFontSize: 15
          }
          ])
            setPre([preCarbs, preProteins, preFats])
            console.log(pre)
            setDuring([duringCarbs, duringProteins, duringFats])
            console.log(during)
            setPost([postCarbs, postProteins, postFats])
            console.log(pre, during, post)
          })
    
        } catch(error) {
    
       
        }
      }
   
      useEffect(() => {
        getMacros()
      }, [])

  return (
    <View style={{backgroundColor: 'white', flex:1}}>
      <View style={styles.signUpContainer}>
            <TouchableOpacity onPress ={() => navigation.goBack()}>
            <Icon name={"arrow-back-circle"}  style ={{marginLeft:10}}
                size={40} color="black" />
            </TouchableOpacity>
            <Text style={styles.userInfoTitle}>Macronutrient Data</Text>
        </View>
        
        <View style={{}}>
        <PieChart
            data={macros}
            width={screenWidth}
            height={220}
            chartConfig = {{
                backgroundGradientFrom: "#1E2923",
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: "#08130D",
                backgroundGradientToOpacity: 0.5,
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                strokeWidth: 2, // optional, default 3
                barPercentage: 0.5,
                propsForLabels:{
                    fontFamily:'MontserratBold',
                    fontWeight:'bold'
                },
                useShadowColorFromDataset: false // optional
                }}
            accessor={"grams"}
            backgroundColor={"black"}
            paddingLeft={""}
            center={[10, 0]}
            absolute
            /> 

            <Text style={{fontSize:20, fontWeight:'bold', paddingTop:10, marginLeft:10}}>Macronutrient Timing Overview</Text>
            {/* <StackedBarChart
            data={{
                labels: ['Pre', 'During', 'Post'],
                legend: ['Carbs', 'Protein', 'Fat'],
                data: [pre, during, post],
                barColors: ['#17F60C', "#4655DB", "red"],
            }}
            width={Dimensions.get('window').width}
            height={220}
            chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                propsForLabels:{
                fontFamily:'MontserratBold',
                },
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                borderRadius: 16,
                },
            }}
            withHorizontalLabels={false}
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
            /> */}
            </View>
      
    </View>
  )
}

export default FoodGraphs

const styles = StyleSheet.create({
    signUpContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
     },
     userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        justifyContent:'center',
        alignContent:'center',
        marginLeft:30
      },
})