import React from 'react'
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    StatusBar,
    Button,
    Dimensions,
    ActivityIndicator
  } from 'react-native';
  import { createDrawerNavigator,  DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';


function CustomDrawerContent({props,session,setSession,userDetails}) {
    // console.log(userDetails[0].img+'.png')
    // console.log(userDetails,'user details')
    // const usr_img = `${userDetails[0].img+'.png'}`
    return (
      <DrawerContentScrollView {...props}>
        {/* <DrawerItemList {...props} /> */}
        <View style={styles.drawerContent}>
                  <View style={styles.userInfoSection}>
                      <View style={{flexDirection:'row',marginTop:15}}>
                          {/* <Avatar.Image 
                              source={{uri:usr_img}}
                              size={50}
                          /> */}
                          <View style={{marginLeft:15,
                                  flexDirection:'column'
                          }}>
                              {/* <Title style={styles.title}>{userDetails[0].fullname}</Title>
                              <Caption style={styles.caption}>{userDetails[0].email}</Caption> */}
                          </View>
                      </View>
                      <View style={styles.row}>
                          <View styles={styles.section}>
                              <Paragraph style={styles.paragraph,styles.caption}>0</Paragraph>
                              <Caption style={styles.caption}>Followers</Caption>
                          </View>
  
                          <View style={styles.section,{marginLeft:30}}>
                              <Paragraph style={styles.paragraph,styles.caption}>3</Paragraph>
                              <Caption style={styles.caption}>Following</Caption>
                          </View>
                          <View style={styles.section,{marginLeft:30}}>
                              <Paragraph style={styles.paragraph,styles.caption,{color:'green'}}>*New</Paragraph>
                              {/* <Caption style={styles.caption}>Following</Caption> */}
                          </View>
                      </View>
                  </View>
                  <Text></Text>
                  <DrawerItem 
                      icon ={()=>(
                          <Icon
                          name ='plus'
                          color='grey'
                          size={18}           
                          />
                      )}
                      label = 'Create Topic'
                      onPress={()=>console.log('topics')}
                  />
                  <DrawerItem 
                      icon ={()=>(
                          <Icon
                          name ='comments'
                          color='grey'
                          size={18}           
                          />
                      )}
                      label = 'Your Topics'
                      onPress={()=>console.log('topics')}
                  />
                  <DrawerItem 
                      icon ={()=>(
                          <Icon
                          name ='commenting-o'
                          color='grey'
                          size={18}           
                          />
                      )}
                      label = 'Messages'
                      onPress={()=>console.log('topics')}
                  />
                  <DrawerItem 
                      icon ={()=>(
                          <Icon
                          name ='cog'
                          color='grey'
                          size={18}           
                          />
                      )}
                      label = 'Settings'
                      onPress={()=>console.log('topics')}
                  />
                  <DrawerItem 
                      icon ={()=>(
                          <Icon
                          name ='sign-out'
                          color='grey'
                          size={18}           
                          />
                      )}
                      label = 'Sign Out'
                      onPress={()=>{
                          const removeValue = async () => {
                            try {
                              await AsyncStorage.removeItem('@naij_login_key')
                            } catch(e) {
                              console.log('error removeing')
                            }
                            console.log('Done.')
                            setSession(false)
                          }
                          removeValue()
                      }}
                  />
              </View>
              <View style={styles.preferences} >
              <DrawerItem label="Settings and Help" onPress={() => alert('Link to help')} />
              <DrawerItem label="About" onPress={() => alert('Link to help')} />
              <DrawerItem label="Policy" onPress={() => alert('Link to help')} />
              </View>
  
      </DrawerContentScrollView>
    );
  }
  
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

export default drawerContent
