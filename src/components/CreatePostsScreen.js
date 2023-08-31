import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { MaterialIcons, SimpleLineIcons, Feather } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { db, storage } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useSelector } from "react-redux";

const CreatePostsScreen = () => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [coordinats, setCoordinats] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");
  const navigation = useNavigation();
  const { userId, nickName } = useSelector((state) => state.auth);

  resetForm = () => {
    setPhotoName("");
    setCoordinats(null);
    setPhotoLocation("");
    setPhoto(null);
  };

  const getGeoLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCoordinats(coords);
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
      getGeoLocation();
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      await MediaLibrary.createAssetAsync(photo.uri);

      setPhoto(photo.uri);
    }
  };

  const sendPhoto = () => {
    uploadPostToServer();
    navigation.navigate("PostsScreen");
    setPhotoName(""), setPhotoLocation(""), setPhoto(null);
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const uniquePostId = Date.now().toString();

    const storageImage = await ref(storage, `postImage/${uniquePostId}`);
    console.log("storageImage :>> ", storageImage);

    await uploadBytes(storageImage, file);
    const addedPhoto = await getDownloadURL(storageImage);
    return addedPhoto;
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    const createPost = {
      photo,
      photoName,
      photoLocation,
      coordinats,
      userId,
      nickName,
    };
    uploadPostToDatabase(createPost);
  };

  const uploadPostToDatabase = async (post) => {
    await addDoc(collection(db, "post"), post);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              ...styles.formContainer,
              marginBottom: isShowKeyboard ? 50 : 50,
            }}
          >
            <View style={styles.addPhotoContainer}>
              <Camera style={styles.camera} type={type} ref={setCameraRef}>
                <View style={styles.addPhotoIcon}>
                  <TouchableOpacity onPress={takePhoto}>
                    <MaterialIcons
                      name="photo-camera"
                      size={24}
                      color="#BDBDBD"
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.flipBtn}
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                >
                  <MaterialIcons
                    name="flip-camera-ios"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </Camera>
            </View>
            <Text style={styles.addPhotoText}>Завантажте фото</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Назва..."
                value={photoName}
                onChangeText={setPhotoName}
                onFocus={() => setIsShowKeyboard(true)}
              />
              <View style={styles.locationContainre}>
                <SimpleLineIcons
                  style={styles.locationIcon}
                  name="location-pin"
                  size={24}
                  color="#BDBDBD"
                />
                <TextInput
                  style={[styles.input, styles.inputPad]}
                  placeholder="Місцевість..."
                  value={photoLocation}
                  onChangeText={setPhotoLocation}
                  onFocus={() => setIsShowKeyboard(true)}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={sendPhoto}>
              <Text style={styles.buttonText}>Опубліковати</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.binBtnContainer}>
            <TouchableOpacity style={styles.binBtn} onPress={resetForm}>
              <Feather name="trash-2" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },

  addPhotoContainer: {
    backgroundColor: "#E8E8E8",
    width: "90%",
    height: 240,
    borderRadius: 8,
  },
  camera: { flex: 1 },
  flipBtn: {
    top: 10,
    left: 10,
  },
  addPhotoIcon: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "40%",
    left: "40%",
  },
  addPhotoText: {
    color: "#BDBDBD",
    marginTop: 8,
    alignItems: "flex-start",
    marginRight: " 50%",
  },
  inputContainer: {
    marginTop: 24,
    width: "90%",
  },
  input: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    width: "90%",
    height: 50,

    borderBottomWidth: 1,
    padding: 10,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFF",
    marginLeft: "auto",
    marginRight: "auto",
  },
  inputPad: {
    paddingLeft: 20,
  },
  locationIcon: {
    top: 35,
    left: 10,
    zIndex: 1,
  },
  button: {
    width: "90%",
    height: 51,
    borderRadius: 24,
    backgroundColor: "#FF6C00",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 32,
    padding: 15,
  },
  buttonText: {
    color: "#fff",
  },
  binBtnContainer: {
    alignItems: "center",
  },
  binBtn: {
    width: 70,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CreatePostsScreen;
