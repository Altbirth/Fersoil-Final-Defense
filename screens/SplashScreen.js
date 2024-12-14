import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        // Automatically navigate to MainApp after 5 seconds
        const timer = setTimeout(() => {
            navigation.replace("MainApp");
        }, 5000);

    
        return () => clearTimeout(timer);
    }, []);

    return (
        <ImageBackground
            source={require("../assets/background.jpg")}
            style={styles.container}
        >
            <Text style={styles.logo}>FerSoil</Text>
            <Text style={styles.tagline}>Predict Your Soil's Potential.</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.replace("MainApp");
                }}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 20,
    },
    tagline: {
        fontSize: 16,
        color: "#ffffff",
        marginBottom: 40,
        textAlign: "center",
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
