import { 
    StyleSheet,
    Text, 
    View,
    Image,
    ScrollView,
    Dimensions
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment'
import { auth, db } from '../../firebase'
import { doc, setDoc, collection, query, getDocs, onSnapshot, orderBy,} from "firebase/firestore";
import Postcard from './FoodScreens/postcard';
import { PieChart, StackedBarChart } from 'react-native-chart-kit';

export const noDataImage = 'https://icon-library.com/images/no-data-icon/no-data-icon-10.jpg'

const screenWidth = Dimensions.get("window").width;

const HistoryScreen = ({navigation}) => {

    const [posts, setPosts] = useState(null)
    const [selectedStartDate, setSelectedStartDate] = useState(moment().format('YYYY-MM-DD'))
    const startDate = selectedStartDate ? moment(selectedStartDate).format('YYYY-MM-DD') : ''
    
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

    const onDateChange = (date) => {
        date = moment(date).format('YYYY-MM-DD')
        setSelectedStartDate(date)
        fetchData(date)
        console.log(date)
        
    }   

    const fetchData = async(date) => {
        try {
          
          const user = auth.currentUser
          const colRef = query(collection(db, 'users', user.email, date), orderBy('date', 'desc'))
    
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
            //console.log(selectedStartDate)
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
            // console.log(preCarbs, preProteins, preFats)
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
    
          //console.log(startDate)
    
        }
      }

      useEffect(() => {
        fetchData(startDate)
        onDateChange(startDate)
      }, [])
      
    return (
    
            <ScrollView style={styles.container}>

            <CalendarPicker
            onDateChange={onDateChange}
            />

            <View>
            <Text>SELECTED DATE:{ startDate }</Text>
            </View>

            <Text style={{fontSize:20, fontWeight:'bold', paddingTop:10, marginLeft:10}}>Macronutrient Overview</Text>
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
            
            <Text style={{fontSize:20, fontWeight:'bold', paddingTop:10, marginLeft:10}}>Food Diary</Text>
                <FlatList 
                    style={{marginTop: 10}}
                    data={posts}
                    renderItem={({item}) => <Postcard item={item} navigation={navigation} />}
                    keyExtractor={item=>item.name}
                />

            </ScrollView> 
    )
}

export default HistoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    //marginTop: 100,
  },
  text: {
    justifyContent: 'center', 
    alignSelf: 'center', 
    marginTop: '30%',
    fontSize: 20,
  }
});