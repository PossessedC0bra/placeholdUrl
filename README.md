# 🔗 PlaceholdURL – Fill Dynamic URLs with One Click

PlaceholdURL is a smart, privacy-respecting Chrome extension that lets you fill URLs with dynamic segments

Whether you’re navigating to a customer dashboard, testing a user account, or accessing parameterized tools,
PlaceholdURL saves you from editing URLs by hand. Just click a bookmark, enter your values, and go.

## 🧠 What It Does

PlaceholdURL detects placeholders in your bookmarked URLs using the format:

```
{{placeholder-name}}
```

When you click a URL like:

```
https://dashboard.example.com/user/{{userId}}?env={{environment}}
```

A popup asks you to fill in userId and environment. Once entered, you’re automatically taken to the complete, resolved
URL.

This makes PlaceholdURL ideal for users who frequently access dynamic links — from developers and testers to analysts,
support staff, and operations teams.

## 🚀 Key Features

- 💡 Use dynamic placeholders like {{userId}} in bookmarks
- ⌨️ Enter values on click in a simple popup
- ⚡ Navigate to the complete, personalized URL instantly
- 🔐 100% local, private, and free
- 🛠 Ideal for developers, testers, and anyone with complex workflows

## 💡 Use Cases

PlaceholdURL is built to support a variety of workflows, including:

- Opening dashboards with user- or project-specific paths
- Accessing tools or environments by entering team, region, or date
- Testing variations of URLs without managing dozens of bookmarks
- Navigating complex internal systems using a single smart link

Whether you’re working with staging environments, customer lookups, team dashboards, or anything in between —
PlaceholdURL saves time and reduces errors.

## 📦 Example Bookmark Templates

 Use Case    | URL       | Template Example                                            
|-------------|-----------|-------------------------------------------------------------|
 Customer    | Dashboard | https://app.example.com/user/{{userId}}                     
 Log         | Search    | 	https://logs.example.com/query?email={{userEmail}}         
 Environment | Switch    | 	https://tools.example.com/deploy/{{environment}}/{{build}} 

You define the structure. PlaceholdURL helps you fill it in and go.

## 🔜 Coming Soon

The following features are planned for future releases:

- Customizable placeholder syntax (:id, {id}, [id], etc.)
- Named input profiles (e.g., “Production”, “Staging”, “Customer X”)
- Optional cloud sync using Chrome Sync
- Default values per domain
- Keyboard shortcuts for power users

---

📌 Bookmarks don’t have to be static.
⚙️ Make them dynamic — with PlaceholdURL.

## 🚀 Key Features

- 💡 Detect placeholders like `{{userId}}` in URLs
- ⌨️ Enter values in a simple popup
- ⚡ Navigate to the complete URL with a single click

## 🧠 How it works

PlaceholdURL detects placeholders in URLs using the format:

`{{placeholder-name}}`

When you click a URLs like

`https://www.google.{{country}}`

a popup asks you to replace the placeholder `{{country}}` and allows you to navigate to the complete URL with a single
click.
