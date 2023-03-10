import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isEmpty, size } from "lodash";
import { Image, Input, Button, Icon } from "react-native-elements";
import Loading from "../../kernel/components/Loading";
import { validateEmail } from "../../kernel/validation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateUser(props) {
  const { navigation } = props;
  const auth = getAuth();
  const payload = { email: "", password: "", repeatPassword: "" };
  const [show, setShow] = useState(false);
  const [error, setError] = useState(payload);
  const [data, setData] = useState(payload);
  const [showPassword, setShowPassword] = useState(true);
  const [showRepeatPassword, setShowRepeatPassword] = useState(true);
 
  const createUser = () => {
    if (!(isEmpty(data.email) || isEmpty(data.password))) {

      if (validateEmail(data.email)) {
        if (size(data.password) >= 6) {
          if (data.password === data.repeatPassword) {
            createUserWithEmailAndPassword(auth, data.email, data.password)
              .then(async (userCredential) => {
                const user = userCredential.user;
                try {
                  await AsyncStorage.setItem("@session", JSON.stringify(user));
                  console.log("si cargo");
                } catch (e) {
                  console.log("achis porque?");
                }
                setShow(true);
                navigation.navigate("userGuestStack");
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
              });
          } else {
            setError({
              email: "",
              password: "",
              repeatPassword: "Las contraseñas no coinciden",
            });
          }
        } else {
          setError({
            email: "",
            password: "La contraseña debe ser mayor a 6 caracteres",
            repeatPassword: "",
          });
        }
      } else {
        setError({
          email: "El email no es correcto",
          password: "",
          repeatPassword: "",
        });
      }
    } else {
      setError({
        email: "Campo obligatorio",
        password: "Campo obligatorio",
        repeatPassword: "Campo obligatorio",
      });
    }

    console.log("data", data);
  };

  return (
    <KeyboardAwareScrollView>
      <Image
        source={require("../../assets/presupuesto.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <View style={styles.viewForm}>
        <View style={styles.container}>
          <Input
            placeholder="Correo electronico"
            keyboardType="email-address"
            rightIcon={<Icon type="material-comunity" name="email" size={22} />}
            containerStyle={styles.input}
            onChange={(e) => changePayload(e, "email")}
            errorMessage={error.email}
            autoCapitalize="none"
          />
          <Input
            placeholder="Contraseña"
            containerStyle={styles.input}
            rightIcon={
              <Icon
                type="material-community"
                name={showPassword ? "eye-off" : "eye-outline"}
                color=""
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            secureTextEntry={showPassword}
            onChange={(e) => changePayload(e, "password")}
            errorMessage={error.password}
          />
          <Input
            placeholder="repetirContraseña"
            containerStyle={styles.input}
            rightIcon={
              <Icon
                type="material-community"
                name={showRepeatPassword ? "eye-off" : "eye-outline"}
                color=""
                onPress={() => setShowRepeatPassword(!showRepeatPassword)}
              />
            }
            secureTextEntry={showRepeatPassword}
            onChange={(e) => changePayload(e, "repeatPassword")}
            errorMessage={error.repeatPassword}
          />
          <Button
            title="Crear cuenta"
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            onPress={createUser}
          />
        </View>
      </View>
      <Loading setShow={show} text="Registrar usuario" />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20,
  },
  viewForm: {
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  input: {
    width: "100%",
    marginVertical: 10,
  },
  btnContainer: {
    marginBottom: 20,
    width: "95%",
  },
  btn: {
    backgroundcolor: "#28a745",
  },
});
