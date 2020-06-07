import React, {useState, useEffect} from 'react';
import {Feather as Icon} from '@expo/vector-icons';
import {View, Image, TextInput, Platform, KeyboardAvoidingView, StyleSheet, Text, ImageBackground} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import ibge from '../../services/ibge';
import {Select} from './components/Select';

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>(['']);
  const [cities, setCities] = useState<string[]>(['']);
  const [selectedUf, setSelectedUf] = useState('Escolha um Estado');
  const [selectedCity, setSelectedCity] = useState('Escolha um Cidade');

  const navigation = useNavigation();
  
  useEffect(() => {
    ibge.get<IBGEUFResponse[]>('estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    })
  }, [])
  
  useEffect(() => {
    if (selectedUf === '0') return
    ibge.get<IBGECityResponse[]>(`estados/${selectedUf}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome);
      setCities(cityNames);
    })
  }, [selectedUf])

  function handleNavigateToPoints() {
      navigation.navigate('Points', {
        uf: selectedUf,
        city: selectedCity
      });
  }

  function handleSelectUf(value: string) {
    setSelectedUf(value)
  }
  
  function handleSelectCity(value: string) {
    setSelectedCity(value)
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{width: 274, height: 368}}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Select
            value={selectedUf}
            onChangeText={handleSelectUf}
            data={ufs.map(uf => ({value: uf}))}
          />
          <Select
            value={selectedCity}
            onChangeText={handleSelectCity}
            data={cities.map(city => ({value: city}))}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}/>
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;