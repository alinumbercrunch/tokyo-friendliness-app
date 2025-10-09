# Git Workflow & Conventions

## Commit Message Format

### Structure

```
type(scope): description

```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Build system changes
- **ci**: CI/CD changes
- **chore**: Maintenance tasks

### Commit Examples

#### Simple Commits

```bash
# ✅ GOOD
feat(auth): add login form validation
fix(api): handle network timeout errors
docs(readme): update installation instructions
style(components): fix eslint warnings
refactor(hooks): simplify useAuth implementation
test(utils): add validation function tests
perf(dashboard): optimize data fetching
build(deps): update react to v18
ci(github): add automated testing workflow
chore(cleanup): remove unused dependencies

# ❌ BAD
fixed bug
updated stuff
WIP
asdf
merge conflict resolved
```

### Commit Rules

1. **Use imperative mood**: "add" not "added" or "adds"
2. **Limit first line to 72 characters**
3. **No period at the end of description**

### Breaking Changes

```bash
feat(api): change user endpoint response format

```

## Branch Naming Rules

### Branch Types

```
feature/    - New features
bugfix/     - Bug fixes
hotfix/     - Critical fixes for production
release/    - Release preparation
docs/       - Documentation updates
refactor/   - Code refactoring
test/       - Adding tests
chore/      - Maintenance tasks
```

### Naming Convention

```bash
# Format: type/short-description
type/short-description

# With issue number: type/issue-number-short-description
type/issue-number-short-description
```

### Branch Examples

```bash
# ✅ GOOD
feature/user-authentication
feature/123-add-login-form
feature/456-google-oauth-integration

bugfix/fix-memory-leak
bugfix/789-handle-network-errors
bugfix/101-form-validation-issues

hotfix/security-vulnerability
hotfix/critical-payment-bug

release/v2.1.0
release/v1.5.0-beta

docs/update-api-documentation
docs/add-contributing-guide

refactor/simplify-auth-logic
refactor/extract-api-client

test/add-component-tests
test/e2e-login-flow

chore/update-dependencies
chore/cleanup-unused-files

# ❌ BAD
new-feature
fix
john-branch
test
update
my-awesome-feature
temp-branch
```

## Git Workflow

### Feature Development Workflow

```bash
# 1. Start from main/dev branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/123-user-profile

# 3. Make commits following conventions
git add .
git commit -m "feat(profile): add user profile component"

# 4. Push branch and create PR
git push origin feature/123-user-profile
# Create Pull Request via GitHub/GitLab interface

# 5. After review and merge, clean up
git checkout main
git pull origin main
git branch -d feature/123-user-profile

# 6. Optional: Clean up remote branch
git push origin --delete feature/123-user-profile
```

### Hotfix Workflow

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# 2. Fix the issue
# ... make changes
git add .
git commit -m "fix(security): patch XSS vulnerability"

# 3. Push and create urgent PR
git push origin hotfix/critical-security-fix
# Create PR with "urgent" label

# 4. After merge, tag the release
git checkout main
git pull origin main
git tag v1.2.3
git push origin v1.2.3

# 5. Clean up
git branch -d hotfix/critical-security-fix
```

### Release Workflow

```bash
# 1. Create release branch from dev
git checkout dev
git pull origin dev
git checkout -b release/v2.0.0

# 2. Prepare release (update versions, changelog, etc.)
npm version minor  # Updates package.json
git add .
git commit -m "chore(release): prepare v2.0.0"

# 3. Create PR to main
git push origin release/v2.0.0
# Create PR: release/v2.0.0 → main
```
