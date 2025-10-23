
# Dual Listbox Workspace (Angular 20)

This workspace contains a ready-to-publish Angular library: **@nanawareajinkya/dual-listbox**

## What you get
- Dual-listbox Angular library (neutral UI) under `projects/dual-listbox`
- Demo app at `projects/demo-app` (imports the component directly for local dev)
- Storybook config (skeleton)
- Jest test skeleton
- GitHub Actions for CI and release workflow
- semantic-release config

## Quick start

1. Open the folder in VS Code:
   - `code /path/to/dual-listbox-workspace`

2. Install dependencies:
```bash
npm ci
```

3. Run demo app (local dev):
```bash
npm start
```

4. Build library:
```bash
npm run build:lib
```

5. Create tarball for local testing:
```bash
npm run pack:lib
# installs to dist/dual-listbox/*.tgz
```

6. To publish (first time for scoped package):
- Update `projects/dual-listbox/package.json` metadata if needed.
- Login: `npm login`
- Publish:
```bash
cd dist/dual-listbox
npm publish --access public
```

## Metadata already configured for you
- npm scope: @nanawareajinkya
- package name: @nanawareajinkya/dual-listbox
- repository: https://github.com/nanawareajinkya/dual-listbox
- author: Ajinkya Nanaware <nanawareajinkya46@gmail.com>

Replace any fields you want in `projects/dual-listbox/package.json` before publishing.

