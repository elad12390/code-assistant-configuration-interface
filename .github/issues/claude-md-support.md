## Feature Request: CLAUDE.md File Support

### Description
Extend CACI to manage CLAUDE.md files alongside component configurations. Currently, CACI only manages components in the .claude folder, but users need to configure project-specific instructions through CLAUDE.md files.

### Requirements
- **Detection**: Automatically detect existing CLAUDE.md files in project root
- **Backup**: Include CLAUDE.md in backup operations before modifications  
- **Templates**: Provide CLAUDE.md templates for common project types
- **Merging**: Smart merging of existing CLAUDE.md content with new configurations
- **Validation**: Validate CLAUDE.md syntax and structure

### Implementation Details
- Detect CLAUDE.md during `caci configure`
- Offer to update or replace existing CLAUDE.md
- Provide templates for common project types (Node.js, Python, React, etc.)
- AI-generated suggestions based on project analysis
- Include CLAUDE.md in backup/restore operations

### User Flow
1. Run `caci configure`
2. CACI detects existing CLAUDE.md
3. User selects to update or replace CLAUDE.md
4. CACI provides templates or AI-generated suggestions
5. CLAUDE.md is updated with project-specific instructions

### Acceptance Criteria
- [ ] CLAUDE.md files are detected automatically
- [ ] Existing CLAUDE.md content is preserved during updates
- [ ] At least 5 project-type templates are available
- [ ] Backup includes CLAUDE.md files
- [ ] Restore operations handle CLAUDE.md correctly

### Technical Notes
See `/docs/next-phase-prd.md` for detailed technical specifications.

### Priority
High - This is a core feature for the next phase of CACI development.