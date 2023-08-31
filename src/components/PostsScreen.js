import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import avatar from "../../assets/images/avatar.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";

import { db } from "../../firebase/config";

import { collection, query, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";

export default PostsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const { userId, nickName } = useSelector((state) => state.auth);
  console.log("route :>> ", route);

  const getAllPost = async () => {
    const postsRef = query(collection(db, "post"));
    onSnapshot(postsRef, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.personContainer}>
        <Image style={styles.tinyLogo} source={avatar} />
        <View>
          <Text style={styles.textName}>{nickName}</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <Image source={{ uri: item.photo }} style={styles.image} />
              <Text style={styles.contentTitle}>{item.photoName}</Text>
              <View style={styles.feedbackContainer}>
                <View style={styles.feedbackContainerLeftEl}>
                  <View style={styles.feedbackContainerEl}>
                    <FontAwesome
                      name="comment-o"
                      size={24}
                      color="#FF6C00"
                      onPress={() =>
                        navigation.navigate("CommentsScreen", {
                          postId: item.id,
                          photo: item.photo,
                        })
                      }
                    />
                  </View>
                </View>
                <View></View>
                <View
                  style={[styles.feedbackContainerEl, styles.localionPosition]}
                >
                  <SimpleLineIcons
                    style={styles.locationIcon}
                    name="location-pin"
                    size={24}
                    color="#BDBDBD"
                    onPress={() =>
                      navigation.navigate("MapScreen", {
                        location: item.location,
                      })
                    }
                  />

                  <Text style={styles.locationIconTitle}>
                    {item.photoLocation}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  tinyLogo: {
    width: 60,
    height: 60,
  },
  personContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 40,
  },

  textName: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
  },
  textEmail: {
    fontFamily: "Roboto-Regular",
    fontSize: 11,
  },

  image: {
    width: 350,
    height: 200,
    borderRadius: 8,
    backgroundColor: "aqua",
    marginTop: 16,
  },
  contentContainer: {
    alignItems: "center",
    marginTop: 16,
    paddingBottom: 24,
    width: "100%",
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
    marginTop: 8,
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
