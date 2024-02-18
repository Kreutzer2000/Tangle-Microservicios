import face_recognition
import numpy as np
from flask import Flask, jsonify, request

app = Flask(__name__)

# Este es un ejemplo simplificado. En producción, querrás almacenar estos de manera más segura y probablemente en una base de datos.
known_face_encodings = []
known_face_names = []

@app.route('/register', methods=['POST'])
def register():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file:
        # Cargar la imagen y aprender a reconocerla.
        image = face_recognition.load_image_file(file)
        face_encoding = face_recognition.face_encodings(image)[0]
        
        # Aquí podrías agregar una lógica para asociar un nombre de usuario o ID de usuario con la codificación facial
        known_face_encodings.append(face_encoding)
        known_face_names.append("User Name")  # Ejemplo, deberías usar un identificador único por usuario.
        
        return jsonify({'message': 'User registered successfully'}), 201

@app.route('/verify', methods=['POST'])
def verify():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file:
        unknown_image = face_recognition.load_image_file(file)
        unknown_face_encoding = face_recognition.face_encodings(unknown_image)[0]
        
        # Ver si el rostro es conocido
        results = face_recognition.compare_faces(known_face_encodings, unknown_face_encoding)
        
        if True in results:
            first_match_index = results.index(True)
            name = known_face_names[first_match_index]
            return jsonify({'message': 'User verified', 'user': name}), 200
        else:
            return jsonify({'message': 'User not recognized'}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)
