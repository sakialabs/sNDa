# 🔒 Security Policy

## Reporting Security Vulnerabilities

**Please do not report security vulnerabilities through public GitHub issues.**

### How to Report

- **Email**: <snda@hey.com>
- **Subject**: "Security Vulnerability Report"
- **Include**: 
  - Description of the vulnerability
  - Steps to reproduce
  - Potential impact
  - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Resolution Timeline**: Depends on severity
- **Credit**: Public acknowledgment (if desired)

## Security Measures

### Data Protection

- **Encryption**: All data encrypted in transit (HTTPS/TLS)
- **Authentication**: JWT-based secure authentication
- **Database**: Encrypted at rest on production
- **File Storage**: Secure media handling with consent tracking

### Privacy

- **GDPR Compliant**: User data rights and protection
- **Consent Management**: Clear consent flows for all data collection
- **Data Minimization**: Only collect necessary information
- **Right to Deletion**: Users can request data removal

### Infrastructure

- **Production Hardening**: Security headers, CORS, rate limiting
- **Environment Isolation**: Separate dev/staging/production
- **Dependency Scanning**: Regular security updates
- **Access Control**: Principle of least privilege

## Supported Versions

| Version | Supported |
|---------|-----------|
| v0.4.x  | ✅ Yes    |
| v0.3.x  | ⚠️ Limited |
| < v0.3  | ❌ No     |

## Security Best Practices

### For Contributors

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Follow secure coding practices
- Test for common vulnerabilities (XSS, CSRF, SQL injection)

### For Users

- Use strong, unique passwords
- Enable two-factor authentication when available
- Keep your browser updated
- Report suspicious activity

---

**Security is everyone's responsibility. Thank you for helping keep sNDa safe.**
