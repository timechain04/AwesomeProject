import React, { useState } from "react";

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from "react-native";
import { useDispatch } from "react-redux";

import { useNavigation } from "@react-navigation/native";
import ImageBG from "../../assets/images/ImageBG.png";

import { AntDesign } from "@expo/vector-icons";
import { register } from "../../redux/auth/authOperations";

export default RegistrationScreen = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isLoginFocused, setIsLoginFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userData = () => {
    if (passwordError || emailError || email === "" || password === "") {
      console.log("Please enter a valid email and password");
      return;
    }
    dispatch(register({ login, email, password }));
    const user = {
      login,
      email: email.toString(),
      password: password.toString(),
    };

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground source={ImageBG} style={styles.image}>
          <View
            style={{
              ...styles.formContainer,
              padingBottom: isShowKeyboard ? 16 : 32,
            }}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarLogo}></View>
              <TouchableOpacity style={styles.addBtn}>
                <AntDesign name="pluscircleo" size={25} color="#FF6C00" />
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <Text style={styles.title}>Реєстрація</Text>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: isLoginFocused
                    ? "rgba(255, 108, 0, 1)"
                    : "rgba(255, 255, 255, 1)",
                }}
                value={login}
                onChangeText={setLogin}
                autoFocus={true}
                placeholder="Логін"
                onFocus={() => setIsLoginFocused(true)}
                onBlur={() => setIsLoginFocused(false)}
              />
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
            </KeyboardAvoidingView>
            <TouchableOpacity style={styles.button} onPress={userData}>
              <Text style={styles.buttonText}>Зареєстуватися</Text>
            </TouchableOpacity>
            <View style={styles.linkContainer}>
              <Text>Вже є акаунт?</Text>
              <TouchableOpacity>
                <Text onPress={() => navigation.navigate("LoginScreen")}>
                  Увійти
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 80,
    paddingBottom: 24,
  },

  avatarContainer: {
    position: "absolute",
    backgroundColor: "#F6F6F6",
    width: 120,
    height: 120,
    borderRadius: 16,
    top: "-15%",
    left: "35%",
  },
  addBtn: {
    position: "absolute",
    bottom: "10%",
    right: "-10%",
  },
  closeBtn: {
    position: "absolute",
    bottom: 10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: "50%",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
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
