import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <LinearGradient colors={['#0f6bff', '#0062cc']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f6bff" />

      {/* Logo */}
      <View style={styles.logoSection}>
        <LinearGradient colors={['#fff', '#f0f0f5']} style={styles.logoBg}>
          <Feather name="tag" size={48} color="#0f6bff" />
        </LinearGradient>
        <Text style={styles.title}>TOCCOPay Agent</Text>
        <Text style={styles.subtitle}>Inventory Management</Text>
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        <Text style={styles.formTitle}>Welcome Back</Text>
        <Text style={styles.formSubtitle}>Sign in to your account</Text>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={18} color="#999" style={styles.icon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={18} color="#999" style={styles.icon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter password"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? ['#ccc', '#bbb'] : ['#0f6bff', '#0062cc']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Demo Credentials */}
        <View style={styles.demoBox}>
          <Text style={styles.demoLabel}>Demo Credentials</Text>
          <Text style={styles.demoText}>Email: agent@example.com</Text>
          <Text style={styles.demoText}>Password: password123</Text>
        </View>

        {/* Sign Up Link */}
        <View style={{ alignItems: 'center', marginTop: 18 }}>
          <Text style={{ color: '#333' }}>
            Don't have an account?{' '}
            <Text
              style={{ color: '#0f6bff', fontWeight: '700' }}
              onPress={() => {
                if (typeof navigation !== 'undefined' && navigation.navigate) {
                  navigation.navigate('Signup');
                }
              }}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#7c7c8a',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e8',
    borderRadius: 10,
    backgroundColor: '#f9f9ff',
    paddingHorizontal: 12,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a2e',
    padding: 0,
  },
  button: {
    marginTop: 8,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#0f6bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  demoBox: {
    backgroundColor: '#f0f0f5',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  demoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f6bff',
    marginBottom: 6,
  },
  demoText: {
    fontSize: 11,
    color: '#7c7c8a',
    marginBottom: 3,
  },
});
