import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors, spacing, typography } from '../../theme';

const ProfileCard = ({
  user,
  onEdit,
  onViewStats,
  onSettings,
}) => {
  const {
    name,
    email,
    avatar,
    level,
    experience,
    nextLevelExp,
    streak,
    totalWorkouts,
    joinDate,
  } = user;

  const experiencePercentage = (experience / nextLevelExp) * 100;

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Feather name="user" size={40} color={colors.text.secondary} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.joinDate}>
            Member since {formatJoinDate(joinDate)}
          </Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Feather name="edit-2" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.levelSection}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.expText}>
            {experience} / {nextLevelExp} XP
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(experiencePercentage, 100)}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <TouchableOpacity style={styles.statItem} onPress={onViewStats}>
          <View style={styles.statIcon}>
            <Feather name="zap" size={24} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statItem} onPress={onViewStats}>
          <View style={styles.statIcon}>
            <Feather name="activity" size={24} color={colors.success} />
          </View>
          <Text style={styles.statValue}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statItem} onPress={onViewStats}>
          <View style={styles.statIcon}>
            <Feather name="award" size={24} color={colors.warning} />
          </View>
          <Text style={styles.statValue}>{level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onViewStats}>
          <Feather name="bar-chart-2" size={20} color={colors.white} />
          <Text style={styles.actionText}>View Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onSettings}>
          <Feather name="settings" size={20} color={colors.primary} />
          <Text style={styles.secondaryText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  userInfo: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  joinDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  editButton: {
    padding: spacing.sm,
  },
  levelSection: {
    marginBottom: spacing.lg,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelText: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '600',
  },
  expText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '600',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  actionText: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  secondaryText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
});

export default ProfileCard;