import React, { useEffect, useState, useContext } from 'react'
import { View,Text,TextInput, TouchableOpacity, Alert,StyleSheet } from 'react-native'
import Header from '../header'
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
import IconMc from 'react-native-vector-icons/MaterialCommunityIcons';
import{launchCamera, launchImageLibrary} from 'react-native-image-picker'
import axios from 'axios'
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppThemeContext } from '../appThemeProvider'
// import AsyncStorage from '@react-native-async-storage/async-storage';



function Settings({navigation}) {
    const {session,setSession,userDetails,setUserDetails} = useContext(MessageContext);
    const {darkMode,setDarkMode} = useContext(AppThemeContext);
    const [ fullname, setFullname ] = useState(null) 
    const [ email, setEmail ] = useState(null)
    const [ image, setImage ]= useState(null)
    const [ tempImage,setTempImage ] = useState(null)
    const [ photoBase64, setPhotoBase64 ] = useState('')


    useEffect(()=>{
        setFullname(userDetails[0].fullname)
        setEmail(userDetails[0].email)
        setImage(userDetails[0].img)
    }, [])



    const handleChoosePhoto = () => {
        const options = {
          noData: true,
          includeBase64 : true
        }
        launchImageLibrary(options, async response => {
                if(response.uri){
                    if(response.fileSize > 1000000){
                        Alert.alert('Sorry','file size cannot exceed 500kb, try not to detroy our servers :)')
                        setTempImage(null)
                    }else{
                        // setTempImage(response)
                        setImage(response.uri)
                        await setPhotoBase64(response.base64)
                    }
                }
        })
    }

 

    const updateProfileImage = async ()=>{
        const res = await axios.post('http://192.168.43.223:3333/update-profile-image',
        {photoBase64,id:userDetails[0].id,creator_email:userDetails[0].email})
        
        console.log(res.data)

        const resForReload = await axios.get(`http://192.168.43.223:3333/api/login?email=${userDetails[0].email}`)
        setUserDetails(resForReload.data.details)
        if(res.data.success){
            Toast.show({
                type:'success',
                text1: res.data.msg,
            });
        }else{
            Toast.show({
                type:'error',
                text1: res.data.msg,
            });
        }
    }

    const updateProfile = async ()=>{
        const res = await axios.post('http://192.168.43.223:3333/update-profile',{id:userDetails[0].id,email,fullname})
        console.log(fullname)
        console.log(res.data)
        const resForReload = await axios.get(`http://192.168.43.223:3333/api/login?email=${userDetails[0].email}`)
        setUserDetails(resForReload.data.details)
        
       
        if(res.data.success){
            Toast.show({
                type:'success',
                text1: res.data.msg,
            });
        }else{
            Toast.show({
                type:'error',
                text1: res.data.msg,
            });
        }
    }


    return (
        <View style={{flex:1,backgroundColor:darkMode.backgroundColor}}>
        <Header navigation={navigation} title="Settings"/> 
                <View style={{display:'flex', alignSelf:'center'}}>
                <Text style={{textAlign:'center',fontWeight:'bold',margin:20,color:darkMode.color}}>Change Picture</Text>
                    <TouchableRipple onPress={()=>handleChoosePhoto()}>
                        <Avatar.Image 
                            source={{uri:image}}
                            size={100}
                        />
                    </TouchableRipple>

                    <Text style={{marginLeft:80}}><Icon name="pencil" size={20} color="#5cab7d" /></Text>
                    <TouchableOpacity onPress={()=>updateProfileImage()}  style={styles.changeImg}>
                        <Text style={{alignSelf:'center',fontSize:15,color:darkMode.color}}>Update Profile</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{textAlign:'center',fontWeight:'bold',marginTop:20,color:darkMode.color}}>Edit Details</Text>
            {/* <Text>{JSON.stringify(userDetails)}</Text> */}
            <TextInput 
                value={fullname} 
                onChangeText={e=>setFullname(e)}
                style={{...styles.textInput,color:darkMode.color}}
                place
            />
                <TouchableOpacity>
                    <Text 
                        style={{textAlign:'center',color:darkMode.color}} 
                        onPress={()=>Alert.alert('Updating email and password','Email and password can only be updated on the naijchat website for now. Thanks :)')}>
                        <IconMc name="information-variant" color="#5cab7d" size={30} />
                        info
                    </Text>
                </TouchableOpacity>
            {/* <TextInput 
                value={email} 
                onChangeText={e=>setEmail(e)}
                style={styles.textInput}
            /> */}

            <TouchableOpacity onPress={()=>updateProfile()}  style={styles.updateProfile}>
                <Text style={{alignSelf:'center',fontSize:15,color:darkMode.color}}>Update Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    textInput:{
        height: 60,
        margin:15, 
        borderWidth: 1,
        borderRadius:50,
        borderColor:'#5cab7d',
        paddingLeft:20
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

export default Settings
