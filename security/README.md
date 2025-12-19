# Security Tools & Reports

This directory contains security scanning tools and vulnerability assessment reports for the Duat Action Flow project.

## 📁 Contents

- **`react2shell-scanner.js`** - Automated vulnerability scanner
- **`vulnerability-report.md`** - Detailed technical scan results
- **`SECURITY_AUDIT_SUMMARY.md`** - Executive summary and recommendations

## 🔍 React2Shell Vulnerability Scanner

### Overview

The React2Shell scanner is a comprehensive security tool designed to detect vulnerabilities in React/TypeScript applications, including:

- Cross-Site Scripting (XSS) vectors
- Code injection vulnerabilities
- Shell command injection risks
- Hardcoded secrets and API keys
- Unsafe DOM manipulation
- PostMessage vulnerabilities
- Cookie security issues
- URL parameter injection

### Quick Start

```bash
# Install dependencies (if needed)
npm install

# Run scanner on current directory
node security/react2shell-scanner.js .

# Run scanner on specific directory
node security/react2shell-scanner.js /path/to/your/project
```

### Output

The scanner generates two files:

1. **Terminal Output** - Real-time scan summary with color-coded severity levels
2. **vulnerability-report.md** - Detailed markdown report with:
   - File locations and line numbers
   - Code snippets
   - CWE references
   - Remediation guidance
   - Security best practices

### Exit Codes

- `0` - No critical vulnerabilities found
- `1` - Critical vulnerabilities detected

### CI/CD Integration

#### GitHub Actions Example

```yaml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Run React2Shell Scanner
        run: node security/react2shell-scanner.js .
        continue-on-error: false

      - name: Upload Security Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security/vulnerability-report.md
```

#### GitLab CI Example

```yaml
security-scan:
  stage: test
  script:
    - node security/react2shell-scanner.js .
  artifacts:
    paths:
      - security/vulnerability-report.md
    when: always
  allow_failure: false
```

## 📊 Latest Scan Results

**Last Scan:** December 19, 2025
**Files Scanned:** 80
**Overall Status:** ✅ PASS (No React2Shell vulnerabilities)

### Summary

- 🔴 Critical: 0 (excluding false positives)
- 🟠 High: 1 (API token exposure - requires action)
- 🟡 Medium: 3 (low risk, safe usage patterns)
- 🟢 Low: 0

**Key Finding:** One hardcoded API token detected in `scripts/generate-images.js` - requires immediate rotation and migration to environment variable.

See **SECURITY_AUDIT_SUMMARY.md** for complete details and recommendations.

## 🛡️ Vulnerability Types Detected

### Critical Severity

- `dangerouslySetInnerHTML` with user input (CWE-79)
- `eval()` usage (CWE-94)
- `Function()` constructor (CWE-94)
- Shell command execution (`exec`, `spawn`) (CWE-78)

### High Severity

- `innerHTML` assignment (CWE-79)
- `document.write()` usage (CWE-79)
- PostMessage without origin validation (CWE-346)
- Hardcoded API keys/secrets (CWE-798)

### Medium Severity

- `document.cookie` manipulation (CWE-522)
- `window.location` manipulation (CWE-601)
- Unsafe URL parameter usage (CWE-20)

### Low Severity

- `localStorage`/`sessionStorage` usage (CWE-922)

## 🔧 Customization

### Adding Custom Patterns

Edit `react2shell-scanner.js` and add patterns to the `vulnerabilityPatterns` object:

```javascript
const vulnerabilityPatterns = {
  critical: [
    {
      name: 'Your vulnerability name',
      pattern: /your-regex-pattern/g,
      severity: 'CRITICAL',
      description: 'Description of the vulnerability',
      cwe: 'CWE-XXX',
    },
    // ... more patterns
  ],
  // ... other severity levels
};
```

### Excluding Files/Directories

Modify the `skipDirectories` array:

```javascript
const skipDirectories = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  'your-custom-dir',
];
```

## 📚 Documentation

### Reports Guide

1. **vulnerability-report.md** - Technical report for developers
   - Contains code-level details
   - Includes CWE references
   - Provides specific remediation steps

2. **SECURITY_AUDIT_SUMMARY.md** - Executive summary for stakeholders
   - High-level risk assessment
   - Prioritized action items
   - Timeline recommendations
   - Business impact analysis

## 🚨 Responding to Findings

### Critical Vulnerabilities

1. Stop deployment immediately
2. Review finding details in report
3. Implement fix following recommendations
4. Re-run scanner to verify fix
5. Deploy patched version

### High/Medium Vulnerabilities

1. Create ticket/issue for tracking
2. Prioritize based on risk assessment
3. Schedule fix in next sprint/release
4. Document remediation

### False Positives

The scanner may flag patterns that are actually safe in context. Each finding should be:

1. Manually reviewed by a developer
2. Assessed for actual risk
3. Either fixed or documented as safe
4. Considered for scanner pattern refinement

## 🔐 Security Best Practices

### For React Development

1. **Avoid dangerouslySetInnerHTML**
   - Use JSX rendering instead
   - If needed, sanitize with DOMPurify

2. **Never use eval() or Function()**
   - Find alternative solutions
   - Use JSON.parse() for data parsing

3. **Validate all user inputs**
   - Use schema validation (Zod, Yup)
   - Sanitize before processing

4. **Keep dependencies updated**
   - Run `npm audit` regularly
   - Update vulnerable packages

### For Secrets Management

1. **Never commit secrets**
   - Use environment variables
   - Add .env to .gitignore
   - Use git-secrets tool

2. **Rotate exposed credentials**
   - Change immediately if exposed
   - Audit git history
   - Consider using vault solutions

## 📖 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP React Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/React_Security_Cheat_Sheet.html)
- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)
- [React Security Best Practices](https://react.dev/learn/security)

## 🤝 Contributing

To improve the scanner:

1. Test new patterns thoroughly
2. Minimize false positives
3. Add clear remediation guidance
4. Update documentation

## 📝 License

This security scanner is part of the Duat Action Flow project.

## 💡 Support

For questions or issues:
- Review the SECURITY_AUDIT_SUMMARY.md
- Check vulnerability-report.md for details
- Consult the OWASP resources linked above

---

**Remember:** Security is an ongoing process, not a one-time check. Run this scanner regularly as part of your development workflow.
