import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { FlatList } from "react-native-gesture-handler";

const CommentsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const { nickName } = useSelector((state) => state.auth);
  const { postId, photo } = route.params;
  console.log("photo :>> ", photo);
  console.log("postId :>> ", postId);
  useEffect(() => {
    const commentsRef = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    );
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => unsubscribe();
  }, [postId]);

  const addComment = async () => {
    if (commentText.trim() === "") {
      return;
    }

    try {
      const commentData = {
        postId,
        comment: commentText,
        author: nickName,
        timestamp: new Date().toISOString().substring(0, 10),
      };

      await addDoc(collection(db, "comments"), commentData);

      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo }} style={styles.image} />
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentsContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{item.author}</Text>
              <Text style={styles.text}>{item.comment}</Text>
              <Text style={styles.textData}>{item.timestamp}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.inputPad]}
          placeholder="Коментувати..."
          value={commentText}
          onChangeText={setCommentText}
        />

        <TouchableOpacity onPress={addComment} style={styles.arrowContainer}>
          <AntDesign name="arrowup" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: "space-between",
  },

  image: {
    width: 350,
    height: 200,
    borderRadius: 8,
    backgroundColor: "aqua",
    marginTop: 16,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 16,
  },
  textContainer: {
    padding: 8,
    backgroundColor: "#F6F6F6",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 5,
    marginTop: 16,
    marginLeft: 16,
    gap: 8,
  },
  commentsContainer: {
    gap: 16,
    minWidth: 200,
    maxWidth: 300,
  },
  text: {
    fontSize: 13,
  },
  textData: {
    fontSize: 10,
    color: "#BDBDBD",
  },
  input: {
    width: "90%",
    paddingStart: 16,
    height: 50,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    backgroundColor: "#F6F6F6",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  arrowContainer: {
    position: "absolute",
    top: "14%",
    right: "7%",
    width: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: "#FF6C00",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CommentsScreen;
