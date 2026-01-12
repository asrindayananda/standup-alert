import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { pointsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface PointsData {
  points: number;
  total_standups: number;
  streak_days: number;
  last_standup_date: string;
}

const HomeScreen = () => {
  const { user } = useAuth();
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await pointsAPI.getMyPoints();
      setPointsData(response.data);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const handleStandup = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await pointsAPI.recordStandup();
      Alert.alert(
        'Standup Recorded! 🎉',
        `You earned ${response.data.points_earned} points!\n${
          response.data.streak_bonus > 0
            ? `Streak bonus: ${response.data.streak_bonus} points!`
            : ''
        }`
      );
      await fetchPoints();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to record standup');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPoints();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}! 👋</Text>
        <Text style={styles.subtitle}>Time to stand up and move!</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pointsData?.points || 0}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pointsData?.total_standups || 0}</Text>
          <Text style={styles.statLabel}>Standups</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pointsData?.streak_days || 0}</Text>
          <Text style={styles.statLabel}>Day Streak 🔥</Text>
        </View>
      </View>

      <View style={styles.mainAction}>
        <TouchableOpacity
          style={[styles.standupButton, isLoading && styles.disabledButton]}
          onPress={handleStandup}
          disabled={isLoading}
        >
          <Text style={styles.standupButtonText}>
            {isLoading ? 'Recording...' : '🚶 Record Standup'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.helpText}>
          Tap this button every time you stand up during your work day
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 Tips</Text>
        <Text style={styles.infoText}>
          • Stand up every hour for better health{'\n'}
          • Earn 10 points for each standup{'\n'}
          • Build streaks for bonus points!{'\n'}
          • Compete with colleagues on the leaderboard
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  mainAction: {
    padding: 20,
  },
  standupButton: {
    backgroundColor: '#34C759',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  standupButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  helpText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 15,
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default HomeScreen;
