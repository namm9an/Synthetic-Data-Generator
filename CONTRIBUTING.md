# Contributing Guide

Thank you for considering contributing to **Synthetic-Data-Generator**! We welcome pull requests, issues, and feature requests.

## Development Workflow

1. **Fork** the repository & clone your fork.
2. Create a new **branch** (`feat/<short-description>`).
3. Install dependencies (backend & frontend) using the readme instructions.
4. Make changes with clear, concise commits.
5. Run `npm run lint && pytest` to ensure quality.
6. Push your branch & open a **pull request** against `main`.

## Pull Request Checklist

- [ ] Title: `feat: <subject>` / `fix: <subject>` / `docs: <subject>` …
- [ ] Follows coding standards and passes linters/tests.
- [ ] Updated documentation if needed.
- [ ] Reference related issue (`Fixes #123`).

## Code Style

* **Python:** Black + isort formatting, type-hints where possible.
* **JavaScript/TS:** Prettier + ESLint with React + Tailwind plugin.

## Commit Message Convention

We loosely follow [Conventional Commits](https://www.conventionalcommits.org/).

## Reporting Bugs / Requesting Features

Open an issue with:

- Expected behavior
- Current behavior
- Steps to reproduce / use-case
- Screenshots or logs

Thank you for helping us make this project better!  
*— Maintainers*
