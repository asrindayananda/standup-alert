import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { pointsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface PointsData {
  points: number;
  total_standups: number;
  streak_days: number;
  last_standup_date: string;
}

const ProfileScreen = () => {
  const { user } = useAuth();
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await pointsAPI.getMyPoints();
      setPointsData(response.data);
    } catch (error) {
      console.error('Error fetching points:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Statistics</Text>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pointsData?.points || 0}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pointsData?.total_standups || 0}</Text>
            <Text style={styles.statLabel}>Total Standups</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pointsData?.streak_days || 0}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {pointsData?.last_standup_date
                ? new Date(pointsData.last_standup_date).toLocaleDateString()
                : 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Last Standup</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>
            {pointsData && pointsData.total_standups >= 10 ? '✅' : '🔒'}
          </Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Getting Started</Text>
            <Text style={styles.achievementDesc}>Complete 10 standups</Text>
          </View>
        </View>

        <View style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>
            {pointsData && pointsData.streak_days >= 7 ? '✅' : '🔒'}
          </Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Week Warrior</Text>
            <Text style={styles.achievementDesc}>7 day streak</Text>
          </View>
        </View>

        <View style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>
            {pointsData && pointsData.points >= 100 ? '✅' : '🔒'}
          </Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Century Club</Text>
            <Text style={styles.achievementDesc}>Earn 100 points</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  achievementIcon: {
    fontSize: 36,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen;
