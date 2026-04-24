# ResourceFinderWithChatbot - Project Overview

> My organization is ELI LILLY, we need to create a website where all the resources used in any project are stored in a database or linked are attached to the pages inside this website, especailly having an LLM chatbot to help users find resources.

---

## 📋 Table of Contents

- For now we are just making the dashboard using the image Ill share in the message later.
- Most important we need a chatbot popup which comes at the start of the website, please take inspiration from Chatbase.co, a basic chatbot.
- The chatbot will look for answers in the uploaded resourcedocuments for now
- Add commented code for chatbot to call a backend API for resouce search.

## Theme

> white and #d52b1e colour combination.

# Coding Standards

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks

## Tailwind CSS v4

**CRITICAL**: We are using Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration must be done in CSS using the `@theme` directive in `src/app/globals.css`
- Use CSS custom properties for colors, spacing, etc.
- No JavaScript-based config allowed

## Naming

- Components: PascalCase (`ItemCard.tsx`)
- Files: Match component name or kebab-case
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

## Styling

- Tailwind CSS for all styling

## Error Handling

- Use try/catch
- Display user-friendly error messages via toast

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 100 lines when possible
