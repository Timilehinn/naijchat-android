import React, {useState,useContext} from 'react'
import { View, Text, Dimensions, StyleSheet, Image, TouchableHighlight, TouchableWithoutFeedback, Button, Alert, TextInput } from 'react-native'
import{launchCamera, launchImageLibrary} from 'react-native-image-picker'
import { set } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../header'
import axios from 'axios'
import  {MessageContext} from '../contextApi'
import { AppThemeContext } from '../appThemeProvider'



import Toast from 'react-native-toast-message';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default function CreateTopicScreen({navigation}){
    
 
  const [ photo, setPhoto ] = useState(null)
  const [ title, setTitle ] = useState('')
  const [ post, setPost ] = useState('')
  const [ isUploaded, setIsUploaded ] = useState([])
  const [ photoBase64, setPhotoBase64 ] = useState('')
  const {session,setSession,userDetails,setUserDetails} = useContext(MessageContext);
  const {darkMode,setDarkMode} = useContext(AppThemeContext);



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

//     const handleOpenCamera = () => {
//         const options = {
//           noData: true,
//         }
//         launchCamera(options, response => {
//             console.log(reponse)
//                 // if(response.uri){
//                 //     if(response.fileSize > 500000){
//                         // Alert.alert('Sorry','file size cannot exceed 500kb, try not to detroy our servers :)')
//                         // setPhoto(null)
//                 //     }else{
//                 //     // async function createBase64Url(){
//                 //     //     const base64URL = await photo.base64
//                 //     //     setPhotoBase64(base64URL)
//                 //     // }
//                 //     // createBase64Url()
//                         // setPhoto(response)
//                 //     }
//                 // }
//                 // console.log(response)
//         })
    

//   }

    const publishPost= async ()=>{
        if(title && post ){
            // console.log(title)
            // console.log(post)
            // console.log(photoBase64)
            const res = await axios.post('http://192.168.43.223:3333/create-topic',{
                title,post,photoBase64,creator:userDetails[0].fullname,creator_img:userDetails[0].img,verified:userDetails[0].verified,
                creator_email:userDetails[0].email
            })
            console.log(res.data)
            setIsUploaded(res.data)
                if(res.data.success){
                    Toast.show({
                        type:'success',
                        text1: res.data.msg,
                    });
                    setPhoto(null)
                    setTitle('')
                    setPost('')
                }else{
                    Toast.show({
                        type:'error',
                        text1: res.data.msg,
                    });
                }
            }
            
    }

    return (
      <View style={{ flex: 1, alignItems: 'center',backgroundColor:darkMode.backgroundColor }}>
      <Header navigation={navigation} title="Create Topic" />
        <View style={{margin:30}}>
        {/* {!isUploaded.success ? (
            <Text style={{color:'red'}}>{isUploaded.msg}</Text>
        ):(
            <Text style={{color:'green'}}>{isUploaded.msg}</Text>
        )} */}
        {/* //reduce topic length  */}
            <TextInput 
                style={{...styles.title_input,color:darkMode.color}}
                placeholder="an intresting title ..."
                onChangeText={e=>setTitle(e)}
                maxLength={50}
                value={title}
                placeholderTextColor="grey"
            />
             <TextInput 
                style={{...styles.post_input,color:darkMode.color}}
                multiline={true}
                numberOfLines={4} 
                placeholder="post"
                maxLength={280}
                onChangeText={e=>setPost(e)}
                value={post}
                placeholderTextColor="grey"
            />
        </View>
        {photo && (
        <>
          <View style={{marginLeft:100}}>
            <TouchableWithoutFeedback onPress={()=>setPhoto(null)} >
                <Icon name="close" size={20} />
            </TouchableWithoutFeedback>
          </View>
          <Image
            source={{ uri: photo.uri }}
            style={{  borderRadius:30,width:120, height: 120 }}
          />
        </>
        )}
        {/* <Button title="Choose Photo" /> */}
        <TouchableWithoutFeedback style={styles.choose_img_btn} onPress={()=>handleChoosePhoto()}>
            <Text style={{textAlign:'center',color:'grey',fontSize:13}}>
                Tap to choose an image.
            </Text>
        </TouchableWithoutFeedback>
        <TouchableHighlight style={styles.publish_btn} onPress={()=>publishPost()}>
            <Text style={{textAlign:'center',color:'white',fontSize:15}}>
                publish
            </Text>
        </TouchableHighlight>
        
      </View>
    )
  }

  const styles = StyleSheet.create({
    title_input:{
        borderBottomWidth:1,
        marginTop:10,
        borderColor:'#5cab7d',
        width:windowWidth-30,
        paddingLeft:15,
        borderRadius:30
    },
    post_input:{
        borderBottomWidth:1,
        marginTop:10,
        borderColor:'#5cab7d',
        width:windowWidth-30,
        paddingLeft:15,
        borderRadius:30,
        maxHeight:300
    },
    choose_img_btn:{
        backgroundColor:'grey',
        marginTop:20,
        padding:20,
        width:windowWidth-30,
    },
    publish_btn:{
        borderWidth: 6,
        marginTop:20,
        backgroundColor:'#5cab7d',
        borderRadius:50,
        padding:15,
        borderColor:'#228b29',
        width:windowWidth-50,
    }
  })