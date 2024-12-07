import { View, Text, Pressable, Image, SafeAreaView, StatusBar } from 'react-native';
import { Link, SplashScreen } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export default function WelcomeScreen() {
  const [loaded, error] = useFonts({
    'SpaceMono-Regular': require('../../assets/fonts/SpaceMono-Regular.ttf'),
    'LuckiestGuy-Regular': require('../../assets/fonts/LuckiestGuy-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#4B6BFB"
      />
      <LinearGradient
        colors={['#111111', '#111232', '#4B6BFB']}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          {/* Main Container */}
          <View className="flex-1 items-center justify-center space-y-4">
            {/* Wallet Icon Container with Gray Gradient */}
            <View className="">
              <Image
                source={{
                  uri: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1727810716/projects/julie_gez2o2.png",
                }}
                className="w-48 h-48 mb-10"
                resizeMode="contain"
              />
            </View>
            
            {/* Logo and Text */}
            <View className="items-center space-y-3">
              <View className="flex-row items-center space-x-2">
                {/* <View className="w-8 h-8 bg-[#4B6BFB] rounded-lg" /> */}
                <Text 
                  style={{ fontFamily: 'LuckiestGuy-Regular' }} 
                  className="text-white text-4xl"
                >
                  Julie Ai ❣
                </Text>
              </View>
              <Text 
                className="text-gray-400 text-base text-center"
              >
                Your AI bestie who happens to know tech!
              </Text>
            </View>

            {/* Get Started Button */}
            <Link href="/home" asChild>
              <Pressable className="w-full bg-[#4B6BFB] py-4 rounded-xl mt-12">
                <Text 
                  className="text-white text-center text-lg font-extrabold"
                >
                  Get Started
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}