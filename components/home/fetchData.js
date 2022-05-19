import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { auth, db } from '../../../firebase'
import { doc, setDoc, collection, query, getDocs, onSnapshot, orderBy} from "firebase/firestore"
const fetchData = () => {

    const [posts, setPosts] = useState(null)
  //const [loading, setLoading] = useState(true)

  const fetchData = async() => {
    try {
      const posts = []
      const user = auth.currentUser
      const colRef = query(collection(db, 'users', user.email, startDate), orderBy('date', 'desc'))

      const unsubscribe = onSnapshot(colRef, ( querySnapshot) => {
        const posts = []
        querySnapshot.forEach((doc) => {
          posts.push({...doc.data(), id: doc.id})
        })
        console.log(posts)
        setPosts(posts)
      })

    } catch(error) {

      console.log(error)

    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return ( posts
  )
}

export default fetchData

const styles = StyleSheet.create({})