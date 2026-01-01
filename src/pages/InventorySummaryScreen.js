
import React, { useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  StatusBar,
  Platform,
  UIManager,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const banks = [
  { id: 'icici', name: 'ICICI Bank', logo: require('../../assets/ICICI.png') },
  // { id: 'idfc', name: 'IDFC FIRST Bank', logo: require('../../assets/IDFC.png') },
  // { id: 'hdfc', name: 'HDFC Bank', logo: require('../../assets/HDFC.png') },
  // { id: 'indus', name: 'IndusInd Bank', logo: require('../../assets/IndusInd.png') },
];

export default function InventorySummaryScreen({ navigation }) {
    const { signOut } = useContext(require('../context/AuthContext').AuthContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // ✅ FIX: Create animated values for each bank item
  const itemAnims = useRef(
    banks.map(() => new Animated.Value(1))
  ).current;

  // Staggered entrance animation for list items
  const itemEntranceAnims = useRef(
    banks.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Main container entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered item animations
    itemEntranceAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100 + 200, // Stagger effect
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handlePressIn = (animate) => {
    Animated.spring(animate, {
      toValue: 0.96,
      tension: 400,
      friction: 20,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (animate) => {
    Animated.spring(animate, {
      toValue: 1,
      tension: 400,
      friction: 20,
      useNativeDriver: true,
    }).start();
  };

  const navigateToInventory = (bank) => {
    // Add haptic feedback here if desired
    navigation.navigate('InventoryCounts', { 
      bankId: bank.id, 
      bankName: bank.name, 
      bankLogo: bank.logo 
    });
  };

  return (
    <LinearGradient
      colors={['#0A3D9E', '#1E5FCC', '#007bff']}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A3D9E" />
      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={signOut}
      >
        <Feather name="log-out" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <Animated.View 
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        {/* Enhanced Header with Icon */}
        <View style={styles.headerContainer}>
          <View style={styles.headerIconContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.headerIconGradient}
            >
              <Feather name="layers" size={28} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.headerTitle}>Inventory</Text>
          <Text style={styles.headerSubtitle}>Manage your TOCCOPay inventory across banking partners</Text>
        </View>

        {/* Glassmorphism Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select Banking Partner</Text>
          <Text style={styles.sectionSubtitle}>Choose a bank to view and manage inventory</Text>

          {banks.map((bank, index) => {
            const itemAnim = itemAnims[index];
            const entranceAnim = itemEntranceAnims[index];
            
            return (
              <Animated.View
                key={bank.id}
                style={[
                  styles.bankRowWrapper,
                  index < banks.length - 1 && styles.bankRowSeparator,
                  { 
                    transform: [{ scale: itemAnim }],
                    opacity: entranceAnim,
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPressIn={() => handlePressIn(itemAnim)}
                  onPressOut={() => handlePressOut(itemAnim)}
                  onPress={() => navigateToInventory(bank)}
                  style={styles.touchableArea}
                >
                  <View style={styles.bankRowContent}>
                    <View style={styles.logoContainer}>
                      <Image source={bank.logo} style={styles.bankLogo} />
                    </View>
                    <View style={styles.bankInfo}>
                      <Text style={styles.bankName}>{bank.name}</Text>
                      <Text style={styles.bankDescription}>View inventory details</Text>
                    </View>
                    <Animated.View style={styles.chevronContainer}>
                      <Feather 
                        name="chevron-right" 
                        size={24} 
                        color="#c7c7cc" 
                        style={styles.chevron}
                      />
                    </Animated.View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
        
        {/* Premium Floating Action Button */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('InventoryRequest')}
          style={styles.fabContainer}
        >
          <LinearGradient
            colors={['#007bff', '#0062cc']}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="plus" size={24} color="#fff" />
            <Text style={styles.fabText}>Request New Inventory</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    logoutButton: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 30,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.18)',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      zIndex: 10,
    },
    logoutText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '700',
      marginLeft: 8,
    },
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  headerIconContainer: {
    marginBottom: 16,
  },
  headerIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7c7c8a',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 35,
    elevation: 15,
    backdropFilter: 'blur(10px)',
  },
  bankRowWrapper: {
    backgroundColor: 'transparent',
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bankRowSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  touchableArea: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  bankRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 16,
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  bankLogo: {
    width: 48,
    height: 36,
    resizeMode: 'contain',
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  bankDescription: {
    fontSize: 13,
    color: '#7c7c8a',
  },
  chevronContainer: {
    padding: 8,
  },
  chevron: {
    opacity: 0.6,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    left: 20,
    borderRadius: 16,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});