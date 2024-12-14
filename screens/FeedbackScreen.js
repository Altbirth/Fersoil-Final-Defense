import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";

export default function FeedbackScreen() {
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(0);

    const handleRatingPress = (value) => {
        setRating(value);
    };

    const handleSubmit = () => {
        if (!feedback || rating === 0) {
            Alert.alert("Incomplete Feedback", "Please provide a rating and feedback.");
            return;
        }
        Alert.alert("Thank You!", "Your feedback has been submitted.");
        setFeedback("");
        setRating(0);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>We Value Your Feedback</Text>

            {/* Star Rating */}
            <Text style={styles.ratingText}>Rate your experience:</Text>
            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => handleRatingPress(star)}
                        style={styles.star}
                    >
                        <Text style={{ fontSize: 30, color: star <= rating ? "#FFD700" : "#CCC" }}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Feedback Input */}
            <Text style={styles.inputLabel}>Your Feedback:</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Write your feedback here..."
                value={feedback}
                onChangeText={setFeedback}
                multiline
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F4F4",
        padding: 20,
        justifyContent: "center",
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4CAF50",
        textAlign: "center",
        marginBottom: 15,
    },
    ratingText: {
        fontSize: 18,
        color: "#555",
        marginBottom: 10,
        textAlign: "center",
    },
    ratingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    star: {
        marginHorizontal: 5,
    },
    inputLabel: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    textInput: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        height: 100,
        textAlignVertical: "top",
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
