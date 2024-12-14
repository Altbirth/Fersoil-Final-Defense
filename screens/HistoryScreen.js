import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoryScreen() {
    const [history, setHistory] = useState([]);

    // Fetch history from AsyncStorage
    const fetchHistory = async () => {
        try {
            const storedHistory = await AsyncStorage.getItem("history");
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory);
                console.log("Fetched history:", parsedHistory);
                setHistory(parsedHistory.reverse()); 
            } else {
                console.log("No history found");
                setHistory([]); 
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    // Clear history from AsyncStorage
    const clearHistory = async () => {
        try {
            Alert.alert(
                "Clear History",
                "Are you sure you want to clear all history?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Yes",
                        onPress: async () => {
                            await AsyncStorage.removeItem("history");
                            setHistory([]);
                            console.log("History cleared");
                        },
                    },
                ],
                { cancelable: true }
            );
        } catch (error) {
            console.error("Error clearing history:", error);
        }
    };

    // Fetch history when the component mounts
    useEffect(() => {
        fetchHistory();
    }, []);

    // Render each history item
    const renderItem = ({ item }) => (
        <View style={styles.historyItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.prediction}>Prediction: {item.prediction}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>History</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.refreshButton} onPress={fetchHistory}>
                    <Text style={styles.buttonText}>Refresh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
                    <Text style={styles.buttonText}>Clear History</Text>
                </TouchableOpacity>
            </View>

            {/* History List */}
            {history.length > 0 ? (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Text style={styles.noHistory}>No history available.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F4F4",
        padding: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#4CAF50",
        marginBottom: 20,
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    refreshButton: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: "center",
        marginRight: 10,
    },
    clearButton: {
        backgroundColor: "#F44336",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: "center",
        marginLeft: 10,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#FFF",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    prediction: {
        fontSize: 16,
        color: "#555",
    },
    noHistory: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 50,
    },
});
