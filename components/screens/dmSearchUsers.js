import React, { useEffect, useState, useContext } from 'react'
import { View,Text,TextInput, TouchableOpacity, Alert,StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
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


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
function DmSearchUsers({navigation}) {

    const {session,setSession,userDetails,setUserDetails} = useContext(MessageContext);
    const {darkMode,setDarkMode} = useContext(AppThemeContext);
    const usr_img = `${userDetails[0].img}` 
    // const { navigation } = props
   
    const [ searchValue, setSearchValue ] = useState('')
    const [ foundValue, setFoundValue ] = useState('')
    const [ allUsers, setAllUsers ] = useState([])
    const [loading, setLoading ] = useState(true)
    // const foundTopics = allTopics.find(searchValue=>searchValue == allTopics.title)

    useEffect(()=>{
        async function getAllUsers() {
            const res = await axios.get(`http://192.168.43.223:3333/dm-search-users?curr_user=${userDetails[0].email}`)
            setAllUsers(res.data)
            setLoading(false)
        }
        getAllUsers();
    }, [])

    // const funcFindTopic= async (e)=>{
        // setSearchValue(e)
        // if(searchValue === 'timi'){
        //     console.log('found')
        // }
       
        const found = allUsers.filter(user => {
            return user.fullname.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
        })
        // setFoundValue(found)
        // console.log(JSON.stringify(found).substring(0,200))
    // }
    return (
        <View style={{flex:1,backgroundColor:darkMode.backgroundColor}}>
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
            elevation:.5}}>
                <Text onPress={()=>navigation.openDrawer()}>
                    <Avatar.Image 
                    source={{uri:usr_img}}
                    size={30}
                />
                </Text>
                <TextInput style={{
                    borderWidth:1,
                    borderColor:darkMode.border,
                    height:32,
                    width:190,
                    borderRadius:15,
                    color:darkMode.color,
                    paddingLeft:10
                }} 
                    placeholder="search users"
                    placeholderTextColor="grey"
                    value={searchValue}
                    onChangeText={e=>setSearchValue(e)}
                    maxLength={50}
                />
                <TouchableOpacity onPress={()=>Alert.alert('Filter',"This will filter search for either users or topics.")}>
                    <Icon  name="sliders" color="#5cab7d" size={20} />
                </TouchableOpacity>
            </View> 
            {loading ? <View style={{...styles.container, ...styles.horizontal, backgroundColor:darkMode.backgroundColor}}><ActivityIndicator size="small" color="white" /></View> : <></>}
            <ScrollView>
            {found.map(val=>(
                <TouchableOpacity key={val.id} onPress={()=>navigation.navigate('profile',{user:val.email})}>
                    <View style={{display:'flex',alignItem:'center',padding:18,backgroundColor:darkMode.backgroundColor,borderBottomWidth:.5,borderColor:darkMode.border}}>
                        <Text style={{color:'grey',textAlign:'center'}}>User @{val.fullname} {val.verified == 'true' ? <IonIcon name="ios-checkmark-circle-outline" size={15} color='#5cab7d'/> : <></>}</Text>
                        <Text style={{textAlign:'center',fontSize:17,color:darkMode.color,}}></Text>
                    </View>
                </TouchableOpacity>
            ))}
            {loading ? <></> : 
                <>
                    {found.length <= 0 ? (
                        <View style={{padding:18,backgroundColor:darkMode.backgroundColor}}>
                                 <Text  style={{textAlign:'center'}}>
                                    <IconMC name="emoticon-sad" color='grey'  size={60} />
                                </Text>
                                <Text style={{textAlign:'center',fontSize:17,color:'grey',fontWeight:'bold'}}> 
                                    No Result for <Text style={{color:darkMode.color,fontStyle:'italic'}}>
                                    '{searchValue.length > 40 ? searchValue.substring(0,40)+'...' : searchValue}'
                                    </Text>
                                </Text>
                                <Text style={{textAlign:'center',marginTop:10,fontSize:13,color:'grey',}}>Your search did not bring up any result.</Text>
                                <Text style={{textAlign:'center',fontSize:13,color:'grey',}}>The keyword you entered might be incorrect or the topic you are searching for might have been deleted or edited.</Text>
                            </View>
                    ): <></>}
                </>
            }
           
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

export default DmSearchUsers
