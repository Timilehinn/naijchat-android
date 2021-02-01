import React,{useState,useEffect,useContext, useRef} from 'react'
import { 
  View, 
  ScrollView, 
  Text,
  TextInput, 
  Dimensions, 
  StyleSheet,
  ActivityIndicator,
  InvertibleScrollView,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image
       } from 'react-native'
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  TouchableRipple,
  Switch
      }from 'react-native-paper';
import ChatHeader from '../chatHeader'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import  {MessageContext} from '../contextApi'
import {SocketContext} from '../socketProvider.js'

import io from "socket.io-client";
import axios from 'axios'
import { AppThemeContext } from '../appThemeProvider'
import { Image as ImageRNE } from 'react-native-elements';
import{launchCamera, launchImageLibrary} from 'react-native-image-picker'
import IonIcon from 'react-native-vector-icons/Ionicons';



const iconName= "information-variant"


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


function Chatscreen({route, navigation}) {
  const {darkMode,setDarkMode} = useContext(AppThemeContext);
  const scrollRef = useRef()
  const [chatMessage, setChatMessage] =useState('')
  const [chatMessages, setChatMessages] =useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [allMessages, setAllMessages] =useState([])
  const [newMessages, setNewMessages] = useState([])
  const [chat,setChat] = useState([])
  const [isMessages, setIsMessages] = useState(false)
  const room = route.params.topic.slug
  const {session,setSession,userDetails,setUserDetails} = useContext(MessageContext);
  const {socket} = useContext(SocketContext);
  const usr_img = `${userDetails[0].img+'.png'}` 
  const [ photo, setPhoto ] = useState(null)
  const [ photoBase64, setPhotoBase64 ] = useState('')


//   const [chatMessages, setChatMessages] =useState([])
  const [txt,setTxt]=useState('')
//   const [loading, setLoading] = useState(true)
//   const [appMsg,setAppMsg]=useState('')
//   const [modalVisible, setModalVisible] = useState(false);
//   const [topics, setTopics] = useState([])
//   const [currentTopic, setCurrentTopic] = useState([])

  useEffect(()=>{

  // socket = io("http://192.168.43.223:3333");
  console.log(socket.id, 'from home screen')
 
  async function fetchMessages() {
    const messageData = await axios.get(`http://192.168.43.223:3333/messages?slug=${route.params.topic.slug}`)
    setAllMessages(messageData.data);
    setIsMessages(true)
  }
  fetchMessages()

  socket.emit("usr-joined", (room));

    socket.on('messageBot',msg=>{
      // console.log(socket.id, 'from home screen')
    })

    socket.on("app-msg", msgFromServer => {
      // console.log(socket.id)
      setChat((prevChat)=>{
        return [
          msgFromServer,...prevChat
        ]
      })
    });

  
    return () => {
      socket.emit("usr-disconn",`${userDetails[0].fullname}, left`);
      // setAllMessages([])
      socket.off('app-msg')
    }
  },[])


  const handleChoosePhoto = () => {
    const options = {
      noData: true,
      includeBase64 : true
    }
    launchImageLibrary(options, async response => {
      if(response.uri){
          if(response.fileSize > 1000000){
              Alert.alert('Sorry','file size cannot exceed 1mb, try not to detroy our servers :)')
              setPhoto(null)
          }else{
              setPhoto(response)
              await setPhotoBase64(response.base64)
          }
      }
    })
  }
//   const value = useContext(MessageContext)
//   console.log(value,' dfbfb')
const submitMsg=()=>{
  if(chatMessage || photo){
    socket.emit('the-msg',{
      msg:chatMessage,
      user_name:userDetails[0].fullname,
      img:userDetails[0].img,
      room:route.params.topic.slug,
      verified:userDetails[0].verified,
      email:userDetails[0].email,
      photoBase64
    })
    setChatMessage('')
    setPhoto(null)
    setPhotoBase64('')
  }else{
    console.log('nope')
  }
}

if(!isMessages){
  return <View style={[{...styles.container,backgroundColor:darkMode.backgroundColor}, styles.horizontal]}><ActivityIndicator size="large" color="#5cab7d" /></View>
}
    return (
        <>
        <View style={{flex:10,backgroundColor:darkMode.backgroundColor}}>
            <ChatHeader navigation={navigation} title={route.params.topic.title} />
            <ScrollView style={{flex:3,height:windowHeight}} ref={scrollRef}>

            <View style={{...styles.topic,borderColor:darkMode.border}}>
              <View style={{...styles.topicBody,backgroundColor:darkMode.backgroundColor}}>
                      
                  <TouchableOpacity onPress={()=>navigation.navigate('profile',{user:route.params.topic.creator_email})} >
                    <Avatar.Image 
                      source={{uri:route.params.topic.creator_img}}
                      size={60}
                    />  
                  </TouchableOpacity>
                  
                  <View style={{width:'85%'}}>
                    <Text style={{marginLeft:15,color:'grey',fontWeight:'bold'}}>
                      @{route.params.topic.creator} {route.params.topic.is_poster_verified =='true' ? <IonIcon name="ios-checkmark-circle-outline" size={15} color='#5cab7d'/> : <></>}</Text>
                    <Text style={{marginLeft:15,color:darkMode.color,fontWeight:'bold'}}>{route.params.topic.title}</Text>
                  </View>
              </View>
              {route.params.topic.img === 'data:image/png;base64,' ? <></> 
                  : 
                  <TouchableOpacity
                      style={{ ...styles.openButton }}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}
                    >
                  <ImageRNE 
                      source={{ uri: route.params.topic.img }}
                      style={{  borderRadius:5,width:'100%', maxWidth:600, height: 180 }}
                      PlaceholderContent={<ActivityIndicator />}
                      resizeMode="cover"
                    />
                    </TouchableOpacity>

              }
              <Text style={{marginLeft:15,color:darkMode.color,fontSize:20}}>{route.params.topic.topic_body}</Text>
              <Text style={{marginLeft:15,color:'grey',fontSize:15}}>{route.params.topic.date} - {route.params.topic.time}</Text>
            </View>
            {/* TO SHOW IMAGE FROM OP */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.modalView}>
                  <ImageRNE 
                      source={{ uri: route.params.topic.img }}
                      style={{  width:'100%', maxWidth:600, height:'100%' }}
                      PlaceholderContent={<ActivityIndicator />}
                      resizeMode="center"
                  />
                </View>
            </Modal>

            {chat.map(message=>(
                <View key={message.id} style={{...styles.chatmsg,backgroundColor:darkMode.backgroundColor,borderColor:darkMode.border}}>
                    <Avatar.Image 
                      source={{uri:message.img}}
                      size={35}
                    />
                    <View style={{width:'85%'}}>
                      <Text style={{marginLeft:15,color:'grey',fontSize:10}}>@{message.username} {
                        message.verified == 'true' ? <IonIcon name="ios-checkmark-circle-outline" size={15} color='#5cab7d'/> : <></>
                      }</Text>
                      <Text style={{marginLeft:15,color:darkMode.color}}>{message.text}</Text>
                        {
                          message.msg_w_img === 'data:image/png;base64,' ? <></> 
                          : 
                          <Image source={{uri:message.msg_w_img}}  
                            style={{width:'90%',maxWidth:600,marginLeft:15,marginTop:5,marginBottom:5,height:150}}
                            resizeMode="stretch"
                            />
                        }
                      <Text style={{marginLeft:15,color:'grey',fontSize:10}}>{message.time}</Text>
                    </View>
                 
                </View>
              ))}
              {allMessages.map(message=>(
                <View key={message.id} style={{...styles.chatmsg,backgroundColor:darkMode.backgroundColor,borderColor:darkMode.border}}>
                    <Avatar.Image 
                      source={{uri:message.img}}
                      size={35}
                    />
                  <View style={{width:'90%'}}>
                      <Text style={{marginLeft:15,color:'grey',fontSize:10}}>@{message.name} {
                        message.is_msg_sender_verified == 'true' ? <IonIcon name="ios-checkmark-circle-outline" size={15} color='#5cab7d'/> : <></>
                      }</Text>
                      <Text style={{marginLeft:15,color:darkMode.color}}>{message.messages}</Text>
                        {
                          message.messages_with_img === 'data:image/png;base64,' ? <></> 
                          : 
                          <Image source={{uri:message.messages_with_img}} 
                            style={{width:'90%',maxWidth:600,marginLeft:15,marginTop:5,marginBottom:5,height:150}}
                            resizeMode="stretch"
                          />
                        }
                      <Text style={{marginLeft:15,color:'grey',fontSize:8}}>{message.time}</Text>
                    </View>
                </View>
              ))}
              
        </ScrollView>
        </View>
        {photo && (
        <View style={{backgroundColor:darkMode.backgroundColor}}>
          <View style={{marginLeft:100,backgroundColor:darkMode.backgroundColor}}>
            <TouchableWithoutFeedback onPress={()=>setPhoto(null)} >
                <Icon name="close" size={20} color={darkMode.border}/>
            </TouchableWithoutFeedback>
          </View>
          <Image
            source={{ uri: photo.uri }}
            style={{  borderRadius:30,width:120, height: 120,backgroundColor:darkMode.backgroundColor }}
          />
        </View>
        )}
            <View style={{...styles.SectionStyle,backgroundColor:darkMode.backgroundColor}}>
        
                {/* CHOOSE IMAGE BUTTON */}
                <TouchableOpacity onPress={()=>handleChoosePhoto()}>
                  <IconMI name="add-a-photo" size={27} color="#5cab7d" />
                </TouchableOpacity>
                <TextInput
                    style={{flex:1,maxHeight:120, paddingLeft:10,borderColor:darkMode.border,color:darkMode.color}}
                    autoCorrect={false}
                    onChangeText={e=>setChatMessage(e)}
                    value={chatMessage}
                    // onSubmitEditing={()=>submitMsg()}
                    placeholder='start typing ...'
                    placeholderTextColor='grey'
                    multiline={true}
                    numberOfLines={1} 
                    maxLength={250}
                />
                <TouchableOpacity onPress={()=>submitMsg()}>
                  <IconMC name="send-circle" size={30} color="#5cab7d" />
                </TouchableOpacity>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
  topic:{
    
    // backgroundColor:'#5cab7d',
    borderBottomWidth:.5,
    padding:10,
  },
  topicBody:{
    display:'flex',
    flexDirection:'row',
    alignItems:'flex-start',
    // backgroundColor:'#5cab7d',
    // borderBottomWidth:.5,
    padding:10,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: .5,
    paddingLeft:10,
    paddingRight:10
    // height: 50,
    // margin: 10
},
ImageStyle: {
  padding: 10,
  margin: 5,
  height: 25,
  width: 25,
  resizeMode : 'stretch',
  alignItems: 'center'
},
  chatmsg:{
    display:'flex',
    flexDirection:'row',
    alignItems:'flex-start',
    // backgroundColor:'#5cab7d',
    borderBottomWidth:.5,
    borderColor:'#5cab7d',
    margin:3,
    padding:10,
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  modalView:{
      // margin: 20,
      backgroundColor: 'grey',
      height:windowHeight,
      // padding: 35,
      justifyContent:'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
  }
})

export default Chatscreen
