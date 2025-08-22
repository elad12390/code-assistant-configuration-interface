## Feature Request: Predefined Workflows Installation

### Description
Add the ability to install predefined workflow bundles with a single command. Users want to quickly install proven workflow configurations without manually selecting individual components.

### Supported Workflows

#### 1. BMad-Method Workflow
Complete BMad (Business Method for Agile Development) setup including:
- **Agents**: PM, PO, Architect, Developer, QA, Analyst
- **Commands**: Story creation, documentation generation, project planning
- **Templates**: PRD, architecture docs, user stories
- **CLAUDE.md**: BMad-specific instructions and conventions

#### 2. Claude Standard Workflow
Optimized Claude Code configuration including:
- **Agents**: Code reviewer, documentation writer, test generator
- **Commands**: Common development tasks
- **Hooks**: Pre-commit, post-update validations
- **CLAUDE.md**: Best practices for Claude Code usage

### CLI Commands
```bash
# List available workflows
caci workflow list

# Install a workflow
caci workflow install bmad-method
caci workflow install claude-standard

# Preview workflow contents
caci workflow preview bmad-method
```

### Implementation Details
- Create workflow bundle structure with all required components
- Store workflow definitions in `.configurator/workflows/`
- Include component dependencies and CLAUDE.md templates
- Support for workflow versioning and updates

### Acceptance Criteria
- [ ] `caci workflow list` shows available workflows
- [ ] `caci workflow install <name>` installs complete workflow
- [ ] `caci workflow preview <name>` shows what will be installed
- [ ] BMad-Method workflow is fully implemented
- [ ] Claude Standard workflow is fully implemented
- [ ] Installation creates proper backup before applying
- [ ] Rollback capability if installation fails

### Technical Notes
See `/docs/next-phase-prd.md` for detailed technical specifications including the `WorkflowBundle` interface.

### Priority
High - This significantly improves user onboarding and provides immediate value.