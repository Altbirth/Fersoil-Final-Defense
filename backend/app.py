from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import models
from PIL import Image

app = Flask(__name__)
CORS(app)  # allow frontend-backend communication

# Load the DenseNet model with pretrained weights
from torch import nn
model = models.densenet201(weights=models.DenseNet201_Weights.DEFAULT)

# Modify the classifier for 3 categories: low, medium, high
num_features = model.classifier.in_features
model.classifier = nn.Linear(num_features, 3)  

# Load your trained weights
state_dict = torch.load('densenet1.pth', map_location=torch.device('cpu'))
model.load_state_dict(state_dict, strict=False)
model.eval()  

# Use the pretrained model's default transforms for input preprocessing
weights = models.DenseNet201_Weights.DEFAULT
auto_transforms = weights.transforms()

def preprocess_image(image):
    """
    Preprocess the input image using transforms from the pretrained model.
    """
    return auto_transforms(image).unsqueeze(0)  

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict soil fertility based on the input image.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    try:
        # Load and preprocess the image
        image = Image.open(file.stream).convert('RGB')
        input_tensor = preprocess_image(image)

        # Perform prediction
        with torch.no_grad():
            outputs = model(input_tensor)

        # Debugging output
        print(f"Output shape: {outputs.shape}")
        print(f"Model raw outputs: {outputs}")

        # Map predictions to categories
        _, predicted = torch.max(outputs, 1)
        categories = ['low', 'medium', 'high']
        result = categories[predicted.item()]

        return jsonify({'prediction': result})
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
