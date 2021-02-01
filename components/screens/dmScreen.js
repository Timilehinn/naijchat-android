import React, { useEffect, useState, useContext } from 'react'
import { View,Text,TextInput, TouchableOpacity, Alert,StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import {MessageContext} from '../contextApi.js'
import {SocketContext} from '../socketProvider.js'
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    TouchableRipple,
    Switch
  }from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import{launchCamera, launchImageLibrary} from 'react-native-image-picker'
import axios from 'axios'
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppThemeContext } from '../appThemeProvider'
import io from "socket.io-client";
import Header from '../header'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;




function DmScreen({navigation,route}) {
    console.log(route)
    const {session,setSession,userDetails,setUserDetails} = useContext(MessageContext);
    const {socket} = useContext(SocketContext);
    const {darkMode,setDarkMode} = useContext(AppThemeContext);
    const usr_img = `${userDetails[0].img}` 
    const [ searchValue, setSearchValue ] = useState('')
    const [ foundValue, setFoundValue ] = useState('')
    const [ allTopics, setAllTopics ] = useState([])
    const [loading, setLoading ] = useState(true)
    const [ myPersonalMessages, setMyPersonalMessages ] = useState([])
    console.log(route.params,'route')
    useEffect(()=>{
       
        console.log(socket.id ,'werey')
       
        async function myPersonalMessagesFromDB() {
            try{
                res = await axios.get(`http://192.168.43.223:3333/direct_messages?email=${userDetails[0].email}`)
                setMyPersonalMessages(res.data.dms)
            }catch(e){
                console.log(e)
            }
        }
        myPersonalMessagesFromDB()
       
    },[])
   
  
    return (
        <View style={{flex:1,backgroundColor:darkMode.backgroundColor}}>
            <Header navigation={navigation} title="Direct Messages" />
            {myPersonalMessages.length > 0 ? (
                <>
                {myPersonalMessages.map(msgs=>(
                    <View key={msgs.id} style={{backgroundColor:'red'}}>
                        <Text>{msgs.sent_to}</Text>
                    </View>
                ))}
                </>
            ) : (
                <View style={{padding:20,flex:1,justifyContent:'center',alignItems:'center'}}>
                    <IconMC name="email-plus-outline" size={60} color="grey" />
                    <Text style={{color:'grey',textAlign:'center',fontWeight:'bold',fontSize:20}}>naijchat personalized messages.</Text>
                    <Text style={{color:'grey',textAlign:'center',lineHeight:20,fontSize:12}}>This is a secure way of 
                    sending messages between you and others through the naijchat platform.</Text>
                    {/* send messages */}
                    <TouchableOpacity onPress={()=>Alert.alert('Coming soon!!!','This feature is being worked on :)')} style={{borderWidth:5,borderColor:'#228b29', marginTop:10,borderRadius:30,backgroundColor:"#5cab7d"}}>
                    {/* <TouchableOpacity onPress={()=>navigation.navigate('dmsearch')} style={{borderWidth:5,borderColor:'#228b29', marginTop:10,borderRadius:30,backgroundColor:"#5cab7d"}}> */}
                        <Text style={{padding:10,color:'white'}}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            )}
            
        </View>
    )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    height:windowHeight
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10
  },
    textInput:{
        height: 60,
        margin:15, 
        borderWidth: 1,
        borderRadius:50,
        borderColor:'#5cab7d',
        paddingLeft:20,
        // marginTop:30
    },
    changeImg:{
        height: 60,
        width:120,
        borderWidth: 6,
        marginTop:20,
        backgroundColor:'#5cab7d',
        borderRadius:50,
        borderColor:'#228b29',
        justifyContent:'center'
    },
    updateProfile:{
        height: 60,
        margin:20, 
        borderWidth: 6,
        marginTop:20,
        backgroundColor:'#5cab7d',
        borderRadius:50,
        borderColor:'#228b29',
        justifyContent:'center'

    }
})

export default DmScreen
