import { SafeAreaView, Text } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <SafeAreaView style={{marginTop: 20, backgroundColor: 'white', padding: 10}}>
      <Text style ={{fontSize: 20, fontWeight: 'bold'}}>Home</Text>
    </SafeAreaView>
  )
}

export default Header