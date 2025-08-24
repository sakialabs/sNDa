# 📦 sNDa Changelog

All notable changes to this project will be documented in this file.

## v0.3.1 - Deployments, i18n, Boba, and UX

- 🚀 Full-Stack Deployment: Frontend on Netlify (https://snda.netlify.app). Backend API deployed with environment configuration (SendGrid, Redis, Celery workers) and production hardening
- 🔔 Boba Notifications: Streak reminders, badge celebrations, and gentle assignment nudges across email and in-app surfaces
- 🌍 Arabic i18n: App-wide Arabic version with RTL support, localized routes (`/[locale]/*`), and translated UI strings (`frontend/messages/ar.json`)
- 📄 New Pages & Sections: Added public pages and dashboard sections to improve discoverability and impact storytelling
- ✨ UI Enhancements: Navigation polish, consistent animations, improved readability and contrast, better empty/loading states, and accessibility tweaks
- 🧪 Stability: Type safety, lint/build checks green; smoke tests for donation flow, stories, and dashboards

## v0.3.0 - Magnetic Community Platform

- 🏆 Complete Gamification System: Badges, streaks, points, and community goals
- 🌟 Community Page: Wall of Love showcasing volunteer stories and collective impact
- 📊 Enhanced Volunteer Dashboard: Personal stats, badges, and streak tracking
- 🤖 Boba AI Assistant: Smart recommendations and personalized notifications
- 📧 Email Onboarding System: 3-step sequence with beautiful HTML templates
- 🎯 Community Goals: Shared milestones for collective motivation
- 🏅 Achievement System: Automatic badge awarding via Django signals
- 📈 Impact Tracking: Comprehensive activity logging and analytics

## v0.2.0 - Enhanced UX & Community Features

- ✨ Unified Loading Experience: Beautiful skeleton components with shimmer animations
- 🎯 Improved Toast Notifications: Top-center positioning for better visibility
- 📖 Volunteer Story Sharing: Rich media upload, link sharing, and community engagement
- 💰 Comprehensive Donor Platform: Stripe integration with campaign management
- 🎨 Enhanced Design System: Smooth animations and responsive layouts
- 🧭 Advanced Coordinator Tools: Real-time filtering and enhanced case management
