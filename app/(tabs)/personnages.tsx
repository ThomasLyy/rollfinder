// Fichier: app/personnages.tsx

import React from 'react';
import { StyleSheet, SafeAreaView, ImageBackground } from 'react-native';

const workInProgressImage = require('../../assets/images/wip.png');

// Change ce nom en ChecksScreen pour l'autre fichier
export default function PersonnagesScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
        <ImageBackground
            source={workInProgressImage}
            style={styles.background}
            resizeMode="contain"
        />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000', // Fond pour les zones non couvertes par l'image
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});