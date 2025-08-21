# UX Specification: CLI Configurator

## User Flow
1. User runs `npx claude-config`
2. Sees welcome message with tool description
3. Asked to choose action: init, update, reset, help
4. For init/update:
   - Asked questions about project needs
   - Shown top 10 recommended components
   - User confirms or modifies selections
   - Tool backs up existing config
   - Tool applies new config
   - Confirmation message shown
5. For reset:
   - Previous configuration restored
   - Confirmation message shown

## Key Interactions
- Simple text-based questions
- Numbered list selections
- Clear progress indicators
- Informative error messages
- Success/failure confirmations

## Error Handling
- Missing components.json: Clear error with solution
- Permission issues: User-friendly error message
- Invalid JSON: Specific error with line number
- Network issues: Retry option or offline mode