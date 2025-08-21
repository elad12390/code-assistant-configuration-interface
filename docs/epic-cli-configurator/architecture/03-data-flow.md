# Architecture: CLI Configurator - Data Flow

## Data Flow
1. User runs `npx claude-config`
2. Tool reads components.json
3. User answers questions about needs
4. Tool recommends top components
5. Tool backs up .claude folder
6. Tool applies selected components
7. Tool saves configuration to .configurator/