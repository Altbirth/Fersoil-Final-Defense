import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

// Import Screens
import SplashScreen from "./screens/SplashScreen";
import DashboardScreen from "./MainApp";
import HistoryScreen from "./screens/HistoryScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import DocumentationScreen from "./screens/DocumentationScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content
function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.logoContainer}>
                <Image source={require("./assets/fersoil.png")} style={styles.logo} />
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

// Drawer Navigator (For the side menu)
function DrawerNavigator() {
    return (
        <Drawer.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                headerStyle: { backgroundColor: "#4CAF50" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />} // Use custom drawer content
        >
            <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ title: "FerSoil" }} />
            <Drawer.Screen name="History" component={HistoryScreen} />
            <Drawer.Screen name="Feedback" component={FeedbackScreen} />
            <Drawer.Screen name="Documentation" component={DocumentationScreen} />
        </Drawer.Navigator>
    );
}

// Main App (Stack Navigator for Splash Screen and Drawer)
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="MainApp" component={DrawerNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Styles
const styles = StyleSheet.create({
    logoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 150, // Adjust the size as needed
        height: 50,  // Adjust the size as needed
        resizeMode: "contain",
    },
});
