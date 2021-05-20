import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, Dimensions, Keyboard, TouchableWithoutFeedback, Linking } from 'react-native';
import { AdMobBanner, AdMobInterstitial } from 'expo-ads-admob';

import Clipboard from 'expo-clipboard';

const { width, height } = Dimensions.get("screen");


export default function App() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [urlFinal, setUrlFinal] = useState('');

  useEffect(() => {
    async function loadAd() {
      await AdMobInterstitial.setAdUnitID('ca-app-pub-9728868475893671/4626971456');
      InterstitialAd()
    }
    loadAd();
  }, []);

  async function InterstitialAd() {
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  }

  const short = async () => {
    Keyboard.dismiss();
    if (url.toLowerCase().includes('https://') || url.toLowerCase().includes('http://')) {
      if (name.trim() === "") {
        await fetch(`https://cutt.ly/api/api.php?key=85ab32ef894135c4c0612d207f7c0c55f8beb&short=${url}`).then(async response => {
          const data = await response.json();
          if (data.url.status === 3) {
            alert('The preferred link name is already taken');
            return;
          }
          if (data.url.status === 2) {
            alert('url invalida');
            return;
          }

          setUrlFinal(data.url.shortLink);
        });
      } else {
        await fetch(`https://cutt.ly/api/api.php?key=85ab32ef894135c4c0612d207f7c0c55f8beb&short=${url}&name=${name}`).then(async response => {
          const data = await response.json();
          if (data.url.status === 3) {
            alert('Esse nome ja esta em uso');
            return;
          }
          if (data.url.status === 2) {
            alert('url invalida');
            return;
          }

          setUrlFinal(data.url.shortLink);
        });
      }

      return;
    }

    alert('Invalid URL, please insert http://');
  }

  const copyUrl = () => {
    Clipboard.setString(urlFinal);
    alert('Copied to Clipboard')
  }

  return (
    <>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" translucent={false} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          <Text style={styles.title}>url
            <Text style={{ color: '#1076F7' }}>Shortener</Text>
          </Text>

          <View style={{}}>
            <Text style={{ marginLeft: 5 }}>Url<Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.urlInput}
              onChangeText={(texto) => setUrl(texto)}
              value={url}
              placeholder="Ex: https://www.google.com/"
            />
          </View>


          <View style={{}}>
            <Text style={{ marginLeft: 5 }}>Custom Name</Text>
            <TextInput
              style={styles.urlInput}
              onChangeText={(texto) => setName(texto)}
              value={name}
              placeholder="Ex: Go (not required)"
            />
          </View>

          <TouchableOpacity onPress={() => { short(); InterstitialAd; }} style={styles.shortBtn}>
            <Text style={{ color: '#FFF' }}>Process</Text>
          </TouchableOpacity>

          <Text onPress={copyUrl} style={styles.finalUrl}>{urlFinal}</Text>

          <TouchableOpacity style={styles.paypalBtn} onPress={() => Linking.openURL("https://www.paypal.com/donate/?hosted_button_id=EAMF7WY7HY2SQ")}>
            <Text style={{ color: '#FFF' }}>Donate PayPal</Text>
          </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AdMobBanner
          bannerSize="smartBannerPortrait"
          adUnitID={"ca-app-pub-3737795788074947/5108435769"}
          servePersonalizedAds={true}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  urlInput: {
    height: 50,
    width: width / 1.3,
    padding: 10,
    borderColor: '#21243d',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    fontSize: 15,
    marginBottom: 15,
  },
  shortBtn: {
    backgroundColor: '#8C9ACE',
    borderRadius: 20,
    height: 40,
    width: width / 1.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paypalBtn: {
    backgroundColor: '#0096DA',
    borderRadius: 20,
    height: 40,
    width: width / 2.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  finalUrl: {
    height: 40,
    width: width / 1.3,
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center'
  },
  title: {
    color: '#21243d',
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: 20
  }
});
