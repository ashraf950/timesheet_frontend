
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { AuthContext } from '../context/AuthContext';

export default function AgentDashboardScreen({ navigation }) {
  const { signOut } = useContext(AuthContext);
  const walletBalance = '₹50,000';
  const pendingIssuances = 3;
  const inventoryCount = 120;
  const lowInventory = inventoryCount < 10;
  const fastagIssuedPerMonth = 40;
  const fastagRequestedPerMonth = 43;

  return (
    <LinearGradient colors={['#0f6bff', '#4facfe']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileIcon} onPress={() => {}}>
          <LinearGradient colors={["#ffffff", "#e8f0ff"]} style={styles.profileIconBg}>
            <Feather name="user" size={26} color="#0f6bff" />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.bellIcon} onPress={() => {}}>
            <LinearGradient colors={["#ffffff", "#e8f0ff"]} style={styles.bellIconBg}>
              <Feather name="bell" size={26} color="#0f6bff" />
              {lowInventory && <View style={styles.bellDot} />}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutIcon} onPress={signOut} accessibilityLabel="Logout">
            <LinearGradient colors={["#ffffff", "#e8f0ff"]} style={styles.logoutIconBg}>
              <Feather name="log-out" size={22} color="#0f6bff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.row}>
            <StatusCard 
              icon="credit-card" 
              label="Wallet Balance" 
              value={walletBalance} 
              colors={["#0f6bff", "#4facfe"]} 
            />
            <StatusCard 
              icon="clock" 
              label="Pending Issuances" 
              value={pendingIssuances} 
              colors={["#ffb347", "#ffcc33"]} 
            />
          </View>
          <View style={styles.row}>
            <StatusCard 
              icon="tag" 
              label="Inventory Count" 
              value={inventoryCount} 
              colors={["#43e97b", "#38f9d7"]} 
              fullWidth={true}
            />
          </View>
          <View style={styles.row}>
            <StatusCard 
              icon="check-circle" 
              label="FASTag Issued / Month" 
              value={fastagIssuedPerMonth} 
              colors={["#43e97b", "#38f9d7"]} 
            />
            <StatusCard 
              icon="arrow-up-circle" 
              label="FASTag Requested / Month" 
              value={fastagRequestedPerMonth} 
              colors={["#f7971e", "#ffd200"]} 
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        {Platform.OS === 'ios' || Platform.OS === 'android' ? (
          <BlurView intensity={40} tint="light" style={styles.actionsBackground}>
            <View style={styles.actionsRow}>
              <ActionButton icon="plus-circle" label="Issue Fast Tag" onPress={() => navigation.navigate('TagIssue')} />
              <ActionButton icon="layers" label="Fast Tag Inventories" onPress={() => navigation.navigate('InventoryCounts')} />
              <ActionButton icon="package" label="Request Inventory" onPress={() => navigation.navigate('InventoryRequest')} />
              <ActionButton icon="credit-card" label="Wallet Recharge" onPress={() => navigation.navigate('Wallet')} />
            </View>
          </BlurView>
        ) : (
          <View style={styles.actionsBackground}>
            <View style={styles.actionsRow}>
              <ActionButton icon="plus-circle" label="Issue Fast Tag" onPress={() => navigation.navigate('TagIssue')} />
              <ActionButton icon="layers" label="Fast Tag Inventories" onPress={() => navigation.navigate('InventoryCounts')} />
              <ActionButton icon="package" label="Request Inventory" onPress={() => navigation.navigate('InventoryRequest')} />
              <ActionButton icon="credit-card" label="Wallet Recharge" onPress={() => navigation.navigate('Wallet')} />
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

function StatusCard({ icon, label, value, colors, fullWidth = false }) {
  return (
    <LinearGradient 
      colors={colors} 
      style={[
        styles.statusCard, 
        fullWidth && styles.fullWidthCard
      ]}
    >
      <View style={styles.cardIconContainer}>
        <Feather name={icon} size={28} color="#fff" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </LinearGradient>
  );
}

function ActionButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient colors={["#ffffff", "#e8f0ff"]} style={styles.actionIconContainer}>
        <Feather name={icon} size={28} color="#0f6bff" />
      </LinearGradient>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 20,
  },
  profileIcon: {
    padding: 8,
  },
  profileIconBg: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#0f6bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  bellIcon: {
    padding: 8,
  },
  bellIconBg: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#0f6bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: '#0f6bff44',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: { 
    paddingHorizontal: 20,
    paddingBottom: 20 
  },
  cardsContainer: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  statusCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#0f6bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  fullWidthCard: {
    flex: 1,
  },
  cardIconContainer: {
    marginBottom: 12,
  },
  cardLabel: { 
    fontSize: 14, 
    color: '#fff', 
    opacity: 0.92,
    textAlign: 'center',
    marginBottom: 4
  },
  cardValue: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff', 
    letterSpacing: 1,
    textAlign: 'center'
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  actionsBackground: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#0f6bff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  actionIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 32,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#0f6bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { 
    color: '#0f6bff', 
    fontWeight: 'bold', 
    fontSize: 10, // Reduced font size from 14 to 12
    letterSpacing: 0.2,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18 // Reduced line height to match smaller font
  },
  bellDot: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f5576c',
    shadowColor: '#f5576c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutIcon: {
    padding: 8,
    marginLeft: 8,
  },
  logoutIconBg: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#0f6bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
});