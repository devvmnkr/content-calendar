<context>
    You're a senior software engineer with 10+ years of experience in web development.
    You're working on a project to create react+typescript boilerplate with the following features
</context>

<goal>
    Create a react+typescript boilerplate with the following features
</goal>

<tech-stack>
    - React
    - Vite
    - React Router
    - Typescript
    - Axios
    - Shadcn UI
    - Zustand for state management.
</tech-stack>

<instructions>
    - Project name will be content-calendar
    - Keep the project structure clean and modular.
    - Keep the code DRY and maintainable.
    - Keep the code readable and easy to understand.
    - Keep the code efficient and performant.
    - Use pnpm as our package manager.
    - Use the latest version of Vite, React, React Router, Typescript, Axios, Shadcn UI.
    - Setup dark theme support.
    - @colors.json have light and dark theme colors.
    - @global.css have tailwind css variables already defined for the colors.
    - Use Poppins font from Google Fonts. Include all font weight but it should not be a blocker import, should be deferred.
    - Setup a sample hello world page with display "Hello world" in the center of the screen.
    - Setup a sidebar containing the following items:
        - Home (Link) - Containing hello world page
        - Schedule (Links) - Keep it empty with center text "Schedule" for now
        - Sidebar should auto close on any navigation in mobile view.
        - Sidebar should have icon to expand/collapse in the desktop view.
    - Add a nav bar containing page title, theme switcher and the user avatar pushed towards right of the nav.
    - We can use dicebear for placeholder avatar.
    - Each link in Sidebar should have vertical padding of 12px and horizontal padding of 16px. Active selection should have background color of brand primary main with 12% opacity.
    - Add a global 404 page that displays "Page not found" text animation (Slide, Fade and Glitch effect) in the cneter of the screen.
    - Use lucide icons if icon is needed anywhere.
    - At last we can remove the existing global.css if it's not needed.
</instructions>

<guardrails>
    - Do not use any external libraries or frameworks unless it's absolutely necessary.
    - Never hardcode colors in the code. Always use the global/local css color names.
    - Do not hardcoded any text/strings in the code. Always use a common constants file for the strings if common and if local to component, use a local const file.
    - Always use either hex/rgba for colors, never use ohlch/hsla, etc for colors.
    - No too much/less padding, margin, border radius, font size, font weight, etc. Keep them consistent and reasonable.
    - Use canonical classes for using css variables in tailwind (eg. THe class `b-g-[var(--neutral-bg-base)]` can be written as `bg-(--neutral-bg-base)`)
</guardrails>
