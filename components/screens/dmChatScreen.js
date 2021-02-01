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
  Image, Alert
       } from 'react-native'
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  TouchableRipple,
  Switch
      }from 'react-native-paper';
import Header from '../header'
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


function DmChatScreen({route, navigation}) {
  const {darkMode,setDarkMode} = useContext(AppThemeContext);
  const scrollRef = useRef()
  const [chatMessage, setChatMessage] =useState('')
  const [chatMessages, setChatMessages] =useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [allMessages, setAllMessages] =useState([])
  const [newMessages, setNewMessages] = useState([])
  const [chat,setChat] = useState([])
  const [isMessages, setIsMessages] = useState(false)
  const {session,setSession,userDetails,setUserDetails} = useContext(MessageContext);
  const {socket} = useContext(SocketContext);
  const usr_img = `${userDetails[0].img+'.png'}` 
  const [ photo, setPhoto ] = useState(null)
  const [ photoBase64, setPhotoBase64 ] = useState('')
    // console.log(route.params,'mykey')

//   const [chatMessages, setChatMessages] =useState([])
  const [txt,setTxt]=useState('')
//   const [loading, setLoading] = useState(true)
//   const [appMsg,setAppMsg]=useState('')
//   const [modalVisible, setModalVisible] = useState(false);
//   const [topics, setTopics] = useState([])
//   const [currentTopic, setCurrentTopic] = useState([])

  useEffect(()=>{

  console.log(socket.id, 'from dm screen')
 
//   async function fetchMessages() {
//     const messageData = await axios.get(`http://192.168.43.223:3333/messages?slug=${route.params.topic.slug}`)
//     setAllMessages(messageData.data);
//     setIsMessages(true)
//   }
//   fetchMessages()

//   socket.emit("usr-joined", (room));

//     socket.on('messageBot',msg=>{
//       // console.log(socket.id, 'from home screen')
//     })

    socket.on("server_dm_msg", msgFromServer => {
      console.log(msgFromServer,'ioi')
      setChat(msgFromServer)
    //   setChat((prevChat)=>{
    //     return [
    //       msgFromServer,...prevChat
    //     ]
    //   })
    });

  
    return () => {
    //   socket.emit("usr-disconn",`${userDetails[0].fullname}, left`);
    //   // setAllMessages([])
    //   socket.off('app-msg')
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
    socket.emit('the-dm-msg',{
      msg:chatMessage,
      user_name:route.params.user_email, //reciever's username
      img:userDetails[0].img,
      verified:userDetails[0].verified,
      from:userDetails[0].email,
      to:route.params.user_email,
      user_socket:route.params.user_socket_id,
      photoBase64
    })
    setChatMessage('')
    setPhoto(null)
    setPhotoBase64('')
  }else{
    console.log('nope')
  }
}

if(isMessages){
  return <View style={[{...styles.container,backgroundColor:darkMode.backgroundColor}, styles.horizontal]}><ActivityIndicator size="large" color="#5cab7d" /></View>
}
    return (
        <>
        <View style={{flex:10,backgroundColor:darkMode.backgroundColor}}>
        <View style={{
            dislay:'flex',
            paddingLeft:20,
            paddingRight:20,
            alignItems:'center',
            // justifyContent:'center',
            justifyContent:'space-between',
            flexDirection:'row',
            width:windowWidth,
            height:50,
            backgroundColor:darkMode.backgroundColor,
            borderBottomColor:darkMode.border,
            borderBottomWidth:.5,
            elevation:.5}}
        >
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <IconMI  name="keyboard-arrow-left" color="#5cab7d" size={30} />
                </TouchableOpacity>
                <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <Avatar.Image source={{uri:userDetails[0].img}} size={32} />
                        <Text style={{color:darkMode.color}}> ~ </Text>
                        <Avatar.Image source={{uri:route.params.user_img}} size={32} />
                </View>
                <TouchableOpacity onPress={()=>Alert.alert('Direct Messages','Each is sent securely between the two users on this end. Read more about our personal chat policies')}>
                    <IconMC  name="information-variant" color="#5cab7d" size={20} />
                </TouchableOpacity>
            </View> 
            <ScrollView style={{flex:3,height:windowHeight}} ref={scrollRef}>
            <Text style={{color:'white'}}>{chat.text}</Text>
            </ScrollView>

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

export default DmChatScreen
