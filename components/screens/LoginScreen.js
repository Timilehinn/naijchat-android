import React,{ useState,useContext } from 'react'
import { View,Text,TextInput,TouchableOpacity, Dimensions,Button,StyleSheet,Alert,ToastAndroid, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMc from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MessageContext} from '../contextApi.js'
import Toast from 'react-native-toast-message';
import * as Animatable from 'react-native-animatable' 
import {SocketContext} from '../socketProvider.js'


function LoginScreen({navigation,route}) {
    // const { session,setSession, userDetails} = route.params.props
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {session,setSession,setUserDetails} = useContext(MessageContext);
    const [ loading,setLoading ] = useState(false)
    const {socket} = useContext(SocketContext);

    console.log(socket.id)
    // console.log(userDetails,'use details here')

    async function validateUser(){
        setLoading(true)
        try{
            const res = await axios.post('http://192.168.43.223:3333/api/login',{email,password})
            setUserDetails(res.data.details)

                setSession(res.data.session)
                if(!res.data.session){
                    Toast.show({
                        type:'error',
                        text1: res.data.auth_msg,
                    });
                    setLoading(false)
                }else{
                    try {
                        const loginValue = JSON.stringify(res.data.details)
                        await AsyncStorage.setItem('@naij_login_key', loginValue)
                        console.log(socket.id, 'login')
                        console.log('data saved')
                        socket.emit("SAVE_CLIENT_SOCKET_ID",{email:res.data,soc_id:socket.id})

                    }catch (e) {
                        console.log('error setting value',e)
                    }
                }
        }catch(e){
            setLoading(false)
            ToastAndroid.showWithGravity(
                "Network Error",
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );
        }
        
        
        
        // console.log(res.data.details)
       

        //   console.log(userDetails,'[[[[[')
        //   console.log(session)


    }

    return (
        <View style={styles.container}>
                {loading ? 
                    <View style={[styles.containerIndicator, styles.horizontal]}><ActivityIndicator size="large" color="white" /></View>
                    :
                    <View></View>
                }
            <View style={styles.header}>
                <Text style={styles.headerText}>naijchat</Text>
                <Text style={styles.headerText_2}>Sign In to continue.</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                duration={800}
                style={styles.inputBody}>
                <View style={{marginTop:50}}>
                    <TextInput 
                        style={styles.textInput}
                        autoCorrect={false}
                        placeholder="email"
                        onChangeText={e=>setEmail(e)}
                    />
                    <TextInput 
                        style={styles.textInput}
                        autoCorrect={false}
                        placeholder="password"
                        secureTextEntry={true}
                        onChangeText={e=>setPassword(e)}
                    />
                    <TouchableOpacity onPress={()=>validateUser()}  style={styles.loginBtn}>
                    {/* <TouchableOpacity onPress={()=>setSession(true)}  style={styles.loginBtn}> */}
                        <Text style={{alignSelf:'center',fontSize:20,color:'white'}}>login</Text>
                    </TouchableOpacity>
                    <Text onPress={()=> navigation.navigate('Register')} style={{alignSelf:'center'}}>No account? SignUp</Text>
                </View>
            </Animatable.View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#5cab7d'
    },
    containerIndicator: {
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    header:{
        flex:1,
        alignSelf:'center',
        justifyContent:'center'
    },
    headerText:{
        color:'white',
        fontSize:50,
        fontWeight:'bold'
    },
    headerText_2:{
        color:'white',
        fontSize:15,
        alignSelf:'center'
    },
    inputBody:{
        flex:2,
        backgroundColor:'white',
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
    },
    textInput:{
        height: 60,
        margin:15, 
        borderWidth: 1,
        borderRadius:50,
        borderColor:'#5cab7d',
        paddingLeft:20
        // marginTop:30
    },
    loginBtn:{
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

export default LoginScreen
