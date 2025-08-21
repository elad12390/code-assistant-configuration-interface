# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions of CACI (Code Assistant Configuration Interface):

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously and appreciate your help in making CACI (Code Assistant Configuration Interface) safe for everyone.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities to us via one of the following methods:

1. **Email**: Send details to [eladbenhaim@gmail.com](mailto:eladbenhaim@gmail.com)
2. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature

### What to Include

When reporting a vulnerability, please include as much of the following information as possible:

- A description of the vulnerability and its potential impact
- Steps to reproduce the vulnerability
- Affected versions
- Any possible mitigations or workarounds
- Your contact information for follow-up questions

### Response Timeline

We will respond to your report within **48 hours** and aim to provide regular updates every **72 hours** until the issue is resolved.

Our typical response process:

1. **Acknowledgment** (within 48 hours)
2. **Investigation** (within 7 days)
3. **Fix development** (timeline varies based on complexity)
4. **Testing and validation** (within 3 days of fix)
5. **Release and disclosure** (coordinated with reporter)

## Security Measures

### Current Security Measures

- **Dependency Scanning**: Automated vulnerability scanning of all dependencies
- **Code Analysis**: Static analysis for security vulnerabilities
- **Secret Scanning**: Automated detection of accidentally committed secrets
- **Container Security**: Docker image vulnerability scanning
- **License Compliance**: Verification of dependency licenses

### Secure Development Practices

- **Code Reviews**: All code changes require review before merge
- **Automated Testing**: Comprehensive test suite including security tests
- **Minimal Dependencies**: We keep dependencies to a minimum and regularly audit them
- **Principle of Least Privilege**: Applications and containers run with minimal required permissions

### Data Handling

CACI (Code Assistant Configuration Interface):

- **No Data Collection**: We do not collect personal data or usage analytics
- **Local Processing**: All analysis is performed locally on your machine
- **API Keys**: When API keys are used, they are processed locally and not stored
- **File Access**: Only reads configuration files you specify

## Scope

This security policy applies to:

- The main CACI CLI tool
- Official Docker images
- Official NPM packages
- Documentation and examples

## Out of Scope

The following are outside the scope of our security policy:

- Vulnerabilities in third-party dependencies (please report these to the respective maintainers)
- Issues requiring physical access to a machine
- Social engineering attacks
- Issues in development or test environments

## Security Best Practices for Users

To use CACI securely:

### For API Keys

- **Environment Variables**: Store API keys in environment variables, not in code
- **File Permissions**: Ensure configuration files have appropriate permissions
- **Key Rotation**: Regularly rotate API keys
- **Monitoring**: Monitor API key usage for unexpected activity

### For Installation

- **Verify Checksums**: Verify package checksums when installing
- **Use Official Sources**: Only install from official NPM or GitHub releases
- **Keep Updated**: Regularly update to the latest version
- **Scan Dependencies**: Regularly audit your project dependencies

### For Usage

- **Review Output**: Review generated configurations before applying them
- **Backup Configurations**: Keep backups of important configuration files
- **Validate Inputs**: Be cautious with configuration files from untrusted sources

## Security Updates

Security updates are released as:

1. **Patch releases** (1.0.x) for backward-compatible security fixes
2. **Minor releases** (1.x.0) for security fixes requiring minor changes
3. **Major releases** (x.0.0) for security fixes requiring breaking changes

All security updates are:

- Released as soon as possible after a fix is validated
- Announced in the GitHub releases
- Documented in the changelog
- Tagged with security labels

## Acknowledgments

We appreciate security researchers and users who help make CACI more secure. Contributors who report valid security vulnerabilities will be acknowledged in our release notes (unless they prefer to remain anonymous).

## Contact

For any questions about this security policy, please contact:

- **Email**: [eladbenhaim@gmail.com](mailto:eladbenhaim@gmail.com)
- **GitHub Issues**: For non-security related questions only

---

*This security policy is effective as of [Current Date] and may be updated from time to time.*