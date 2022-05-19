import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native'
import React, { useState, useCallback, useRef } from 'react'
import EditProfileForm from '../components/editProfileScreen/EditProfileForm'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet'
import { auth, db } from '../firebase'
import { doc, setDoc, collection, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
// import * as ImagePicker from 'react-native-image-picker'
//import CameraImage from '../components/editProfileScreen/CameraImage'
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { NavigationEvents } from 'react-navigation';
const EditProfileScreen = ({navigation}) => {
  
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
  const [image, setImage] = useState(null)

  // chooseImage = async () => {
  //   let options = {
  //     title: 'Select Image',
  //     customButtons: [
  //       { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
  //     ],
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   ImagePicker.launchImageLibrary(options, (response) => {

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       alert(response.customButton);
  //     } else {
  //       const image = response.assets[0].uri;

  //       const user = auth.currentUser
  //       setCurrentLoggedInUser(user)
  //       const docRef = doc(db, 'users', user.email)

  //       updateDoc(docRef, {
  //         userImg: image
  //       })

  //       setImage(image)

  //       this.bs.current.snapTo(1)
  //       console.log(image)
  //       }
  //   });
  // }

  // takePhoto = async () => {
  //   let options = {
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   ImagePicker.launchCamera(options, (response) => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       alert(response.customButton);
  //     } else {
  //       const image = response.assets[0].uri
        
  //       const user = auth.currentUser
  //       setCurrentLoggedInUser(user)
  //       const docRef = doc(db, 'users', user.email)

  //       updateDoc(docRef, {
  //         userImg: image
  //       })

  //       setImage(image)

  //       this.bs.current.snapTo(1)
  //       console.log(image)
  //     }
  //   });
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log('Result', result);

    if (!result.cancelled) {
      // setPickedImagePath(result.uri);
      console.log(result.uri);
      const image = result.uri
      const user = auth.currentUser
      setCurrentLoggedInUser(user)
      const docRef = doc(db, 'users', user.email)

      updateDoc(docRef, {
        userImg: image
      })

      setImage(image)

      this.bs.current.snapTo(1)
      console.log(image)
    }
  }

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      // setPickedImagePath(result.uri);
      console.log(result.uri);
      const image = result.uri
      const user = auth.currentUser
      setCurrentLoggedInUser(user)
      const docRef = doc(db, 'users', user.email)

      updateDoc(docRef, {
        userImg: image
      })

      setImage(image)

      this.bs.current.snapTo(1)
      console.log(image)
    }
  }

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity style={styles.panelButton} onPress={() => openCamera()}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={() => showImagePicker()} >
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={() => this.bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
    
  )

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}>

        </View>
      </View>
    </View>
  )

  bs = React.createRef()
  fall = new Animated.Value(1)
  
  return (
    <ScrollView style={styles.container}>
      <BottomSheet 
        ref={this.bs}
        snapPoints={[330, 0]}
        renderContent={this.renderInner}
        renderHeader={this.renderHeader}
        initialSnap={1}
        callbackNode={this.fall}
        enabledGestureInteraction={true}
      />
      <Animated.View style={{margin: 20,
        opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)), useNativeDriver: true,}}>
        <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
              <View style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                    <ImageBackground 
                    source={{
                      uri: image ? image : currentLoggedInUser ? currentLoggedInUser.userImg || 'https://i.dlpng.com/static/png/6950136_preview.png'  : 'https://i.dlpng.com/static/png/6950136_preview.png'
                    }}
                    style={{height: 100, width: 100, marginTop: 20}}
                    imageStyle={{borderRadius: 15}}
                    >
                      <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <Icon name="camera" size={35} color="#fff" style={{
                            opacity: 0.7,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: '#fff',
                            borderRadius: 10,
                        }} />
                      </View>
                    </ImageBackground>
              </View>
            </TouchableOpacity >
            {/* <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}> {currentLoggedInUser.name} </Text> */}
        </View>
      </Animated.View>
      <EditProfileForm navigation={navigation} />
    </ScrollView>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    height: 100,
    width: 100,
    borderColor: '#FF6347'
},
  inputField: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    borderWidth: 1,
},
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
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
    paddingBottom: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
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
  },
});