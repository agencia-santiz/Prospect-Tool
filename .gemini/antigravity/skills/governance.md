# Governance Skill — Strict Change Control

## ABSOLUTE RULE
**NEVER modify, refactor, rename, delete, or restructure anything the USER did not explicitly request.**

## What This Means
1. **No unsolicited refactoring** — If the user asks to "fix the button color", do NOT also refactor the component structure, rename variables, or "improve" code style.
2. **No scope creep** — If the user asks to change the header, do NOT touch the footer, sidebar, or any other section.
3. **No removing comments** — Preserve all existing comments and docstrings unless explicitly told to remove them.
4. **No renaming files or variables** — Unless the user specifically asks for it.
5. **No changing business logic** — Design changes are visual only. State management, data flow, API calls, event handlers, and localStorage operations must remain untouched.
6. **No adding dependencies** — Unless the user explicitly requests a new package or it's strictly required by something they asked for.
7. **No deleting features** — Even if they seem unused or redundant, never remove functionality.
8. **No changing file structure** — Do not move files to different directories or create new organizational patterns unless asked.

## Before Every Edit, Ask Yourself:
- "Did the user ask me to change THIS specific thing?" → If NO, **don't touch it**.
- "Am I changing behavior or just appearance?" → If behavior, **stop and confirm**.
- "Am I adding something new the user didn't request?" → If YES, **don't do it**.

## When In Doubt
**ASK the user** before making any change that falls outside the explicit scope of their request. It is always better to ask than to assume.

## Applies To
- All code files (`.tsx`, `.ts`, `.css`, `.html`, `.json`)
- All configuration files
- All documentation files
- All assets and resources
