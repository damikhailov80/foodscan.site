---
inclusion: always
---

# Development Rules

## Language
- All notes, comments, and documentation must be written in English

## Design Principles
- Mobile-first responsive design approach
- Adaptive layouts for different screen resolutions
- Prioritize mobile experience, then scale up for larger screens

## Code Style
- No comments in code
- Code must be self-explanatory through clear naming and structure

## Color Palette
- All colors must be defined as CSS variables in `app/globals.css`
- Components must use only CSS variables from the palette
- Never use hardcoded color values (hex, rgb, rgba) in components or styles
- If a new color is needed, add it to the palette first as a CSS variable
