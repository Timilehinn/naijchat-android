import React, { useEffect, useState, useContext } from 'react'
import { View,Text,TextInput, TouchableOpacity,Image, Alert,StyleSheet, Dimensions, ScrollView, ActivityIndicator, ActivityIndicatorBase } from 'react-native'
import {MessageContext} from '../contextApi.js'
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


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


function ProfileScreen({navigation,route}) {

    const {session,setSession,userDetails,setUserDetails} = useContext(MessageContext);
    const {darkMode,setDarkMode} = useContext(AppThemeContext);
    const usr_img = `${userDetails[0].img}` 
    const [loading, setLoading ] = useState(true)
    const [ profileData, setProfileData ] = useState([])
    const [ profileTopicData, setProfileTopicData ] = useState([])
    console.log(route.params)

    useEffect(()=>{
       setLoading(true)
        async function getProfileData(){
          try{
            const res = await axios.get(`http://192.168.43.223:3333/api/profile?email=${route.params.user}`)
            const res_t = await axios.get(`http://192.168.43.223:3333/get-profile-topics?email=${route.params.user}`)
            setProfileData(res.data.profile)
            setProfileTopicData(res_t.data.profile_topics)

            setLoading(false)
          }catch(e){
            console.log(e)
          }
           
        }
        getProfileData()
        console.log(profileData)
    },[])
   
   
    return (
        <View style={{flex:1,backgroundColor:darkMode.backgroundColor}}>
        <ScrollView>
          {loading ? <ActivityIndicator size="small" color="white" /> : (
            <>
            {profileData.length > 0 ? (
              <>
                <View style={{padding:20,display:'flex',flexDirection:'row',justifyContent:'center',borderColor:darkMode.border,borderBottomWidth:.5,width:windowWidth,}}>
                  <Avatar.Image source={{ uri:profileData[0].img }} size={100} /> 
                  {profileData[0].verified === 'true' ? <IonIcon name="ios-checkmark-circle-outline" size={15} color='#5cab7d'/> : <></>} 
                </View>
                <View style={{display:'flex'}}>
                  <Text style={{color:'grey',textAlign:'center',fontSize:20}}>@username </Text>
                  <View style={{display:'flex',margin:20,flexDirection:'row',justifyContent:'center'}}>
                      <Text style={{color:darkMode.color,textAlign:'center',fontSize:30}}> {profileData[0].fullname} </Text>
                      <TouchableOpacity onPress={()=>navigation.navigate('dmchat',{user_img:profileData[0].img,user:profileData[0].fullname,user_email:profileData[0].email,user_socket_id:profileData[0].online_socket_id})} style={{backgroundColor:'#5cab7d',borderRadius:20}}>
                        <Text style={{padding:10, color:darkMode.color}}>send message</Text>
                      </TouchableOpacity>
                  </View>
                  
                </View>
                <View style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                  <Text style={{color:'grey',textAlign:'center',fontSize:15}}>followers</Text>
                  <Text style={{color:'grey',textAlign:'center',fontSize:15}}>following</Text>
                </View>
                <View style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                  <Text style={{color:'grey',textAlign:'center',fontSize:15}}>-</Text>
                  <Text style={{color:'grey',textAlign:'center',fontSize:15}}>-</Text>
                </View>
              </>
              //<<< user not found here >>>
            ):(
              <>
              <View style={{padding:20,display:'flex',flexDirection:'row',justifyContent:'center',borderColor:darkMode.border,borderBottomWidth:.5,width:windowWidth,}}>
                <Avatar.Image source={{ uri:'not found'}} size={100} /> 
                
              </View>
              <View style={{display:'flex'}}>
                <Text style={{color:'grey',textAlign:'center',fontSize:20}}>not found</Text>
                <View style={{display:'flex',margin:20,flexDirection:'row',justifyContent:'center'}}>
                    <Text style={{color:darkMode.color,textAlign:'center',fontSize:30}}> User not found</Text>
                </View>
                
                {/* <Text style={{color:'grey',textAlign:'center',fontSize:20}}><Icon name="envelope" /> {profileData[0].email}</Text> */}
              </View>
              <View style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                <Text style={{color:'grey',textAlign:'center',fontSize:15}}>followers</Text>
                <Text style={{color:'grey',textAlign:'center',fontSize:15}}>following</Text>
              </View>
              <View style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                <Text style={{color:'grey',textAlign:'center',fontSize:15}}>-</Text>
                <Text style={{color:'grey',textAlign:'center',fontSize:15}}>-</Text>
              </View>
              </>
            )}
              
              {profileTopicData.map(topic=>(
                <View key={topic.id} style={{alignSelf:'center',padding:20,borderRadius:25,width:'90%',marginBottom:20,borderColor:darkMode.border,borderWidth:.5}}>
                  <Text style={{color:darkMode.color,fontWeight:'bold'}}>{topic.title}</Text>
                      {topic.img === 'data:image/png;base64,' ? <></> :
                       <Image source={{uri:topic.img}} 
                        style={{width:'100%',height:100}}
                        resizeMode="stretch"
                      />}
                  <Text style={{color:darkMode.color}}>
                    {topic.topic_body.length > 80 ? topic.topic_body.substring(0,80)+'...' : topic.topic_body }
                  </Text>
                  <Text style={{color:'grey'}}>{topic.time} - {topic.date}</Text>
                </View>
              ))}
           </>
          ) }
          
          </ScrollView>
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

export default ProfileScreen
