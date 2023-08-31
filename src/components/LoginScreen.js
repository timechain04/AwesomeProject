import React, { useState } from "react";

import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import ImageBG from "../../assets/images/ImageBG.png";
import { logIn } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";

export default LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userData = () => {
    if (passwordError || emailError || email === "" || password === "") {
      console.log("Please enter a valid email and password");
      return;
    }

    const user = {
      email: email.toString(),
      password: password.toString(),
    };
    dispatch(logIn({ email, password }));
    navigation.navigate("Home", user);
  };

  const validateEmail = (text) => {
    setEmail(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      setEmailError("Email is Not Correct");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    let reg = /^.{8,}$/;
    if (reg.test(text) === false) {
      setPasswordError("Password must have at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  const isShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onLogin = () => {
    console.log(`email: ${email}, password: ${password}`);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground source={ImageBG} style={styles.image}>
          <View>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View
                style={{
                  ...styles.formContainer,
                  paddingBottom: isShowKeyboard ? 16 : 32,
                }}
              >
                <Text style={styles.title}>Увійти</Text>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: isEmailFocused
                      ? "rgba(255, 108, 0, 1)"
                      : "rgba(255, 255, 255, 1)",
                  }}
                  value={email}
                  onChangeText={validateEmail}
                  autoFocus={true}
                  placeholder="Адреса електронної пошти"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
                {emailError ? (
                  <Text style={styles.error}>{emailError}</Text>
                ) : null}
                <View>
                  <TextInput
                    style={[
                      {
                        ...styles.input,
                        borderColor: isPasswordFocused
                          ? "rgba(255, 108, 0, 1)"
                          : "rgba(255, 255, 255, 1)",
                      },
                      styles.inputPad,
                    ]}
                    value={password}
                    onChangeText={validatePassword}
                    secureTextEntry={!showPassword}
                    autoFocus={true}
                    placeholder="Пароль"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  {passwordError ? (
                    <Text style={styles.error}>{passwordError}</Text>
                  ) : null}
                  <TouchableOpacity
                    style={styles.showBtn}
                    onPress={isShowPassword}
                  >
                    <Text>{showPassword ? "Приховати" : "Показати"}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={userData}>
                  <Text style={styles.buttonText}>Увійти</Text>
                </TouchableOpacity>
                <View style={styles.linkContainer}>
                  <Text>Немає акаунту?</Text>
                  <TouchableOpacity>
                    <Text
                      onPress={() => navigation.navigate("RegistrationScreen")}
                    >
                      Зареєструватися
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  formContainer: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingTop: 32,
  },

  title: {
    textAlign: "center",
    marginBottom: 32,
    color: "#212121",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
  },

  input: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    width: "90%",
    height: 50,
    margin: 8,
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    marginLeft: "auto",
    marginRight: "auto",
  },
  inputPad: {
    paddingRight: 120,
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
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 5,
  },
  showBtn: {
    position: "absolute",
    top: 25,
    right: 50,
  },
  error: {
    color: "red",
    paddingLeft: 20,
  },
});
