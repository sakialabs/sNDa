# 📱 sNDa Mobile App

**Offline-First Mobile Application for Field Workers and Volunteers**

> A React Native app designed for challenging environments with unreliable internet connectivity, enabling field workers to collect referrals and volunteers to manage cases even when offline.

## 🎯 Mission

The sNDa mobile app addresses the critical need for **offline-first data collection** in humanitarian contexts. Field workers in Sudan and similar environments often face:
- Unreliable internet connectivity
- Limited bandwidth
- Need for immediate case documentation
- Secure data storage requirements

## 🛠️ Tech Stack

### **Core Framework**
- **React Native** with **TypeScript** - Cross-platform development with type safety
- **Expo** (optional) - Simplified development and deployment workflow

### **Offline Database**
- **WatermelonDB** or **Realm** - Powerful offline-first database solutions
- **SQLite** - Local storage backend
- **Async Storage** - Secure token and settings storage

### **Synchronization**
- **Background Sync** - Automatic data synchronization when online
- **Queue Management** - Reliable offline-to-online data transfer
- **Conflict Resolution** - Handle data conflicts during sync

### **Authentication & Security**
- **JWT Token Management** - Secure authentication with Django backend
- **Biometric Authentication** - Device-level security (Face ID, Touch ID)
- **Encrypted Storage** - Secure local data storage

### **Media & Camera**
- **React Native Image Picker** - Camera and gallery integration
- **Image Compression** - Optimize photos for bandwidth-constrained environments
- **Local File Management** - Secure photo storage and sync

### **Push Notifications**
- **Firebase Cloud Messaging (FCM)** - Real-time notifications
- **Background Tasks** - Handle notifications when app is closed

## 🗺️ Development Roadmap

## Phase 1: The Core Offline Form (MVP) 🚶

**Goal**: A field worker can open the app with no internet, fill out a complete referral form with photos, and save it securely on their device.

### ✅ Setup Tasks
- [ ] **Project Initialization**
  ```bash
  npx react-native init sNDaMobile --template react-native-template-typescript
  cd mobile/
  ```
- [ ] **Development Environment**
  - Configure ESLint, Prettier, and TypeScript
  - Set up debugging tools (Flipper, React Native Debugger)
  - Configure build scripts for iOS and Android

### 🗄️ Local Database
- [ ] **Database Integration**
  - Install and configure **WatermelonDB** or **Realm**
  - Design offline-first data models matching Django backend schema
  - Implement database migrations and schema versioning
  
- [ ] **Data Models**
  ```typescript
  // Core models for offline storage
  - Case (referral data)
  - Person (subject and associated people)
  - Media (photos and attachments)
  - SyncQueue (pending uploads)
  ```

### 📱 Referral Form UI
- [ ] **Form Components**
  - Multi-step referral form with validation
  - Responsive design for various screen sizes
  - Arabic/English language support with RTL layout
  
- [ ] **Camera Integration**
  - Photo capture with compression
  - Gallery selection
  - Image preview and management
  - Consent capture for media usage

### 💾 Offline Storage Logic
- [ ] **Data Persistence**
  - Save complete case objects with "queued" status
  - Store image files locally with secure paths
  - Implement data validation before storage
  - Handle storage quota management

---

## Phase 2: Synchronization & Volunteer Tasks 🏃

**Goal**: The app automatically syncs queued referrals to the main server when an internet connection becomes available. Logged-in volunteers can see their assigned cases.

### 🔐 Authentication
- [ ] **Login System**
  - Connect to Django backend `/api/token/` endpoint
  - Secure JWT token storage using Keychain (iOS) / Keystore (Android)
  - Biometric authentication for app access
  - Auto-refresh token mechanism

### 🔄 Sync Manager
- [ ] **Connection Monitoring**
  ```typescript
  // Sync service architecture
  - Network state detection
  - Periodic sync attempts
  - Retry logic with exponential backoff
  - Conflict resolution strategies
  ```

- [ ] **Data Synchronization**
  - Upload queued cases to `/api/cases/` endpoint
  - Handle partial uploads and resume capability
  - Mark local cases as "synced" on success
  - Error handling and user feedback

### 👥 Volunteer Case View
- [ ] **Case Management**
  - "My Cases" screen with assigned cases
  - Case details view with offline caching
  - Status updates and progress tracking
  - Search and filter functionality

---

## Phase 3: Advanced Features & Polish 🚀

**Goal**: Enhance the app with real-time updates and more interactive features for volunteers.

### 🔔 Push Notifications
- [ ] **Firebase Integration**
  - Configure FCM for iOS and Android
  - Handle notification permissions
  - Deep linking to specific cases
  - Notification categories (assignments, updates, reminders)

### 📝 Case Updates
- [ ] **Interactive Features**
  - Add notes and photos to assigned cases
  - Update case status and progress
  - Queue updates for offline sync
  - Real-time collaboration indicators

### 🔄 Background Sync
- [ ] **Background Tasks**
  - iOS Background App Refresh
  - Android Background Services
  - Scheduled sync operations
  - Battery optimization handling

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Native  │    │   Local Database │    │  Django Backend │
│   TypeScript    │◄──►│   WatermelonDB   │◄──►│   REST API      │
│   Components    │    │   SQLite         │    │   PostgreSQL    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Camera/Media  │    │   Sync Manager   │    │   Push Notifs   │
│   File Storage  │    │   Queue System   │    │   FCM Service   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔒 Security & Privacy

### **Data Protection**
- **Encryption at Rest**: Local database encryption
- **Secure Transmission**: HTTPS/TLS for all API calls
- **Token Security**: Secure storage of authentication tokens
- **Photo Privacy**: Consent management and secure photo handling

### **Compliance**
- **GDPR Compliance**: Data protection and user rights
- **Medical Privacy**: HIPAA-like protections for sensitive health data
- **Consent Management**: Clear consent flows for data collection and media

## 🌍 Internationalization

### **Multi-language Support**
- **Arabic**: Full RTL support with proper text rendering
- **English**: LTR layout with comprehensive translations
- **Extensible**: Framework for adding French, Swahili, and other languages

### **Cultural Adaptation**
- **Date/Time Formats**: Localized formatting
- **Number Formats**: Regional number and currency formatting
- **Cultural Sensitivity**: Appropriate UI patterns for different regions

## 🧪 Testing Strategy

### **Unit Testing**
- **Jest**: JavaScript/TypeScript testing framework
- **React Native Testing Library**: Component testing
- **Database Testing**: Local database operations

### **Integration Testing**
- **API Integration**: Backend connectivity testing
- **Sync Testing**: Offline-to-online data flow
- **Authentication Flow**: Login and token management

### **Device Testing**
- **iOS Testing**: iPhone and iPad compatibility
- **Android Testing**: Various Android devices and versions
- **Offline Testing**: Network disconnection scenarios

## 🚀 Getting Started

### **Prerequisites**
```bash
# Install React Native CLI
npm install -g react-native-cli

# iOS development (macOS only)
# Install Xcode from App Store
# Install CocoaPods
sudo gem install cocoapods

# Android development
# Install Android Studio
# Configure Android SDK and emulator
```

### **Development Setup**
```bash
# Clone the repository
git clone <repository-url>
cd mobile/

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📊 Success Metrics

### **Phase 1 Goals**
- [ ] **Offline Form Completion**: 100% form completion rate without internet
- [ ] **Data Integrity**: Zero data loss during offline storage
- [ ] **User Experience**: < 3 taps to complete basic referral

### **Phase 2 Goals**
- [ ] **Sync Reliability**: 99%+ successful sync rate when online
- [ ] **Authentication**: Secure login with biometric support
- [ ] **Case Management**: Volunteers can view and manage assigned cases

### **Phase 3 Goals**
- [ ] **Real-time Updates**: Push notifications with < 30 second delivery
- [ ] **Background Sync**: Automatic sync without user intervention
- [ ] **Advanced Features**: Case updates, media uploads, collaboration tools

## 🤝 Contributing

### **Development Guidelines**
- **TypeScript**: Strict typing for all components and services
- **Code Style**: ESLint and Prettier configuration
- **Git Workflow**: Feature branches with pull request reviews
- **Testing**: Comprehensive test coverage for critical paths

### **Architecture Decisions**
- **Offline-First**: All features must work without internet
- **Performance**: Optimize for low-end devices and slow networks
- **Accessibility**: Full accessibility support for all users
- **Security**: Security-first approach to data handling

---

**Built with ❤️ for communities worldwide**

*The sNDa mobile app brings the power of technology to the most challenging environments, ensuring that help can be documented and coordinated even when connectivity is limited.*