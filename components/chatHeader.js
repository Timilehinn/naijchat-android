import React, { useContext } from 'react'
import { View,Text,Dimensions,Button,StyleSheet,Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMc from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppThemeContext } from './appThemeProvider'
import IconIcon from 'react-native-vector-icons/Ionicons';


function ChatHeader(props) {
    const {darkMode,setDarkMode} = useContext(AppThemeContext);
    const { navigation,title, chatmessages } = props
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    const goBack = <Icon name="keyboard-arrow-left" size={40} color="#5cab7d" onPress={()=>navigation.goBack()} />
    return (
        <View style={{dislay:'flex',
            paddingLeft:5,
            paddingRight:10,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            width:windowWidth,
            height:50,
            backgroundColor:darkMode.backgroundColor,
            borderBottomColor:darkMode.border,
            borderBottomWidth:.5,
            }}>
            {goBack}
        <Text style={{color:darkMode.color}}>{title.length > 45 ? title.substring(0,45)+'...' : title}</Text>
        <Text style={{}}>
          <IconMc 
           name="information-variant"
           size={30} 
           color="#5cab7d" 
           onPress={()=>Alert.alert('Policy','Every naijchat user is solely responsible for his or her messages and posts')} />
        </Text>
      </View>
    )
}
const styles = StyleSheet.create({

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
})
export default ChatHeader
