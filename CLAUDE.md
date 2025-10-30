# CLAUDE.md - Enhanced System Instructions

**Project**: E-commerce Backend (Node.js/TypeScript)
**Architecture**: Enterprise-level with Factory/Repository/Service patterns
**Validation**: Enhanced CAGEERF methodology with 4-phase checkpoints

## Core Communication Principles

- **Extreme Concision**: Sacrifice grammar for brevity in all interactions and commits
- **Action-First**: Start with the most direct approach, iterate based on feedback
- **Context-Aware**: Use existing project patterns and architectural decisions

## Enhanced Development Workflow

### Development Commands
```bash
# Primary development workflow
npx tsx watch server.ts      # Development with hot reload (recommended)
npm start                    # Production build (port 3055)

# Code quality
npx eslint .                 # Lint all files
npm test                     # Tests (when implemented)

# Database
docker-compose up           # MongoDB development environment
```

### CAGEERF Validation Checkpoints

**CHECKPOINT 1: Context Validation**
- Verify architectural patterns align with enterprise design
- Confirm TypeScript strict mode compliance
- Validate security requirements for auth systems

**CHECKPOINT 2: Progressive Edit Validation**
- Run ESLint after each file change
- Verify TypeScript compilation (noEmit: true)
- Check MongoDB model consistency

**CHECKPOINT 3: Integration Validation**
- Test service layer integration
- Verify API endpoint functionality
- Validate authentication/authorization flows

**CHECKPOINT 4: Completion Validation**
- Full system integration test
- Performance benchmark verification
- Security audit completion

## Technology Stack & Constraints

### Approved Technologies
- **Runtime**: Node.js with TypeScript strict mode
- **Framework**: Express.js 5.x with helmet middleware
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT with bcrypt password hashing
- **Security**: CORS, compression, helmet security headers

### Prohibited Patterns
- No hardcoded secrets or API keys
- No disabled TypeScript strict rules
- No direct database access from controllers
- No synchronous I/O operations
- No console.log for production debugging

### Performance Requirements
- **Memory**: < 512MB for typical operations
- **Response Time**: < 200ms for API calls
- **Bundle Size**: Optimized for server deployment
- **Database Connections**: Connection pooling required

## Architectural Standards

### Layer Architecture (Strict Enforcement)
```
Controllers (src/controllers/) → Services (src/services/) → Repositories (src/models/repositories/) → Models (src/models/)
```

### Design Patterns (Required Usage)
- **Factory Pattern**: Product types (ProductFactory in product-service.ts:94-116)
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Static business logic methods
- **Middleware Pattern**: Authentication and validation

### Naming Conventions
- **Files**: kebab-case (e.g., product-service.ts)
- **Classes**: PascalCase (e.g., ProductService)
- **Functions**: camelCase with descriptive names
- **Constants**: UPPER_SNAKE_CASE
- **Models**: Schema suffix (e.g., ShopModel)

## Code Quality Standards

### Required Metrics
- **Cyclomatic Complexity**: < 10 per function
- **Function Length**: < 50 lines
- **File Length**: < 300 lines (prefer < 200)
- **Test Coverage**: > 80% (when tests implemented)

### TypeScript Requirements
- Strict mode enabled (no exceptions)
- All functions must have return types
- Use `Types.ObjectId` for MongoDB IDs
- Prefer `interface` over `type` for object shapes
- Use `readonly` for immutable data

### Error Handling Standards
- Custom error classes extending `ErrorResponse`
- Global error middleware with consistent format
- HTTP status codes from `http-status-codes`
- Never expose internal error details to clients

## Security Requirements

### Authentication (Multi-Layer System)
1. **API Key Validation**: All endpoints require `x-api-key` header
2. **Permission System**: Role-based access control
3. **JWT Authentication**: Access tokens with refresh rotation
4. **Token Security**: Per-user secret keys

### Required Headers
- `x-api-key`: API key validation
- `x-client-id`: User identifier
- `authorization`: Bearer access token
- `refreshtoken`: Token rotation

### Security Best Practices
- Input validation and sanitization
- Parameterized queries (Mongoose handles this)
- Rate limiting for API endpoints
- Never log sensitive data
- Regular dependency updates

## Testing Strategy

### Current Status
- **Tests**: Not implemented (placeholder in package.json)
- **Front-end**: Playwright MCP for UI testing
- **Backend**: Manual testing via API calls

### When Tests Are Added
- Unit tests for service layer business logic
- Integration tests for API endpoints
- Security tests for authentication flows
- Performance tests for database operations

## Documentation Requirements

### Code Documentation
- Inline comments for complex business logic
- JSDoc for public methods and interfaces
- README with setup and deployment instructions
- API documentation for all endpoints

### Project Documentation
- Architecture decision records (ADRs)
- Database schema documentation
- Security flow diagrams
- Deployment runbooks

## Git Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature development
- `hotfix/*`: Emergency production fixes

### Commit Standards
- Extreme concision: "fix auth" not "fix authentication bug in access service"
- Conventional commits: `type(scope): description`
- Sign commits for sensitive changes
- Include PR references when applicable

### Code Review Process
- All changes require review before merge
- Automated checks must pass (lint, build)
- Security review for auth-related changes
- Performance review for database operations

## Tool Integration Standards

### Required MCP Usage
- **Context7**: Always pull latest documentation for new dependencies
- **Playwright**: Use for front-end testing and screenshots
- **Code Reviewer**: Agent review after feature completion (Critical/High priority first)

### Development Tools
- **ESLint**: Code quality enforcement
- **TypeScript**: Static type checking (strict mode)
- **Docker**: Local MongoDB environment
- **Environment Variables**: All configuration via .env

## Emergency Protocols

### Severity Levels
- **Critical**: Production downtime, security breach
- **High**: Broken core functionality, data corruption risk
- **Medium**: Feature broken, performance degradation
- **Low**: UI issues, documentation gaps

### Response Procedures
- **Critical**: Immediate fix, hotfix branch, direct deploy
- **High**: Next available release with thorough testing
- **Medium**: Normal release cycle with proper testing
- **Low**: Backlog priority, address in future iteration

## Innovation Guidelines

### Experimental Features
- Use feature flags for new functionality
- A/B test major changes before full rollout
- Document experiments and results
- Roll back quickly if metrics degrade

### Technology Evolution
- Evaluate new dependencies quarterly
- Prefer established libraries over cutting-edge
- Consider migration paths for major upgrades
- Maintain backward compatibility when possible

## Project-Specific Rules

### E-commerce Domain Specifics
- **Products**: Factory pattern for extensible product types
- **Inventory**: Real-time stock management
- **Authentication**: Multi-layer security required
- **API Design**: RESTful with consistent response format

### Database Patterns
- **Shop-based Data Isolation**: All data scoped to shop
- **Text Indexing**: Product search functionality
- **Draft/Published Workflow**: Product lifecycle management
- **Automatic Slug Generation**: SEO-friendly URLs

## Context Memory Integration

### Session Management
- Track conversation context across multiple interactions
- Reference previous decisions and architectural choices
- Maintain awareness of current development phase
- Remember user preferences and constraints

### Project State Awareness
- Current branch and recent commits context
- Understanding of implemented features
- Knowledge of known issues or limitations
- Awareness of upcoming changes or priorities