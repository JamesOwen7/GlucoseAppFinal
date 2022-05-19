import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { 
    Card, 
    PostInfo, 
    PostTypeImage, 
    PostName, 
    PostInfoText, 
    PostTime, 
    PostText,
    PostTextWater, 
    Edit 
} from '../../../styles/FeedStyles'
import { LineChart } from 'react-native-chart-kit'

const GraphCard = ({item}) => {
  return (
    <Card>
        <PostInfo>
            <PostTypeImage source={{uri: item.postImage}}/>
            <PostInfoText>
                <PostName>{item.name}</PostName>
                <PostTime>{item.date}</PostTime>
                <PostTime>{item.startTime} - {item.endTime}</PostTime>
            </PostInfoText>
        </PostInfo>
        {/* <View style={styles.graphContainer}> */}
              <Text style={styles.userInfoTitle}>Glucose Tracker (mmol/L)</Text>
              <LineChart
                data={{
                  labels: item.time,
                  datasets: [
                    {
                      data: item.glucose,
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
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                  marginLeft:5
                }}
              />

        {/* </View> */}
        <PostText style={{fontWeight:'bold'}}>Session Activity</PostText>
        <PostText>{item.type}</PostText>
        <PostText style={{fontWeight:'bold'}}>Session Duration </PostText>
        <PostText>{item.duration}</PostText>
        <PostText style={{fontWeight:'bold'}}>Session Intensity </PostText>
        <PostText>{item.intensity}</PostText>
        <PostText style={{fontWeight:'bold'}}>Notes</PostText>
        <PostText>{item.notes}</PostText>
    </Card>
  )
}

export default GraphCard

const styles = StyleSheet.create({
    graphContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop:10,
    },
    userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
})