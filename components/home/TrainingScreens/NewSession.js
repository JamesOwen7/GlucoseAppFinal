import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Dimensions
} from 'react-native'
import React, {useState, useEffect} from 'react'
import {Stopwatch} from 'react-native-stopwatch-timer'
import { auth, db } from '../../../firebase'
import { doc, setDoc, collection, query, getDocs, onSnapshot, orderBy, QuerySnapshot } from "firebase/firestore";
import moment from 'moment'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

const NewSession = ({navigation}) => {

  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  
  const [glucose, setGlucose] = useState([0])
  const [time, setTime] = useState([0])
  const [duration, setDuration] = useState(0)
  const [press, setPress] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)


  const getGlucose = () => {
    try {
      
      const user = auth.currentUser
      const colRef = query(collection(db, 'users', user.email, moment().format('YYYY-MM-DD')))

      const unsubscribe = onSnapshot(colRef, ( querySnapshot) => {
        const data = []
        const glucose = []
        const time = []
        querySnapshot.forEach((doc) => {
          data.push({...doc.data(), id: doc.id })
          
          
        })
        for (let n = 0; n < data.length; n++) {
          if (data[n].glucose){
            glucose.push(parseFloat(data[n].glucose))
            time.push(data[n].time)
          } else {

          }
        }
        // console.log(glucose)
        // console.log(time)
        setGlucose(glucose)
        setTime(time)
      })

    } catch(error) {

      console.log(error)

    }
  }

  useEffect(() => {
    getGlucose()
  }, [])

  return (
    <ScrollView style={{flex:1, backgroundColor:'white'}}>
        <View style={styles.sectionStyle}>
          <Stopwatch
            laps
            // msecs
            start={isStopwatchStart}
            // To start
            reset={resetStopwatch}
            // To reset
            options={options}
            // Options for the styling
            getTime={(time) => {
              setDuration(time)
            }}
          />
          <TouchableHighlight
          style={styles.startButtonStyle(isStopwatchStart)}
            onPress={() => {
              if (press === 0) {
                setPress(1);
                console.log(press);
                setIsStopwatchStart(!isStopwatchStart);
                setResetStopwatch(false);
                setStartTime(moment().format('LT'));
                console.log(startTime)
              } else {
                console.log(press);
                console.log(startTime)
                setIsStopwatchStart(!isStopwatchStart);
                setResetStopwatch(false);
              }
            }}>
            <Text style={styles.buttonText}>
              {!isStopwatchStart ? 'START' : 'PAUSE'}
            </Text>
          </TouchableHighlight>
          
          <TouchableHighlight
            style={styles.resetButtonStyle}
            onPress={() => {
              setPress(0);
              setIsStopwatchStart(false);
              setResetStopwatch(true);
            }}>
            <Text style={styles.buttonText}>RESET</Text>
          </TouchableHighlight>
          
        </View>
        
        <TouchableOpacity 
          style={styles.glucoseButtonStyle}
          onPress={() => {navigation.push('AddGlucose')}}>
          <Text style={styles.buttonText}>Add Glucose Measurement</Text>
        </TouchableOpacity>
        
        <View style={styles.graphContainer}>
              <Text style={styles.userInfoTitle}>Glucose Tracker (mmol/L)</Text>
              <LineChart
                data={{
                  labels: time,
                  datasets: [
                    {
                      data: glucose,
                    }
                  ]
                }}
                width={Dimensions.get("window").width} // from react-native
                // verticalLabelRotation={310}
                height={250}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: "#01D702",
                  backgroundGradientFrom: "#0C4FF6",
                  backgroundGradientTo: "#01D702",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#EBA925"
                  }
                }}
                // bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  justifyContent:'center',
                  marginLeft:30
                }}
              />

        </View>
        <TouchableOpacity 
          style={styles.finishButtonStyle}
          onPress={() => {
            setEndTime(moment().format('LT'))
            setPress(0);
            setIsStopwatchStart(false);
            console.group(endTime)
            navigation.navigate('SessionData', 
            {time: time, glucose: glucose, duration: duration, startTime: startTime, endTime: endTime})}}>
          <Text style={styles.buttonText}>FINISH</Text>
        </TouchableOpacity>
    </ScrollView>
  )
}

export default NewSession

const styles = StyleSheet.create({
    glucoseButtonStyle: {
        // marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'#2591EB',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      },
      finishButtonStyle: {
        marginBottom:10,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'red',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      },
      graphContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop:10,
      },
      resetButtonStyle: {
        marginTop:10,
        paddingTop:15,
        padding:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'#ABB8C3',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      },
      startButtonStyle: isStopwatchStart => ({
        marginTop:10,
        paddingTop:15,
        padding:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor: !isStopwatchStart ? '#01D702':'#DB3E00',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      }),
      buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
      },
      sectionStyle: {
        // flex: 1,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop:10,
        textAlign: 'center',
        // color:'white'
      },
})

const options = {
  container: {
    backgroundColor: '#111',
    padding: 5,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    color: '#FFF',
    marginLeft: 7,
  },
};