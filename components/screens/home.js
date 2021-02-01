import React, {useState,useEffect, useContext} from 'react'
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Modal,
    TextInput,
    StatusBar,
    Button,
    Dimensions,
    Alert,
    Image,
    TouchableHighlight,
    ActivityIndicator,
    ToastAndroid,
  } from 'react-native';
  import TrackPlayer from 'react-native-track-player';
  import io from "socket.io-client";
import Header from '../header'
import ChatHeader from '../chatHeader'
import axios from 'axios' 
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './chatscreen'
import PTRView from 'react-native-pull-to-refresh';
import { Image as ImageRNE } from 'react-native-elements';
import { FloatingAction } from "react-native-floating-action";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  TouchableRipple,
  Switch
      }from 'react-native-paper';
import FastImage from 'react-native-fast-image'
import { AppThemeContext } from '../appThemeProvider'
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {SocketContext} from '../socketProvider.js'
import  {MessageContext} from '../contextApi'


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


  // const Stack = createStackNavigator();
  
// function StackScreen({ navigation }){
//   return(
//     <Stack.Navigator>
//       <Stack.Screen name='chat' component={ChatScreen} />
//     </Stack.Navigator>
//   )
// }



function Home({navigation}) {

  const {darkMode,setDarkMode} = useContext(AppThemeContext);
  const {session,setSession,userDetails,setUserDetails} = useContext(MessageContext);
  const {socket} = useContext(SocketContext);

  const [chatMessage, setChatMessage] =useState('')
  const [chatMessages, setChatMessages] =useState([])
  const [txt,setTxt]=useState('')
  const [loading, setLoading] = useState(true)
  const [appMsg,setAppMsg]=useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [topics, setTopics] = useState([])
  const [currentTopic, setCurrentTopic] = useState([])
  const [ offset, setOffset ] = useState(15)

  useEffect(()=>{
    socket.on('connect',()=>{
      console.log('user connected')
    })
    
    console.log(socket.id,'rrr')
    socket.emit("SAVE_CLIENT_SOCKET_ID",{email:userDetails[0].email,soc_id:socket.id})

    async function fetchTopicData() {
      try{
        const topicData = await axios.get('http://192.168.43.223:3333/topics')
        setTopics(topicData.data);
      }catch(e){
        ToastAndroid.showWithGravity(
          "Unable to fetch topics.",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
      );
      }
    }
    fetchTopicData()
},[])
  
// const _refresh =()=>{
//   async function fetchTopicData() {
//     const topicData = await axios.get('http://192.168.43.223:3333/topics')
//     setTimeout(()=>{
//       setTopics(topicData.data)
//     },2000)
//   }
//     fetchTopicData
// }
// const offset = 15;
const loadEarlierTopics= async ()=>{
  const earlierTopicData = await axios.get(`http://192.168.43.223:3333/more-topics?off=${offset}`)
  setTopics((prevTopics)=>{
    return [
      ...prevTopics,...earlierTopicData.data
    ]
  })
  if(earlierTopicData.data.length > 0){
    setOffset(offset+10)
  }
}
const _refresh=()=>{
  setOffset(15)
  return new Promise(async(resolve) => {
    setTimeout(()=>{resolve()}, 2000)
    const topicData = await axios.get('http://192.168.43.223:3333/topics')
    setTopics(topicData.data)
  });
}
// {loading ? 
//   <View style={[styles.containerIndicator, styles.horizontal]}><ActivityIndicator size="large" color="green" /></View>
//   :
//   <View></View>
// }
    return (
        <View style={{height:windowHeight,backgroundColor:darkMode.backgroundColor}}>
      {/* <StatusBar backgroundColor='transparent'  /> */}
        
           <Header navigation={navigation} title="Recent topics"/>
           <PTRView style={{marginBottom:50,backgroundColor:darkMode.backgroundColor}} onRefresh={_refresh} >
           {topics.map(topic=>(
              <TouchableHighlight key={topic.id} activeOpacity={.95} onPress={()=>navigation.navigate('chat_screen',{topic:topic})}>
                  <View style={{...styles.topic,borderColor:darkMode.border,backgroundColor:darkMode.backgroundColor,}}>
                    <Avatar.Image 
                      source={{ uri:topic.creator_img }}
                      size={50}
                    />
                    <View style={{marginLeft:15}}>
                        <Text style={{fontSize:12,color:'lightgrey',fontWeight:'bold'}}>
                          @{topic.creator} {topic.is_poster_verified == 'true' ? <IonIcon name="ios-checkmark-circle-outline" size={15} color='#5cab7d'/> : <></>}
                        </Text>
                        <Text 
                          style={{fontWeight:'bold',color:darkMode.color,}}>
                            {topic.title.length > 50 ? topic.title.substring(0,50)+'...' : topic.title}
                        </Text>
                          {topic.img === 'data:image/png;base64,' ? <></> 
                          : 
                          <ImageRNE 
                              source={{ uri: topic.img }}
                              style={{  marginTop:10,marginBottom:10,borderRadius:20,width:windowWidth-100, maxWidth:600, height: 220 }}
                              PlaceholderContent={<ActivityIndicator />}
                              resizeMode="cover"
                          />
                          }
                          <View style={{width:'90%'}}>
                            <Text style={{color:darkMode.color}}>{topic.topic_body.length > 140 ? topic.topic_body.substring(0,140)+'...' : topic.topic_body}</Text>
                            <Text style={{color:'grey',fontSize:10}}>{topic.date} - {topic.time}</Text>
                          </View>
                    </View> 
                  </View>
              </TouchableHighlight>
            ))}
            
            <TouchableOpacity style={{marginBottom:25}} onPress={()=>loadEarlierTopics()}>
              <Text style={{textAlign:'center',padding:17,color:darkMode.color}}>load earlier topics</Text>
            </TouchableOpacity>
           </PTRView>
      </View>
    )
}
const styles = StyleSheet.create({
  topic:{
    padding:10,
    elevation:3,
    borderBottomWidth:.5,
    display:'flex',
    flexDirection:'row',
    alignItems:'flex-start'
  },
  containerIndicator: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    width:windowWidth,
    height:windowHeight,
    backgroundColor: "white",
    paddingTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  modalHeader: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:15,
    borderBottomWidth:.5
  },
  leaveButton: {
    backgroundColor: "white",
    padding: 10,
    elevation: 2,
    borderWidth:.5,
    alignSelf:'flex-end',
    color: "white",
  },
  leaveButtonTxt: {
    fontWeight: "bold",
    color:'black'
  },

  naijChatTxt: {
    fontWeight: "bold",
    color:'black',
    fontSize:30
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})
export default Home
{/* <FastImage
                          style={{ width: 200, height: 200 }}
                          source={{
                              uri: topic.img,
                              headers: { Authorization: 'someAuthToken' },
                              priority: FastImage.priority.low,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                      /> */}