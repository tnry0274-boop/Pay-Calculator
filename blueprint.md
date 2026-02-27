# **Project Blueprint: Financial Calculators**

## **1. Overview**

This project is a web application that provides a collection of essential financial calculators for everyday use. The goal is to create a user-friendly, intuitive, and visually appealing interface that makes complex financial calculations simple and accessible to everyone. The application will be a single-page interface featuring four distinct calculators:

1.  **After-Tax Salary Calculator**
2.  **Annual Salary Calculator**
3.  **Severance Pay Calculator**
4.  **Loan Interest Calculator**

The application will be built using modern web standards (HTML, CSS, JavaScript) without any external frameworks, leveraging Web Components for modular and maintainable UI elements.

## **2. Core Features & Design**

### **A. Application Structure**

*   **Single-Page Application (SPA):** All calculators will be accessible from a single `index.html` page.
*   **Web Components:** Each calculator will be a self-contained Web Component (`<after-tax-calculator>`, `<annual-salary-calculator>`, etc.) to encapsulate its HTML, CSS, and JavaScript. This promotes reusability and separation of concerns.
*   **Modular JavaScript:** Code will be organized into ES Modules for clarity and maintainability.
*   **Responsive Design:** The layout will be fully responsive, ensuring a seamless experience on both desktop and mobile devices using modern CSS like flexbox and grid.

### **B. Visual Design & Aesthetics**

*   **Theme:** Modern, clean, and bold.
*   **Color Palette:** A vibrant and energetic palette will be used to create a positive user experience.
*   **Typography:** Expressive and hierarchical fonts will be used to guide the user's attention and improve readability.
*   **Iconography:** Icons will be used to visually represent each calculator, enhancing usability and navigation.
*   **Interactivity:** Interactive elements like buttons and input fields will have subtle "glow" effects and shadows to provide a sense of depth and responsiveness.
*   **Layout:** A card-based layout will be used, with each calculator housed in its own "lifted" card with soft drop shadows. The background will have a subtle noise texture for a premium feel.

### **C. Accessibility (A11Y)**

*   The application will adhere to a11y standards.
*   Proper semantic HTML (`<label>`, `<input>`, `<button>`) will be used.
*   ARIA attributes will be added where necessary.
*   Color contrast will be sufficient for readability.
*   All functionality will be accessible via the keyboard.

## **3. Implementation Plan**

This outlines the steps for the initial development of the calculator application.

1.  **Setup `index.html`:**
    *   Set the main page title.
    *   Create a main container for the application.
    *   Add a header with the application title.
    *   Add placeholder custom element tags for each of the four calculators.
    *   Link to `style.css` and `main.js`.

2.  **Develop `style.css`:**
    *   Define CSS variables for the color palette, fonts, and spacing.
    *   Apply global styles (e.g., `box-sizing`, body background, font).
    *   Create the main layout using Grid or Flexbox to arrange the calculator cards.
    *   Style the "card" component that will be used by each calculator.
    *   Add responsive styles using media queries.

3.  **Implement `main.js` (Web Components):**
    *   For each calculator, create a JavaScript class that extends `HTMLElement`.
    *   Inside each class:
        *   Attach a Shadow DOM to encapsulate the component's style and structure.
        *   Use an HTML `<template>` to define the component's internal HTML (input fields, labels, button, result area).
        *   Define the component's specific styles within the Shadow DOM.
        *   Implement the calculation logic as a method within the class.
        *   Add event listeners to the inputs and button to trigger the calculation.
        *   Update the result area when the calculation is complete.
    *   Use `customElements.define()` to register each of the four calculator components.
