import { StyleSheet } from 'react-native';

export const newProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // center horizontally
  },
  entriesWrapper: {
    flex: 1,
    width: '100%', // full width so list entries stretch
  },

  // eslint-disable-next-line react-native/no-color-literals
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 75,
    overflow: 'hidden',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    alignSelf: 'center',
  },
  profileImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  profileImagePlaceholderText: {
    fontSize: 18,
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  // eslint-disable-next-line react-native/no-color-literals
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomColor: '#007AFF', // blue underline
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  transactionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editProfileButton: {
    backgroundColor: '#7067CF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 60, // <-- increase this number to move button higher
    alignSelf: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  editProfileButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

  levelInfoContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  xpPoints: {
    fontSize: 16,
    color: '#008000',
  },
});
