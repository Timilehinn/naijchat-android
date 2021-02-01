import React,{ useContext } from 'react'
import { View,Text,Dimensions,Button,Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import {MessageContext} from './contextApi.js'
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    TouchableRipple,
    Switch
}from 'react-native-paper';
import { AppThemeContext } from './appThemeProvider'



function Header(props) {
    const {session,setSession,userDetails,setUserDetails} = useContext(MessageContext);
    const {darkMode,setDarkMode} = useContext(AppThemeContext);

    const usr_img = `${userDetails[0].img}` 

    const { navigation,title } = props
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    // const myIcon = 
    const goBack = <Icon name="user-circle-o" size={25} color="#5cab7d" onPress={()=>console.log('ssg')} />
    return (
        <View style={{
            dislay:'flex',
            paddingLeft:20,
            paddingRight:20,
            alignItems:'center',
            // justifyContent:'center',
            justifyContent:'space-between',
            flexDirection:'row',
            borderBottomColor:darkMode.border,
            borderBottomWidth:.5,
            width:windowWidth,
            height:50,
            backgroundColor:darkMode.backgroundColor,
            }}>
                <Text onPress={()=>navigation.openDrawer()}>
                    <Avatar.Image 
                    source={{uri:usr_img}}
                    size={30}
                />
                </Text>
                <Text style={{fontWeight:'bold',color:darkMode.color}}>{title}</Text>
      </View>
    )
}

export default Header
