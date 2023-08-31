import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";

import {
  MaterialIcons,
  SimpleLineIcons,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import ImageBG from "../../assets/images/ImageBG.png";
import avatar from "../../assets/images/avatar.png";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native-gesture-handler";
import { logOut } from "../../redux/auth/authOperations";

import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const { userId, nickName } = useSelector((state) => state.auth);

  useEffect(() => {
    const getUserPost = async () => {
      const postsRef = collection(db, "post");
      const queryRef = query(postsRef, where("userId", "==", userId));

      const unsubscribe = onSnapshot(queryRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(data);
      });

      return () => unsubscribe();
    };

    getUserPost();
  }, [userId]);

  const singOut = () => {
    dispatch(logOut());
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={ImageBG} style={styles.image}>
        <View style={styles.formContainer}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={singOut}
            onPressOut={() => navigation.navigate("LoginScreen")}
          >
            <MaterialIcons name="logout" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarLogo}>
              <Image style={styles.avatar} source={avatar} />
            </View>
            <TouchableOpacity style={styles.closeBtn}>
              <AntDesign name="closecircleo" size={25} color="#E8E8E8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{nickName}</Text>

          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.contentContainer}>
                <View>
                  <Image
                    style={styles.contentImage}
                    source={{ uri: item.photo }}
                  />
                  <Text style={styles.contentTitle}>{item.photoName}</Text>
                  <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackContainerLeftEl}>
                      <View style={styles.feedbackContainerEl}>
                        <TouchableOpacity>
                          <FontAwesome
                            name="comment-o"
                            size={24}
                            color="#FF6C00"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.feedbackContainerEl,
                        styles.localionPosition,
                      ]}
                    >
                      <TouchableOpacity>
                        <SimpleLineIcons
                          style={styles.locationIcon}
                          name="location-pin"
                          size={24}
                          color="#BDBDBD"
                        />
                      </TouchableOpacity>
                      <Text style={styles.locationIconTitle}>
                        {item.photoLocation}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  logoutBtn: {
    position: "absolute",
    top: 16,
    right: 16,
  },

  formContainer: {
    marginTop: 180,
    backgroundColor: "#fff",
    width: "100%",
    minHeight: "80%",

    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingTop: 80,
    paddingBottom: 16,
  },
  avatarContainer: {
    position: "absolute",
    backgroundColor: "#F6F6F6",
    width: 120,
    height: 120,
    borderRadius: 16,
    top: "-8%",
    left: "35%",
  },

  contentContainer: {
    borderRadius: 8,
    alignItems: "center",
    gap: 16,
  },
  contentImage: {
    width: 350,
    height: 200,
    borderRadius: 8,
    backgroundColor: "aqua",
    marginTop: 16,
  },

  closeBtn: {
    position: "absolute",
    bottom: 10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    color: "#212121",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
  },
  contentTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#212121",
    marginTop: 8,
  },
  feedbackContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  feedbackContainerEl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  localionPosition: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  locationIconTitle: {
    textDecorationLine: "underline",
  },
  feedbackContainerLeftEl: {
    flexDirection: "row",
    gap: 16,
  },
});

export default ProfileScreen;
