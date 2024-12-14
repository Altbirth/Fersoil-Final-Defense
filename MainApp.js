import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export default function DashboardScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageSelection = async (type) => {
        let result;
        if (type === "gallery") {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setPrediction(""); 
        }
    };

    const saveToHistory = async (image, prediction) => {
        try {
            const storedHistory = await AsyncStorage.getItem("history");
            const history = storedHistory ? JSON.parse(storedHistory) : [];
    
            history.push({ image, prediction });
            console.log("Updated history to save:", history); 
    
            await AsyncStorage.setItem("history", JSON.stringify(history));
            console.log("History saved successfully");
        } catch (error) {
            console.error("Error saving history:", error);
        }
    };
    
    
    const predictFertility = async () => {
        if (!image) return;

        const fileType = image.split(".").pop();

        const formData = new FormData();
        formData.append("image", {
            uri: image,
            name: `soil.${fileType}`,
            type: `image/${fileType}`,
        });

        setLoading(true);
        try {
            const response = await axios.post(
                "http://192.168.12.160:5000/predict",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            const result = response.data.prediction || "Unknown result";
            setPrediction(result);
            await saveToHistory(image, result); 
        } catch (error) {
            console.error(error);
            setPrediction("Error processing the image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>FerSoil Predictor</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.galleryButton}
                    onPress={() => handleImageSelection("gallery")}
                >
                    <Text style={styles.buttonText}>Select Photo from Gallery</Text>
                </TouchableOpacity>
                <Text style={styles.orText}>or</Text>
                <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={() => handleImageSelection("camera")}
                >
                    <Text style={styles.buttonText}>Take a Photo</Text>
                </TouchableOpacity>
            </View>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TouchableOpacity
                style={styles.predictButton}
                onPress={predictFertility}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Predict Fertility</Text>
                )}
            </TouchableOpacity>
            {prediction ? (
                <Text style={styles.result}>The Predicted Soil Fertility is: {prediction}</Text>
            ) : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#E8F5E9",
    },
    menuText: {
        fontSize: 28,
        color: "#4CAF50",
        fontWeight: "bold",
    },
    header: {
        alignItems: "center",
        marginTop: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 40,
        alignItems: "center",
    },
    galleryButton: {
        backgroundColor: "#1e3dd6",
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        width: 250,
        alignItems: "center",
        borderColor: "#4CAF50",
        borderWidth: 1,
    },
    cameraButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        width: 250,
        alignItems: "center",
    },
    orText: {
        fontSize: 16,
        color: "#555",
        marginVertical: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#ddd",
        alignSelf: "center",
    },
    predictButton: {
        backgroundColor: "#FF5722",
        padding: 15,
        borderRadius: 10,
        marginVertical: 20,
        width: 250,
        alignSelf: "center",
        alignItems: "center",
    },
    result: {
        fontSize: 18,
        marginTop: 10,
        color: "blue",
        textAlign: "center",
    },
});
