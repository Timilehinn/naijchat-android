import React, { useEffect, useState, useContext } from 'react'
import {ToastAndroid, View,Text,TextInput,TouchableOpacity, Dimensions,Button,StyleSheet,Alert, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMc from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import * as Animatable from 'react-native-animatable'
import axios from 'axios'
import {MessageContext} from '../contextApi.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SocketContext} from '../socketProvider.js'


function RegsiterScreen({ navigation }) {


    const [ email, setEmail ] = useState('')
    const [ name, setName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const {session,setSession,setUserDetails} = useContext(MessageContext);
    const {socket} = useContext(SocketContext);


    const registerUser=async()=>{
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(email.toLowerCase())){
            console.log('matcg')
            setLoading(true)
            console.log(name)
            const registerRes = await axios.post(`http://192.168.43.223:3333/register`,{email,name,password})
            console.log(registerRes.data)
            if(registerRes.data.success){
                // setLoading(false)
                ToastAndroid.showWithGravity(
                    "Registration Complete",
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER
                );
                // navigation.navigate('Login')
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
                
            }else{
                setLoading(false)
                Toast.show({
                    type:'error',
                    text1: registerRes.data.msg,
                });
            }
        }else{
            ToastAndroid.showWithGravity(
                "Email or password not accepted!",
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );
        }
        
    }

    return (
        <View style={styles.container}>
                            {loading ? <View style={[styles.containerIndicator, styles.horizontal]}><ActivityIndicator size="large" color="white" /></View>
                            :
                            <View></View>}
            <View style={styles.header}>
                <Text style={{alignSelf:'center'}}><Icon name="user-circle" size={70} color="white" /></Text>
                <Text style={styles.headerText}>Sign Up</Text>
                {/* <Text style={styles.headerText_2}>Sign Up</Text> */}
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
                        value={email}
                    />
                    <TextInput 
                        style={styles.textInput}
                        autoCorrect={false}
                        placeholder="name (display name)"
                        onChangeText={e=>setName(e)}
                        value={name}
                    />
                    <TextInput 
                        style={styles.textInput}
                        autoCorrect={false}
                        placeholder="password"
                        secureTextEntry={true}
                        onChangeText={e=>setPassword(e)}
                        value={password}
                        minLength={7}
                    />
                    <TouchableOpacity style={styles.loginBtn} onPress={()=>registerUser()}>
                        <Text style={{alignSelf:'center',fontSize:20,color:'white'}}>SignUp</Text>
                    </TouchableOpacity>
                    <Text onPress={()=>navigation.navigate('Login')} style={{alignSelf:'center'}}>Sign In here.</Text>
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
        // flex: 1,
        // justifyContent: "center"
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
        marginTop:20,
        fontSize:30,
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
        borderRadius:30,
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

export default RegsiterScreen
// validate = (text) => {
//     console.log(text);
//     let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     if (reg.test(text) === false) {
//       console.log("Email is Not Correct");
//       this.setState({ email: text })
//       return false;
//     }
//     else {
//       this.setState({ email: text })
//       console.log("Email is Correct");
//     }
//   }

{/* <TextInput
  placeholder="Email ID"
  onChangeText={(text) => this.validate(text)}
  value={this.state.email}
/> */}