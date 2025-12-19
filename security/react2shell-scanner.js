#!/usr/bin/env node

/**
 * React2Shell Vulnerability Scanner
 *
 * Scans React/TypeScript codebases for potential React2Shell vulnerabilities including:
 * - XSS vectors (dangerouslySetInnerHTML, eval, innerHTML)
 * - Shell command injection vulnerabilities
 * - Unsafe user input handling
 * - API key exposure
 * - PostMessage vulnerabilities
 * - Cookie manipulation issues
 * - URL parameter injection
 *
 * Usage: node react2shell-scanner.js [directory]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Vulnerability patterns to scan for
const vulnerabilityPatterns = {
  critical: [
    {
      name: 'dangerouslySetInnerHTML with user input',
      pattern: /dangerouslySetInnerHTML\s*=\s*\{\{/g,
      severity: 'CRITICAL',
      description: 'Using dangerouslySetInnerHTML can lead to XSS if user input is not properly sanitized',
      cwe: 'CWE-79',
    },
    {
      name: 'eval() usage',
      pattern: /\beval\s*\(/g,
      severity: 'CRITICAL',
      description: 'eval() can execute arbitrary code and is extremely dangerous with user input',
      cwe: 'CWE-94',
    },
    {
      name: 'Function constructor',
      pattern: /new\s+Function\s*\(/g,
      severity: 'CRITICAL',
      description: 'Function constructor can execute arbitrary code similar to eval()',
      cwe: 'CWE-94',
    },
    {
      name: 'Shell command execution',
      pattern: /\b(exec|execSync|spawn|execFile|execFileSync)\s*\(/g,
      severity: 'CRITICAL',
      description: 'Direct shell command execution can lead to command injection',
      cwe: 'CWE-78',
    },
  ],
  high: [
    {
      name: 'innerHTML assignment',
      pattern: /\.innerHTML\s*=/g,
      severity: 'HIGH',
      description: 'Direct innerHTML assignment can lead to XSS vulnerabilities',
      cwe: 'CWE-79',
    },
    {
      name: 'document.write usage',
      pattern: /document\.write\s*\(/g,
      severity: 'HIGH',
      description: 'document.write can be exploited for XSS attacks',
      cwe: 'CWE-79',
    },
    {
      name: 'PostMessage without origin validation',
      pattern: /postMessage\s*\(/g,
      severity: 'HIGH',
      description: 'PostMessage without proper origin validation can lead to security issues',
      cwe: 'CWE-346',
    },
    {
      name: 'API keys or tokens in code',
      pattern: /(api[_-]?key|api[_-]?token|secret|password)\s*=\s*["'][a-zA-Z0-9]{20,}["']/gi,
      severity: 'HIGH',
      description: 'Hardcoded API keys or secrets should be moved to environment variables',
      cwe: 'CWE-798',
    },
  ],
  medium: [
    {
      name: 'document.cookie access',
      pattern: /document\.cookie/g,
      severity: 'MEDIUM',
      description: 'Direct cookie manipulation should be reviewed for security implications',
      cwe: 'CWE-522',
    },
    {
      name: 'window.location manipulation',
      pattern: /window\.location\s*=|document\.location\s*=/g,
      severity: 'MEDIUM',
      description: 'Direct location manipulation with user input can lead to open redirects',
      cwe: 'CWE-601',
    },
    {
      name: 'Unsafe URL parameter usage',
      pattern: /new\s+URLSearchParams\s*\(|\.searchParams|location\.search|location\.hash/g,
      severity: 'MEDIUM',
      description: 'URL parameters should be validated before use',
      cwe: 'CWE-20',
    },
  ],
  low: [
    {
      name: 'localStorage/sessionStorage usage',
      pattern: /\b(localStorage|sessionStorage)\./g,
      severity: 'LOW',
      description: 'Storage APIs can expose sensitive data; ensure proper validation',
      cwe: 'CWE-922',
    },
  ],
};

// File extensions to scan
const scanExtensions = ['.tsx', '.ts', '.jsx', '.js'];

// Directories to skip
const skipDirectories = ['node_modules', 'dist', 'build', '.git', 'coverage'];

class VulnerabilityScanner {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.findings = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };
    this.filesScanned = 0;
  }

  log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      // Scan all patterns
      Object.entries(vulnerabilityPatterns).forEach(([severity, patterns]) => {
        patterns.forEach((patternConfig) => {
          const regex = new RegExp(patternConfig.pattern);

          lines.forEach((line, lineIndex) => {
            if (regex.test(line)) {
              this.findings[severity].push({
                file: path.relative(this.rootDir, filePath),
                line: lineIndex + 1,
                code: line.trim(),
                ...patternConfig,
              });
            }
          });
        });
      });

      this.filesScanned++;
    } catch (error) {
      this.log(`Error scanning ${filePath}: ${error.message}`, colors.red);
    }
  }

  scanDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (!skipDirectories.includes(entry.name)) {
            this.scanDirectory(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (scanExtensions.includes(ext)) {
            this.scanFile(fullPath);
          }
        }
      });
    } catch (error) {
      this.log(`Error scanning directory ${dir}: ${error.message}`, colors.red);
    }
  }

  generateReport() {
    const reportPath = path.join(this.rootDir, 'security', 'vulnerability-report.md');
    const reportDir = path.dirname(reportPath);

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    let report = '# React2Shell Vulnerability Scan Report\n\n';
    report += `**Scan Date:** ${new Date().toISOString()}\n\n`;
    report += `**Files Scanned:** ${this.filesScanned}\n\n`;

    const totalFindings =
      this.findings.critical.length +
      this.findings.high.length +
      this.findings.medium.length +
      this.findings.low.length;

    report += `**Total Findings:** ${totalFindings}\n\n`;
    report += '## Summary\n\n';
    report += `- 🔴 Critical: ${this.findings.critical.length}\n`;
    report += `- 🟠 High: ${this.findings.high.length}\n`;
    report += `- 🟡 Medium: ${this.findings.medium.length}\n`;
    report += `- 🟢 Low: ${this.findings.low.length}\n\n`;

    // Generate detailed findings
    ['critical', 'high', 'medium', 'low'].forEach((severity) => {
      const findings = this.findings[severity];
      if (findings.length > 0) {
        const emoji = {
          critical: '🔴',
          high: '🟠',
          medium: '🟡',
          low: '🟢',
        }[severity];

        report += `\n## ${emoji} ${severity.toUpperCase()} Severity Issues\n\n`;

        findings.forEach((finding, index) => {
          report += `### ${index + 1}. ${finding.name}\n\n`;
          report += `**File:** \`${finding.file}:${finding.line}\`\n\n`;
          report += `**Severity:** ${finding.severity}\n\n`;
          report += `**CWE:** [${finding.cwe}](https://cwe.mitre.org/data/definitions/${finding.cwe.split('-')[1]}.html)\n\n`;
          report += `**Description:** ${finding.description}\n\n`;
          report += '**Code:**\n```javascript\n';
          report += finding.code + '\n';
          report += '```\n\n';
          report += '**Recommendation:**\n';

          // Add specific recommendations based on vulnerability type
          if (finding.name.includes('dangerouslySetInnerHTML')) {
            report += '- Avoid using dangerouslySetInnerHTML if possible\n';
            report += '- If necessary, sanitize all user input with DOMPurify or similar library\n';
            report += '- Use React\'s built-in JSX rendering which auto-escapes content\n';
          } else if (finding.name.includes('eval') || finding.name.includes('Function constructor')) {
            report += '- Never use eval() or Function constructor with user input\n';
            report += '- Find alternative approaches that don\'t require dynamic code execution\n';
          } else if (finding.name.includes('Shell command')) {
            report += '- Validate and sanitize all inputs before passing to shell commands\n';
            report += '- Use parameterized commands or libraries that prevent injection\n';
            report += '- Consider using Node.js APIs instead of shell commands\n';
          } else if (finding.name.includes('API key')) {
            report += '- Move all secrets to environment variables\n';
            report += '- Use .env files that are not committed to version control\n';
            report += '- Rotate any exposed credentials immediately\n';
          } else if (finding.name.includes('innerHTML')) {
            report += '- Use textContent or React\'s JSX instead of innerHTML\n';
            report += '- If HTML rendering is required, sanitize with DOMPurify\n';
          } else {
            report += '- Review this code for potential security implications\n';
            report += '- Validate and sanitize all user inputs\n';
            report += '- Follow security best practices for this pattern\n';
          }

          report += '\n---\n\n';
        });
      }
    });

    // Add general recommendations
    report += '\n## General Security Recommendations\n\n';
    report += '1. **Input Validation:** Always validate and sanitize user inputs before processing\n';
    report += '2. **Output Encoding:** Properly encode outputs based on context (HTML, JavaScript, URL)\n';
    report += '3. **Secrets Management:** Never hardcode secrets; use environment variables\n';
    report += '4. **Dependency Updates:** Keep all dependencies updated to patch known vulnerabilities\n';
    report += '5. **Security Headers:** Implement proper Content Security Policy (CSP) headers\n';
    report += '6. **HTTPS Only:** Ensure all connections use HTTPS in production\n';
    report += '7. **Regular Audits:** Run security scans regularly as part of CI/CD pipeline\n\n';

    report += '## Resources\n\n';
    report += '- [OWASP Top 10](https://owasp.org/www-project-top-ten/)\n';
    report += '- [React Security Best Practices](https://react.dev/learn/security)\n';
    report += '- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)\n';
    report += '- [OWASP React Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/React_Security_Cheat_Sheet.html)\n';

    fs.writeFileSync(reportPath, report, 'utf-8');
    return reportPath;
  }

  printSummary() {
    this.log('\n' + '='.repeat(70), colors.bold);
    this.log('React2Shell Vulnerability Scan Complete', colors.bold + colors.cyan);
    this.log('='.repeat(70), colors.bold);

    this.log(`\nFiles Scanned: ${this.filesScanned}`, colors.blue);

    const totalFindings =
      this.findings.critical.length +
      this.findings.high.length +
      this.findings.medium.length +
      this.findings.low.length;

    this.log(`\nTotal Findings: ${totalFindings}`, colors.bold);

    if (this.findings.critical.length > 0) {
      this.log(`  🔴 Critical: ${this.findings.critical.length}`, colors.red);
    }
    if (this.findings.high.length > 0) {
      this.log(`  🟠 High: ${this.findings.high.length}`, colors.yellow);
    }
    if (this.findings.medium.length > 0) {
      this.log(`  🟡 Medium: ${this.findings.medium.length}`, colors.yellow);
    }
    if (this.findings.low.length > 0) {
      this.log(`  🟢 Low: ${this.findings.low.length}`, colors.green);
    }

    if (totalFindings === 0) {
      this.log('\n✅ No vulnerabilities detected!', colors.green);
    } else {
      this.log('\n⚠️  Vulnerabilities detected. Review the report for details.', colors.yellow);
    }

    this.log('\n' + '='.repeat(70), colors.bold);
  }

  run() {
    this.log('\n🔍 Starting React2Shell vulnerability scan...', colors.cyan);
    this.log(`📁 Scanning directory: ${this.rootDir}\n`, colors.blue);

    this.scanDirectory(this.rootDir);

    const reportPath = this.generateReport();

    this.printSummary();
    this.log(`\n📄 Detailed report generated: ${reportPath}`, colors.green);
    this.log('\n');

    // Return exit code based on findings
    return this.findings.critical.length > 0 ? 1 : 0;
  }
}

// Main execution
const targetDir = process.argv[2] || process.cwd();

if (!fs.existsSync(targetDir)) {
  console.error(`Error: Directory ${targetDir} does not exist`);
  process.exit(1);
}

const scanner = new VulnerabilityScanner(targetDir);
const exitCode = scanner.run();

process.exit(exitCode);
