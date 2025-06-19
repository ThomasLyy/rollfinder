import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, ViewStyle } from 'react-native';

interface Props {
    onPress?: () => void;
    style?: ViewStyle | ViewStyle[];
    disabled?: boolean;
    children?: React.ReactNode;
}
const AnimatedButtonFeedback: React.FC<Props> = ({ onPress, style, disabled, children }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const onPressIn = () => Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true, friction: 7 }).start();
    const onPressOut = () => Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 7 }).start();

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.85}
            disabled={disabled}
            style={{ width: '100%' }} // <- important pour que le bouton occupe toute la largeur parent
        >
            <Animated.View style={[styles.button, style, { transform: [{ scale: scaleValue }] }]}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        width: '100%', // S'assure que le contenu prend toute la largeur
    },
});

export default AnimatedButtonFeedback;
