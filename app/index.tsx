import React,{ Component } from "react";
import { View, StyleSheet, Dimensions, Text, TextInput, StatusBar } from 'react-native';
import Animated,{ Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Ionicons } from '@expo/vector-icons';
import Svg,{ Image, Circle, ClipPath , Rect } from "react-native-svg";
import LottieView from "lottie-react-native";
import { RFValue } from "react-native-responsive-fontsize";
const {width, height} = Dimensions.get('window');

const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate,
    concat
  } = Animated;

  /**
   * 
   * @param clock
   * @param value 
   * @param dest 
   * @author Akash Golui
   * @description it is a runtime animation method using react-native-reanimated
   * @example this.runtime(new Clock(), 0 , 1)
   */
function runTiming(clock, value, dest) {

    /**
     * @description states of the method
     */
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };
    
    /**
     * @description config the runtime
     */
    const config = {
      duration: 500,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };
  
    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position
    ]);
  }

export default class index extends Component{
    buttonOpacity: Animated.Value<1>;
    onStateChange: (...args: any[]) => void;
    onCloseState: (...args: any[]) => void;
    buttonY: Animated.Node<number>;
    bgY: Animated.Node<number>;
    textInputzIndex: Animated.Node<number>;
    textInputY: Animated.Node<number>;
    textInputOpacity: Animated.Node<number>;
    rotateCross: Animated.Node<number>;
    constructor(props){
        super(props);
        this.buttonOpacity = new Value(1);

        this.onStateChange = event([
            {
                nativeEvent:({state})=>block([
                    cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 1, 0)))
                ])
            }
        ])

        this.onCloseState = event([
            {
                nativeEvent:({state})=>block([
                    cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 0, 1)))
                ])
            }
        ])

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        })

        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [-height/ 2.5 - height/10, 0],
            extrapolate: Extrapolate.CLAMP
        }) 

        this.lottiY = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [-height/10, 0],
            extrapolate: Extrapolate.CLAMP
        })

        this.textInputzIndex = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
        }) 

        this.textInputY = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        }) 

        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        }) 

        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [180, 360],
            extrapolate: Extrapolate.CLAMP
        }) 
    }

    componentDidMount() {
        this.animation.play();
        // Or set a specific startFrame and endFrame with:
        // this.animation.play(30, 120);
      }

      resetAnimation = () => {
        this.animation.reset();
        this.animation.play();
      };
    
    render(){
        return <KeyboardAwareScrollView bounces={false} style={{top: StatusBar.currentHeight, flex:1}}>
            <StatusBar translucent={true} barStyle='light-content' />
        <View style={{height:height, backgroundColor:'#fff', justifyContent:'flex-end'}}>
            <Animated.View style={{...StyleSheet.absoluteFill, transform:[{translateY: this.bgY}]}}>
                
                <Svg height={height+height/10} width={width}>
                    
                    <ClipPath id='curv'>
                        <Circle r={height+height/10} cx={width/2} />
                    </ClipPath>
                    <Image 
                        href={require('../assets/bg2.jpg')} 
                        height={height+height/10}
                        width={width}
                        preserveAspectRatio='xMidYMid slice'
                        clipPath="url(#curv)" />
                        
                </Svg>
                
            </Animated.View>
            <Animated.View style={{ height: height/3, justifyContent:'center', alignItems:'center', transform:[{translateY: this.lottiY}] }}>
                <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        style={{
                            width: width/2,
                            // backgroundColor:'transparent'
                        }}
                        
                        source={require('../assets/meda-chat.json')}
                        // OR find more Lottie files @ https://lottiefiles.com/featured
                        // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                    />
            </Animated.View>
            <View style={{height: height/ 2.5, justifyContent:'center'}}>
                <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                    <Animated.View style={{...styles.button, opacity: this.buttonOpacity, transform:[{translateY: this.buttonY}]}}>
                        <Text style={{fontSize:RFValue(15), fontWeight:'bold'}}>SIGN IN</Text>
                    </Animated.View>
                </TapGestureHandler>
                <Animated.View style={{...styles.button, backgroundColor:'#2E71DC', opacity: this.buttonOpacity, transform:[{translateY: this.buttonY}] }}>
                    <Text style={{fontSize:RFValue(15), fontWeight:'bold', color:'#fff'}}>SIGN IN WITH FACEBOOK</Text>
                </Animated.View>
                <Animated.View 
                    style={{
                        ...StyleSheet.absoluteFill, 
                        opacity: this.textInputOpacity, 
                        zIndex: this.textInputzIndex, 
                        transform:[{translateY: this.textInputY}],
                        top: null, 
                        justifyContent:'center', 
                        height: height/ 2.5}}>

                    <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                        <Animated.View style={styles.closeButton}>
                            <Animated.Text style={{fontWeight:'bold', transform:[{rotate: concat(this.rotateCross, 'deg') }]}}>
                                <Ionicons name="md-close" size={20} color="red" />
                            </Animated.Text>
                            
                        </Animated.View>
                    </TapGestureHandler>
                    <TextInput
                        placeholder='Email'
                        style={styles.textInput}
                        placeholderTextColor='#000'
                    />

                    <TextInput
                        placeholder='Password'
                        style={styles.textInput}
                        placeholderTextColor='#000'
                    />
                    <View style={{...styles.button }}>
                        <Text style={{fontSize:RFValue(15), fontWeight:'bold', color:'#000'}}>SIGN IN</Text>
                    </View>
                </Animated.View>
            </View>
        </View>
        </KeyboardAwareScrollView> 
    }
}

const styles = StyleSheet.create({
    button:{
        backgroundColor:'#fff',
        height: height / 12,
        marginHorizontal: width* 0.1,
        borderRadius: (height / 12) / 2,
        justifyContent:'center',
        alignItems:'center',
        marginVertical: height* 0.01,
        shadowColor: '#000',
        shadowOffset: {width:2, height:2},
        shadowRadius: 5,
        shadowOpacity: .15,
        elevation:5
    },
    textInput:{
        height: height / 14,
        marginHorizontal: width* 0.1,
        borderRadius: (height / 14) / 2,
        borderWidth:0.5,
        paddingHorizontal:height* 0.02,
        marginVertical:height* 0.01,
        borderColor: 'rgba(0,0,0,0.2)'
    },
    closeButton:{
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        backgroundColor:'#fff',
        shadowOffset: {width:2, height:2},
        shadowRadius: 5,
        shadowOpacity: .15,
        justifyContent:'center',
        alignItems:'center',
        top:-20,
        left: width/2 - 20,
        position:'absolute'
    }
  });