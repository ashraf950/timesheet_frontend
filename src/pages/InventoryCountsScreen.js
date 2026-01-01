
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import api from '../api/api';

const bankLogos = {
  icici: require('../../assets/ICICI.png'),
  idfc: require('../../assets/IDFC.png'),
  hdfc: require('../../assets/HDFC.png'),
  indus: require('../../assets/IndusInd.png'),
};

const { width } = Dimensions.get('window');

export default function InventoryCountsScreen({ route, navigation }) {
  const { bankId = 'idfc' } = route.params || {};
  const [counts, setCounts] = useState({ c1: 0, c2: 0, c3: 0, c4: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCounts();
  }, [bankId]);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/inventory/counts?bankId=${bankId}`);
      setCounts(res.data.counts || { c1: 150, c2: 120, c3: 85, c4: 40 });
    } catch (err) {
      console.error(err);
      setCounts({ c1: 150, c2: 120, c3: 85, c4: 40 });
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (classNum, count) => {
    if (count > 0) {
      navigation.navigate('TagInventory', { bankId, classNum, count });
    } else {
      Alert.alert('No Tags', `No tags available for Class ${classNum}`);
    }
  };

  const renderCountCard = (classNum, count, color) => {
    const isDisabled = count === 0;
    
    return (
      <TouchableOpacity
        key={classNum}
        style={[styles.card, isDisabled && styles.cardDisabled]}
        onPress={() => handleClassClick(classNum, count)}
        activeOpacity={0.8}
        disabled={isDisabled}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            <View style={[styles.icon, { backgroundColor: color }]} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardLabel}>Class {classNum}</Text>
            <Text style={styles.cardSublabel}>Available Tags of Cars</Text>
          </View>
        </View>
        <Text style={[styles.cardValue, { color }]}>{count}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0A7AFF" />
        <Text style={styles.loadingText}>Loading inventory...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image source={bankLogos[bankId]} style={styles.logo} />
        <Text style={styles.title}>Inventory Counts</Text>
        <Text style={styles.subtitle}>Select a class to view tags</Text>
      </View>

      <View style={styles.cardList}>
        {renderCountCard(4, counts.c1, '#2ecc71')}
        {/* Classes 2-4 temporarily hidden
        {renderCountCard(2, counts.c2, '#0A7AFF')}
        {renderCountCard(3, counts.c3, '#FF9500')}
        {renderCountCard(4, counts.c4, '#FF3B30')}
        */}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, styles.shadowProp]}
        onPress={() => navigation.navigate('TagInventory')}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>View All Tags</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  contentContainer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 140,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  cardList: {
    width: '100%',
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  textContainer: {
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  cardSublabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#0A7AFF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  shadowProp: {
    ...Platform.select({
      ios: {
        shadowColor: '#0A7AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});