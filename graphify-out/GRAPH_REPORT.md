# Graph Report - helptec  (2026-11-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 192 nodes · 424 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11

## God Nodes (most connected - your core abstractions)
1. `useAppSelector` - 23 edges
2. `useAppDispatch()` - 21 edges
3. `react` - 17 edges
4. `DashboardHeader()` - 16 edges
5. `Sidebar()` - 16 edges
6. `compilerOptions` - 16 edges
7. `AppContent()` - 12 edges
8. `lucide-react` - 11 edges
9. `TicketCategory` - 9 edges
10. `LoginView()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `SidebarProps` --references--> `ActiveScreen`  [EXTRACTED]
  src/components/layout/Sidebar.tsx → src/types/index.ts
- `NavigationState` --references--> `ActiveScreen`  [EXTRACTED]
  src/store/navigationSlice.ts → src/types/index.ts
- `AddTicketPayload` --references--> `TicketCategory`  [EXTRACTED]
  src/store/ticketSlice.ts → src/types/index.ts
- `EditTicketPayload` --references--> `TicketCategory`  [EXTRACTED]
  src/store/ticketSlice.ts → src/types/index.ts
- `UpdateStatusPayload` --references--> `TicketStatus`  [EXTRACTED]
  src/store/ticketSlice.ts → src/types/index.ts

## Import Cycles
- None detected.

## Communities (12 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (13): lucide-react, DashboardHeaderProps, SidebarProps, getAccessibleScreen(), initialState, loadPersistedScreen(), navigationSlice, NavigationState (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (23): devDependencies, autoprefixer@^10.4.21, esbuild@^0.25.0, tailwindcss@^4.3.3, tsx@^4.21.0, @types/express@^4.17.21, @types/node@^22.14.0, @types/react@^19.3.0 (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (15): @reduxjs/toolkit@^2.13.0, @reduxjs/toolkit, ThemeToggleProps, authSlice, AuthState, HARDCODED_USERS, initialState, AppDispatch (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (15): AddTicketPayload, AssignTicketPayload, EditTicketPayload, initialState, LEGACY_SAMPLE_DATES, loadPersistedTickets(), saveTicketsToStorage(), ticketSlice (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.37
Nodes (15): App(), AppContent(), ThemeToggle(), DashboardHeader(), Sidebar(), useAppDispatch(), useAppSelector, AdminTicketsView() (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (10): react, FATEC_LOGO_SRC, FatecLogo(), FatecLogoProps, HelpTecBrand(), HelpTecBrandProps, HELPTEC_LOGO_SRC, HelpTecLogoProps (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (15): dependencies, dotenv@^17.2.3, express@^4.21.2, @google/genai@^2.4.0, lucide-react@^0.546.0, motion@^12.23.24, react@^19.0.1, react-dom@^19.0.1 (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (6): @tailwindcss/vite@^4.3.3, vite@^8.3.0, @vitejs/plugin-react@^6.1.1, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (7): scripts, build, clean, dev, lint, preview, test

### Community 11 - "Community 11"
Cohesion: 0.40
Nodes (4): allowBuilds, esbuild, @google/genai, protobufjs

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 5` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._
- **Why does `@reduxjs/toolkit` connect `Community 2` to `Community 0`, `Community 1`, `Community 3`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10822510822510822 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._