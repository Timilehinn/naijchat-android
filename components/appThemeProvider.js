import React,{createContext,useState,useEffect} from 'react'


export const AppThemeContext = createContext()



function AppThemeProvider(props) {
   
    //should be isDarkMode cause it renders on white .... 
    const [ darkMode, setDarkMode ] = useState({
        backgroundColor:'white',
        color:'black',
        border:'lightgrey'
    })
  const [isEnabled, setIsEnabled] = useState(false);

    const themeProviderValues = {darkMode,setDarkMode,isEnabled,setIsEnabled}

    return (
        <AppThemeContext.Provider value={themeProviderValues} >
            {props.children}
        </AppThemeContext.Provider>
    )
}

export default AppThemeProvider
