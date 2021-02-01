import {SafeAreaProvider} from 'react-native-safe-area-context'
import 'react-native-gesture-handler';
import React,{ useEffect,useState,useContext } from 'react';
import axios from 'axios'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  Button,
  Alert,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  Switch,
  BackHandler
} from 'react-native';
// import io, { Socket } from "socket.io-client";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator,  DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/screens/home.js'
import SearchScreen from './components/screens/searchScreen.js'
import ChatScreen from './components/screens/chatscreen.js'
import SettingsScreen from './components/screens/settings.js'
import LoginScreen from './components/screens/LoginScreen'
import RegisterScreen from './components/screens/RegisterScreen'
import CreateTopicScreen from './components/screens/CreateTopicScreen'
import DmScreen from './components/screens/dmScreen'
import DmSearchUsers from './components/screens/dmSearchUsers.js'
import DmChatScreen from './components/screens/dmChatScreen.js'
import ProfileScreen from './components/screens/profileScreen'
import Icon from 'react-native-vector-icons/FontAwesome';
import {MessageContext} from './components/contextApi.js'
import SocketProviderApi from './components/socketProvider.js'
import {SocketContext} from './components/socketProvider.js'
import ContextApi from './components/contextApi.js'
import AppThemeProvider from './components/appThemeProvider.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  TouchableRipple,
  // Switch
}from 'react-native-paper';
import {Image} from 'react-native'
import Toast from 'react-native-toast-message';
import { AppThemeContext } from './components/appThemeProvider'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';



const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();


const LoginStackScreen =(props)=>{
  const session = useContext(MessageContext);
  const userDetails = useContext(MessageContext);
  return(
    <Stack.Navigator screenOptions = {{
      headerShown:false
    }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen}/>
    </Stack.Navigator>

  )
}


const HomeStackScreen = ({ navigation,route }) =>{
  return(
  <Stack.Navigator screenOptions = {{
      // headerStyle :{
      //   backgroundColor: '#4682b4',
      // },
      // headerTintColor: 'white',
      // headerTitleStyle:{
      //   // fontWeight:'bold',
      // }
      headerShown:false
  }} >
  <Stack.Screen name="uploads" component={MyTabs} options={{
      title:'Uploads',
      headerLeft:()=>(
           <Icon name ='menu' color='white' size={25} style={{marginLeft:15}} onPress={()=>{navigation.openDrawer()}}/>
      )
  }}/>
  <Stack.Screen name="create_topic" component={CreateTopicScreen} options={{
      title:'Create T',
      headerLeft:()=>(
           <Icon name ='menu' color='white' size={25} style={{marginLeft:15}} onPress={()=>{navigation.openDrawer()}}/>
      )
  }}/>
  <Stack.Screen name="chat_screen" component={ChatScreen} options={{
      title:'Chat',
      headerLeft:()=>(
           <Icon name ='menu' color='white' size={25} style={{marginLeft:15}} onPress={()=>{navigation.openDrawer()}}/>
      )
  }}/>
  <Stack.Screen name="settings" component={SettingsScreen} options={{
      title:'Settings',
      headerLeft:()=>(
           <Icon name ='menu' color='white' size={25} style={{marginLeft:15}} onPress={()=>{navigation.openDrawer()}}/>
      )
  }}/>
   <Stack.Screen name="profile" component={ProfileScreen} options={{
      title:'Settings',
      headerLeft:()=>(
           <Icon name ='menu' color='white' size={25} style={{marginLeft:15}} onPress={()=>{navigation.openDrawer()}}/>
      )
  }}/>
   <Stack.Screen name="dmsearch" component={DmSearchUsers} options={{
      title:'dmsearch',
      headerLeft:()=>(
           <Icon name ='menu' color='white' size={25} style={{marginLeft:15}} onPress={()=>{navigation.openDrawer()}}/>
      )
  }}/>
  <Stack.Screen name="dmchat" component={DmChatScreen} options={{
      title:'dmchat',
      headerLeft:()=>(
           <Icon name ='menu' color='white' size={25} style={{marginLeft:15}} onPress={()=>{navigation.openDrawer()}}/>
      )
  }}/>
  </Stack.Navigator>
  
  )
  }

function MyTabs() {
  const {darkMode,setDarkMode} = useContext(AppThemeContext);

  return (
    <Tab.Navigator
    initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#5cab7d',
        keyboardHidesTabBar: true,
   }}     
   labeled={false}
   barStyle={{ backgroundColor: darkMode.backgroundColor,elevation:5 }}
   
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <IconMC name="home-circle" color="#5cab7d" size={25} />
          ),
        }}
       />
        <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: () => (
            <Icon name="search" color="#5cab7d" size={25} />
          ),
        }}
       />

      <Tab.Screen 
        name="Message" 
        component={DmScreen}
        options={{
          tabBarIcon: () => (
            <IconMC name="send-circle" color="#5cab7d" size={26} />
          ),
        }}
      />

      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: () => (
            <Icon name="cog" color="#5cab7d" size={25} />
          ),
        }}
      />
     

    </Tab.Navigator>
  );
}


function CustomDrawerContent(props) {
  const {session,userDetails,setSession,setUserDetails} = useContext(MessageContext);
  // const {socket} = useContext(SocketContext);
  const {darkMode,setDarkMode,isEnabled, setIsEnabled} = useContext(AppThemeContext);
  const usr_img = `${userDetails[0].img}`
  // const [] = useState(false);
//   const toggleSwitch = () => setDarkMode({
//     backgroundColor:'white',
//     color:'black'
// });
  const toggleSwitch = async () => {
    if(!isEnabled){
      setIsEnabled(true)
      setDarkMode({backgroundColor:'#101820ff',color:'white',border:'#01452c'})
        try {
          const themeValue = JSON.stringify({backgroundColor:'#101820ff',color:'white',border:'#01452c',enabled:true})
          await AsyncStorage.setItem('@naij_theme_key', themeValue)
          console.log('dark theme saved')
        }catch (e) {
            console.log('error setting theme',e)
        }
    }else{
      setIsEnabled(false)
      setDarkMode({ backgroundColor:'white',color:'black',border:'lightgrey' });
        try {
          const themeValue = JSON.stringify({ backgroundColor:'white',color:'black',border:'lightgrey',enabled:false })
          await AsyncStorage.setItem('@naij_theme_key', themeValue)
          console.log('light theme saved')
        }catch (e) {
            console.log('error setting theme',e)
        }
    }
    // setDarkMode({ backgroundColor:'white',color:'black' });
    // setIsEnabled(previousState => !previousState ? setDarkMode({ backgroundColor:'white',color:'black' }) : setDarkMode({backgroundColor:'#101820ff',color:'white'}));
  }
  // isEnabled ? console.log('enabled') : console.log('disablee')
  // isEnabled ? setDarkMode({backgroundColor:'#101820ff',color:'white'}) : setDarkMode({ backgroundColor:'white',color:'black' });
  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
      <View style={styles.drawerContent}>
                <View style={styles.userInfoSection}>
                    <View style={{flexDirection:'row',marginTop:15}}>
                        <Avatar.Image 
                            source={{uri:usr_img}}
                            size={60}
                        />
                        <View style={{marginLeft:15,
                                flexDirection:'column'
                        }}>
                            <Title style={{...styles.title,color:darkMode.color}}>
                              {
                              userDetails[0].fullname.length >= 20 ? userDetails[0].fullname.substring(0,20)+'...' : userDetails[0].fullname
                              } {
                                userDetails[0].verified =='true' ? <IonIcon name="ios-checkmark-circle-outline" size={20} color='#5cab7d'/> : <></>
                                }
                            </Title>
                            <Caption style={{...styles.caption, color:'lightgrey'}}>{userDetails[0].email.length >= 20 ? userDetails[0].email.substring(0,20)+'...' : userDetails[0].email }</Caption>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View styles={styles.section}>
                            <Paragraph style={{...styles.paragraph,...styles.caption,color:darkMode.color}}> - </Paragraph>
                            <Caption style={{...styles.caption,color:darkMode.color}}>Followers</Caption>
                        </View>

                        <View style={styles.section,{marginLeft:30}}>
                            <Paragraph style={{...styles.paragraph,...styles.caption,color:darkMode.color}}> - </Paragraph>
                            <Caption style={{...styles.caption,color:darkMode.color}}>Following</Caption>
                        </View>
                        <View style={styles.section,{marginLeft:30}}>
                            <Paragraph style={styles.paragraph,styles.caption,{color:'green'}}>*coming soon</Paragraph>
                            {/* <Caption style={styles.caption}>Following</Caption> */}
                        </View>
                    </View>
                </View>
                <Text></Text>
                <DrawerItem 
                    icon ={()=>(
                        <Icon
                        name ='home'
                        color='grey'
                        size={18}           
                        />
                    )}
                    label = {()=>(
                      <Text style={{color:darkMode.color}}>home</Text>
                    )}
                    onPress={()=>props.navigation.navigate('Home')}
                />
                <DrawerItem 
                    icon ={()=>(
                        <Icon
                        name ='plus'
                        color='grey'
                        size={18}           
                        />
                    )}
                    label ={()=>(
                      <Text style={{color:darkMode.color}}>Create Topic</Text>
                    )}
                    onPress={()=>props.navigation.navigate('create_topic')}
                />
                <DrawerItem 
                    icon ={()=>(
                        <Icon
                        name ='comments'
                        color='grey'
                        size={18}           
                        />
                    )}
                    label = {()=>(
                      <Text style={{color:darkMode.color}}>Your Topics</Text>
                    )}
                    onPress={()=>console.log('topics')}
                />
                <DrawerItem 
                    icon ={()=>(
                      <IonIcon 
                        name="ios-checkmark-circle-outline" 
                        size={18} 
                        color='grey'/>
                    )}
                    label = {()=>(
                      <Text style={{color:darkMode.color}}>Get Verified</Text>
                    )}
                    onPress={()=>Alert.alert(':)','coming soon!')}
                />
                {/* <DrawerItem 
                    icon ={()=>(
                        <Icon
                        name ='cog'
                        color='grey'
                        size={18}           
                        />
                    )}
                    label = {()=>(
                      <Text style={{color:darkMode.color}}>Settings</Text>
                    )}
                    onPress={()=>props.navigation.navigate('settings')}
                /> */}
               
            </View>
            <View style={styles.preferences} >
            {/* <DrawerItem label="Settings and Help" onPress={() => alert('Link to help')} /> */}
            <DrawerItem label={()=>(
                      <Text style={{color:darkMode.color}}>About</Text>
                    )} onPress={() => Alert.alert('About naijchat (c)','A product of Pacavel')} 
            />
            <DrawerItem label={()=>(
                      <Text style={{color:darkMode.color}}>Policy</Text>
                    )} onPress={() => Alert.alert('Our Policy','lore ipsum, we dont give a shit :(, just kidding.')} 
            />
             <DrawerItem label={()=>(
                      <Text style={{color:darkMode.color}}>FAQ</Text>
                    )} onPress={() => Alert.alert('...opens our website','lore ipsum')} 
            />
             <DrawerItem 
                    // icon ={()=>(
                    //     <Icon
                    //     name ='sign-out'
                    //     color='grey'
                    //     size={18}           
                    //     />
                    // )}
                    label = {()=>(
                      <Text style={{color:'orange'}}>Clear session</Text>
                    )}
                    onPress={()=>{
                        const removeValue = async () => {
                          try {
                            const _null = JSON.stringify([])
                            await AsyncStorage.removeItem('@naij_login_key')
                          } catch(e) {
                            console.log('error removeing',e)
                          }
                          console.log('Overwrote to null.')
                          setSession(false)
                          BackHandler.exitApp();
                        }
                        removeValue()
                    }}
                />
            <DrawerItem
              icon ={()=>(
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor='#f4f3f4'
                    // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
                    )}
                    label = {()=>(
                      <Text style={{marginLeft:-30,color:darkMode.color}}>Theme</Text>
                    )}
            />
            
           
            </View>

    </DrawerContentScrollView>
  );
}

const IndexStack=()=>{

useEffect(() => {
  const getData = async () => {
    try {
      const loginValue = await AsyncStorage.getItem('@naij_login_key')
      const themeValue = await AsyncStorage.getItem('@naij_theme_key')
      const allKeys = await AsyncStorage.getAllKeys()
      console.log(allKeys)
      // const n = await AsyncStorage.getItem('@naij')
      console.log(loginValue,'this is the n')
      // console.log(loginValue,'gotten data')
      if(themeValue != null){
        const themeDetails = JSON.parse(themeValue)
        setDarkMode(themeDetails)
        setIsEnabled(themeDetails.enabled)

      }
      if(loginValue != null){
        const details = JSON.parse(loginValue)
        const res = await axios.post('http://192.168.43.223:3333/api/login',{email:details[0].email,password:details[0].password})
        // console.log(res.data)
        setSession(res.data.session)
        setUserDetails(res.data.details)
        // console.log(themeValue)
        setLoading(false)
        // socket.emit("SAVE_CLIENT_SOCKET_ID",{email:res.data,soc_id:socket.id})

      }else{
        setLoading(false)
        setSession(false)
        // setIsEnabled()
      }
      // return loginValue != null ? JSON.parse(loginValue) : null;
    } catch(e) {
        console.log(e)
        setLoading(false)
        ToastAndroid.showWithGravity(
          "An error occurred.",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
      );
    }
  }
  getData()
  return () => console.log('now rund')
},[])

   const {session, setSession,userDetails,setUserDetails} = useContext(MessageContext);
  //  const {socket} = useContext(SocketContext);
    const [loading, setLoading] = useState(true)
    const {darkMode,setDarkMode,isEnabled, setIsEnabled} = useContext(AppThemeContext);

  return(
    <NavigationContainer>
      {loading ? <View style={{...styles.container, ...styles.horizontal, backgroundColor:'#5cab7d'}}><ActivityIndicator size="large" color="white" /></View> : (
        <>
        {!session ? <LoginStackScreen userDetails={userDetails}  session={session} /> 
        : 
        (
            <Drawer.Navigator initialRouteName="Home"  hideStatusBar={false} drawerContent={props => <CustomDrawerContent {...props} />}
              drawerContentOptions={{
              activeTintColor: '#5cab7d',
              // hid the screen name here
              itemStyle: { marginVertical: 1,height:0},
            }}
            drawerStyle={{
              backgroundColor: darkMode.backgroundColor,
            }}
            >
            <Drawer.Screen name="Naijchat" component={HomeStackScreen}/>
            </Drawer.Navigator>
        )}
        </>
      )
    }
       
      </NavigationContainer>
  )
}




const App = () => {


  useEffect(() => {
      console.log(' mounted')

    return () => console.log('component has unmounted ------')
  }, [])
  // const userDetails = useContext(MessageContext);
  // console.log(session,'session mumu')


  // const [ session, setSession ] = useState(false)
  // const [ userDetails, setUserDetails ] = useState([])

  // console.log(userDetails,'from app js')

  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View style={{ height: 45, width: '80%',display:'flex',flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor: '#5cab7d', borderRadius:10 }}>
        <Text style={{justifyContent:'center',textAlign:'center',fontWeight:'bold', fontSize:15, color:'white',}}>{text1}</Text>
        <Text>{props.guid}</Text>
      </View>
    ),
    error: ({ text1, props, ...rest }) => (
      <View style={{ height: 45, width: '80%',display:'flex',flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor: '#ff6347', borderRadius:10  }}>
        <Text style={{justifyContent:'center',textAlign:'center',fontWeight:'bold', fontSize:15, color:'white',}}>{text1}</Text>
        {/* <Text>{props.guid}</Text> */}
      </View>
    ),
    info: () => {},
    any_custom_type: () => {}
  };

  return (
    <SocketProviderApi>
        <AppThemeProvider>
      <ContextApi>
      <IndexStack />
          <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </ContextApi>
        </AppThemeProvider>
      </SocketProviderApi>
  );
};


const styles = StyleSheet.create({
  drawerContent:{
      flex:1
  },
  userInfoSection:{
      paddingLeft:20,
  },
  title:{
      fontSize: 16,
      marginTop:3,
      fontWeight:'bold'
  },
  caption:{
      fontSize:14,
      lineHeight:14,
  },
  row:{
      marginTop:20,
      flexDirection:'row',
      alignItems:'center'
  },
  section:{
      flexDirection:'row',
      alignItems:'center',
      marginRight:15
  },
  paragraph:{
      fontWeight: 'bold',
      marginRight:3
  },
  drawerSection:{
      marginTop:3
  },
  bottomDrawerSection:{
      marginBottom:8,
      borderTopColor:'#f4f4f4',
      borderTopWidth: 0
  },
  preferences:{
      marginTop:60,
      borderTopWidth:.5,
      borderTopColor:'grey',
      justifyContent:'space-between',
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
})

export default App;