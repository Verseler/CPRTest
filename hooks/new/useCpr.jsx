import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function useCpr() {
  const [zData, setZData] = useState(0); // Stores current Z-axis data
  const [prevZData, setPrevZData] = useState(0); // Stores previous Z-axis data
  const [compressionDetected, setCompressionDetected] = useState(false);
}