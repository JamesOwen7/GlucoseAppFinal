import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native'
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
import { waterLogo } from './AddWater'
import { foodLogo } from './AddFood'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';

const Postcard = ({item, navigation}) => {

  const cardType = ({item, navigation}) => {
    if (item.food) {
      return(
      <Card>
          <PostInfo>
            <PostTypeImage source={{uri: item.postImage}} />
            <PostInfoText>
            <PostName>{item.id}</PostName>
            <PostTime>{item.foodTiming}</PostTime>
            </PostInfoText>
          </PostInfo>
          <PostText style={{fontWeight: 'bold'}}>{item.food}</PostText>
          <PostText>This meal contained:</PostText>
          <PostText>Carbohydrates: {item.carbs} grams</PostText>
          <PostText>Protein: {item.protein} grams</PostText>
          <PostText>Fat: {item.fat} grams</PostText>
      </Card> 
      )
    } else {
      return (
      <Card>
          <PostInfo>
            <PostTypeImage source={{uri: item.postImage}} />
            <PostInfoText>
            <PostName>{item.id}</PostName>
            </PostInfoText>
          </PostInfo>
          <PostTextWater>{item.water} ml of water logged</PostTextWater>
      </Card>
      )
    }
  }

  return (
      cardType({item, navigation})
  )
}

export default Postcard

const styles = StyleSheet.create({
  pieChartIcon: {
    justifyContent: 'flex-end',
    alignItems:'flex-end',
    position: 'absolute',
    bottom:-10,
    left:225
  },
})