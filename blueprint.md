# **Project Blueprint: Financial Intelligence Hub**

## **1. Overview**

This project is evolving from a simple calculator tool into a comprehensive **Financial Intelligence Hub**. The primary goal is to create a high-value, content-rich web application that not only provides essential financial calculators but also educates users on related financial topics. This will establish the site as a trustworthy resource, significantly improving its chances of **Google AdSense approval**.

### **Core Components:**
1.  **Financial Calculators:**
    *   After-Tax Salary Calculator
    *   Annual Salary Calculator
    *   Severance Pay Calculator
    *   Loan Interest Calculator
2.  **In-Depth Articles & Guides:**
    *   Detailed explanations for each calculator.
    *   Informational articles on relevant financial topics.
3.  **Enhanced User Experience:**
    *   A professional, clean, and content-focused design.

## **2. Content & SEO Strategy (AdSense Focus)**

### **A. Content is King**

The key to AdSense approval is providing unique, valuable, and engaging content.

1.  **Calculator Detail Pages:**
    *   Instead of just having the tool, each calculator will be framed by a detailed article explaining:
        *   **What it is:** The purpose of the calculation (e.g., "What is severance pay and who is eligible?").
        *   **How it works:** A breakdown of the formula used, including relevant tax laws and regulations (e.g., "Understanding the 4 Major Public Insurances in Korea").
        *   **What to do next:** Practical advice based on the result (e.g., "How to Negotiate a Higher Salary," "Smart Ways to Manage Your Loan").

2.  **Supporting Informational Articles:**
    *   A dedicated "Financial Guides" section will feature articles on broader topics. Initial topics will include:
        *   "A Beginner's Guide to Saving and Investing in Your 20s"
        *   "Understanding Compound Interest: The Eighth Wonder of the World"
        *   "How to Create a Personal Budget That Actually Works"
        *   "Navigating Year-End Tax Settlements in Korea"

### **B. SEO (Search Engine Optimization)**

*   **Meta Tags:** Each page/section will have unique and descriptive `<title>` and `<meta name="description">` tags.
*   **Semantic HTML:** Proper use of heading tags (`<h1>`, `<h2>`, `<h3>`), paragraphs (`<p>`), lists (`<ul>`, `<ol>`), and `<strong>` for emphasis.
*   **Keyword Strategy:** Naturally integrate relevant keywords (e.g., "세후 월급", "연봉 실수령액", "퇴직금 계산법") throughout the articles.

## **3. Design & Layout Enhancement**

*   **Layout Change:** Move from a grid of calculators to a more content-centric layout. A main content area will feature the articles, with calculators embedded within or linked from them.
*   **Navigation:** A clear navigation bar will be added to the header, allowing users to easily switch between calculators and the financial guides section.
*   **Readability:** Typography will be optimized for long-form reading.

## **4. Implementation Plan**

1.  **Update `index.html` Structure:**
    *   Add a navigation bar (`<nav>`).
    *   Create a main content area to hold articles.
    *   Structure each calculator section as an `<article>` with headings, paragraphs, and the calculator component itself.
    *   Add a separate section for the "Financial Guides."

2.  **Update `style.css`:**
    *   Style the new navigation bar.
    *   Style the article layouts, ensuring clear separation between text and calculators.
    *   Ensure everything remains responsive.

3.  **Refine `main.js`:**
    *   Review and enhance calculator logic for greater accuracy, adding comments to explain the formulas.
    *   (No major structural changes needed for the JS components themselves).

4.  **Content Writing:**
    *   Draft and add the detailed text content for each calculator page and the supporting articles directly into `index.html`.

5.  **Deployment:**
    *   Commit all changes to the GitHub repository.
    *   Configure GitHub Pages to serve the site live from the `main` branch.