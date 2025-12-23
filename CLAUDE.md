# CLAUDE.md - Enhanced System Instructions

**Project**: E-commerce Backend (Node.js/TypeScript)
**Architecture**: Enterprise-level with Factory/Repository/Service patterns
**Validation**: Enhanced CAGEERF methodology with 4-phase checkpoints

## Core Principles & Rules

- **Principles**: **YAGNI** (You Aren't Gonna Need It) - **KISS** (Keep It Simple, Stupid) - **DRY** (Don't Repeat Yourself)
- **Primary Reference**: Follow strict workflows in `.claude/workflows/`:
    - `development-rules.md`: Coding standards, file naming, and constraints.
    - `primary-workflow.md`: The 5-step process (Implementation -> Testing -> Quality -> Integration -> Debugging).
    - `documentation-management.md`: Rules for plans, roadmaps, and changelogs.
    - `orchestration-protocol.md`: Agent coordination guidelines.

## Development Workflow

### 1. Preparation & Planning
- **Skills/Commands**: Run `python .claude/scripts/generate_catalogs.py --skills` and `--commands` to activate relevant tools.
- **Planning**: Use `planner` agent to create detailed plans in `plans/` directory (see `documentation-management.md`).
    - Use `researcher` agents for exploring technical topics.
    - Format plans with timestamp: `plans/YYMMDD-HHMM-slug/`.

### 2. Implementation Loop (Primary Workflow)
1.  **Code**: Implement features using clean, maintainable code.
    - **No Simulation**: Always implement real code, no mocks unless strictly necessary for tests.
    - **File Naming**: Descriptive `kebab-case` (self-documenting for LLMs).
    - **File Size**: Keep under 200 lines; modularize using composition and service classes.
    - **Compile Check**: Always check for compile errors after changes.
2.  **Test**: Delegate to `tester` agent.
    - **Strictness**: DO NOT ignore failing tests. Fix them before proceeding.
    - **Coverage**: Maintain high coverage (> 80%).
3.  **Review**: Delegate to `code-reviewer` agent after implementation.
4.  **Integration**: Delegate to `docs-manager` to update `docs/` (Roadmap, Changelog, Standards).

### 3. Debugging & Maintenance
- **Bug Reports**: Delegate to `debugger` agent to analyze, then fix, then `tester` to verify.
- **Tools**:
    - `npx tsx watch server.ts` (Dev)
    - `npx eslint .` (Lint)
    - `docker-compose up` (DB)

## CAGEERF Validation Checkpoints

**CHECKPOINT 1: Context & Plan**
- Verify architectural alignment (Factory/Repository/Service).
- Confirm plan exists in `plans/` with clear steps.

**CHECKPOINT 2: Implementation & Quality**
- **Strict Mode**: No disabled TypeScript rules.
- **Security**: Validate auth flows, no hardcoded secrets.
- **Agent Review**: Pass `code-reviewer` checks.

**CHECKPOINT 3: Integration & Testing**
- **Tests**: Service logic unit tests, API integration tests.
- **Performance**: < 200ms API response, connection pooling.

**CHECKPOINT 4: Completion & Docs**
- **Docs**: `docs-manager` updated Roadmap, Changelog, and Architecture.
- **Final Polish**: `tester` confirms all green.

## Technology Stack & Constraints

### Approved Technologies
- **Runtime**: Node.js with TypeScript strict mode
- **Framework**: Express.js 5.x with helmet middleware
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT with bcrypt password hashing
- **Security**: CORS, compression, helmet security headers

### Architectural Standards (Strict Enforcement)
```
Controllers (src/controllers/) → Services (src/services/) → Repositories (src/models/repositories/) → Models (src/models/)
```
- **Factory Pattern**: Required for Product types.
- **Repository Pattern**: Required for data access.
- **Service Layer**: Static business logic methods.
- **Middleware Pattern**: Authentication and validation.

### Code Quality Standards
- **Cyclomatic Complexity**: < 10 per function
- **Function Length**: < 50 lines
- **File Length**: < 200 lines (preferred) / < 300 (max)
- **Naming**: `kebab-case` files, `PascalCase` classes, `camelCase` functions.

## Security Requirements

### Authentication (Multi-Layer System)
1. **API Key Validation**: `x-api-key` header
2. **Permission System**: Role-based access control
3. **JWT Authentication**: Access tokens with refresh rotation
4. **Token Security**: Per-user secret keys

### Best Practices
- **Headers**: `x-api-key`, `x-client-id`, `authorization`, `refreshtoken`
- **Sanitization**: Input validation, parameterized queries.
- **No Logs**: Never log sensitive data.

## Documentation Requirements

### Source of Truth: `docs/`
- **Roadmap**: `docs/development-roadmap.md`
- **Changelog**: `docs/project-changelog.md`
- **Architecture**: `docs/system-architecture.md`
- **Standards**: `docs/code-standards.md`

### Updates
- **Automatic**: `project-manager` / `docs-manager` MUST update these on status changes.
- **Plan Location**: `plans/` with detailed phase files (see `documentation-management.md`).

## Git Workflow

### Branch Strategy
- `main`: Production
- `develop`: Integration
- `feature/*`: Features
- `hotfix/*`: Emergency fixes

### Commit Standards
- **Pre-commit**: Linting must pass.
- **Pre-push**: Tests must pass.
- **Message**: Conventional commits (`type(scope): description`). No AI references.
- **Privacy**: NO secrets in commits.

## Project-Specific Rules

### E-commerce Domain
- **Products**: Factory pattern for extensible types.
- **Inventory**: Real-time management.
- **Shops**: Data isolation per shop.

### Emergency Protocols
- **Critical**: Immediate fix, hotfix branch.
- **High/Medium**: Prioritized release.
