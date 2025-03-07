import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const { width, height } = Dimensions.get('window');

type VideoItem = {
  id: number;
  uri: string;
};

type AppState = {
  liked: VideoItem[];
  disliked: VideoItem[];
  currentIndex: number;
};

//Sample video data

const videos: VideoItem[] = [
  { id: 1, uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 2, uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { id: 3, uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
];

// App React.FC for clearer syntax

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    liked: [],
    disliked: [],
    currentIndex: 0,
  });

  //scrollViewRef

  const scrollViewRef = useRef<ScrollView>(null);

  //handleSwipe

  const handleSwipe = (direction: 'left' | 'right', index: number) => {
    if (direction === 'right') {
      setState((prev) => ({ ...prev, liked: [...prev.liked, videos[index]] }));
    } else if (direction === 'left') {
      setState((prev) => ({ ...prev, disliked: [...prev.disliked, videos[index]] }));
    }
    setState((prev) => ({ ...prev, currentIndex: index + 1 }));
  };

  //handleRefresh

  const handleRefresh = () => {
    setState({ liked: [], disliked: [], currentIndex: 0 });
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        vertical
        showsVerticalScrollIndicator={false}
      >
        {videos.map((video, index) => (
          <Swipeable
            key={video.id}
            onSwipeableOpen={(direction) => {
              if (direction === 'right') {
                handleSwipe('right', index);
              } else if (direction === 'left') {
                handleSwipe('left', index);
              }
            }}

          // {() => handleSwipe('left', index)} depricated

          >
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: video.uri }}
                style={styles.video}
                resizeMode="cover"
                paused={index !== state.currentIndex}
                repeat
              />
            </View>
          </Swipeable>
        ))}
      </ScrollView>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Liked: {state.liked.length}</Text>
        <Text style={styles.counterText}>Disliked: {state.disliked.length}</Text>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  counterContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  counterText: {
    color: 'white',
    fontSize: 16,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;