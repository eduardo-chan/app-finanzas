import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Input, Button, Image, Icon } from "@rneui/base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateEmail } from "../../kernel/validation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import React, { useState } from "react";
import { isEmpty, size } from "lodash";
import Loading from "../../kernel/components/Loading";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function CreateUser(props) {
  const { navigation } = props
  const payLoad = {
      email: '',
      password: '',
      repeatPassword: ''
  }
  const auth = getAuth()
  const [show, setShow] = useState(false)
  const [error, setError] = useState(payLoad)
  const [data, setData] = useState(payLoad)
  const [showPassword, setShowPassword] = useState(true)
  const [showRepeatPassword, setShowRepeatPassword] = useState(true)
  const changePayLoad = (e, type) => {
      setData({ ...data, [type]: e.nativeEvent.text })
  }
  const createUser = () => {
      console.log('CreateUser 24 -> data', data);
      if (!(isEmpty(data.email || isEmpty(data.password)))) {
          if (validateEmail(data.email)) {
              if ((size(data.password)) >= 6) {
                  if (data.password == data.repeatPassword) {
                      setShow(true)
                      setError(payLoad)
                      console.log('Listo para el registro');
                      createUserWithEmailAndPassword(auth, data.email, data.password)
                          .then(async (userCredential) => {
                              const user = userCredential.user;
                              try {
                                  await AsyncStorage.setItem('@session', JSON.stringify(user))
                              } catch (e) {
                                  console.error("Error -> createUser Storage", e);
                              }
                              console.log("Created User", user);
                              setShow(false)
                              navigation.navigate("profileStack")
                          })
                          .catch((error) => {
                              setError({ email: '', password: 'No se pudo crear el usuario' })
                              setShow(false)
                              const errorCode = error.code;
                              const errorMessage = error.message;
                          });
                  } else {
                      setError({
                          email: '',
                          password: 'Debe coincidir con repetir contrase??a',
                          repeatPassword: 'Debe coincidir con contrase??a'
                      })
                  }
              } else {
                  setError({
                      email: '',
                      password: 'Logitud de por lo menos 6 car??cteres',
                      repeatPassword: 'Logitud de por lo menos 6 car??cteres'
                  })
              }
          } else {
              setError({
                  email: 'Debe ser un correo electr??nico v??lido',
                  password: '',
                  repeatPassword: ''
              })
          }
      } else {
          setError({
              email: 'Campo obligatorio',
              password: 'Campo obligatorio',
              repeatPassword: 'Campo obligatorio'
          })
      }
  }
  return (
      <KeyboardAwareScrollView>
          <Image
              source={require('../../assets/presupuesto.png')}
              resizeMode='contain'
              style={styles.logo}
          />
          <View style={styles.viewForm}>
              <View style={styles.container}>
                  <Input
                      placeholder='Correo Electr??nico'
                      keyboardType='email-address'
                      rightIcon={
                          <Icon type='material-community' name='email' size={22} />
                      }
                      containerStyle={styles.input}
                      onChange={(e) => changePayLoad(e, 'email')}
                      errorMessage={error.email}
                      autoCapitalize='none'
                  />
                  <Input
                      placeholder='Contrase??a'
                      containerStyle={styles.input}
                      rightIcon={
                          <Icon
                              type='material-community'
                              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                              onPress={() => setShowPassword(!showPassword)}
                              size={22}
                          />
                      }
                      secureTextEntry={showPassword}
                      onChange={(e) => changePayLoad(e, 'password')}
                      errorMessage={error.password}
                  />
                  <Input
                      placeholder='Repetir contrase??a'
                      containerStyle={styles.input}
                      rightIcon={
                          <Icon
                              type='material-community'
                              name={showRepeatPassword ? 'eye-off-outline' : 'eye-outline'}
                              onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                              size={22}
                          />
                      }
                      secureTextEntry={showRepeatPassword}
                      onChange={(e) => changePayLoad(e, 'repeatPassword')}
                      errorMessage={error.repeatPassword}
                  />
                  <Button
                      title='Crear cuenta'
                      containerStyle={styles.btnContainer}
                      buttonStyle={styles.btn}
                      onPress={createUser}
                  />
              </View>
          </View>
          <Loading show={show} text='Registrando' />
      </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  logo: {
      width: '100%',
      height: 159,
      marginTop: 20
  },
  viewForm: {
      marginHorizontal: 20
  },
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20
  },
  input: {
      width: '100%',
      marginVertical: 10
  },
  btnContainer: {
      marginBottom: 20,
      width: '65%'
  },
  btn: {
      backgroundColor: '#0073db'
  },
})