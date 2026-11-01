# TypeScript utilities

Run these commands from the repository root. Node.js and npm are required.

Type-check the implementation:

```sh
npx --yes --package typescript tsc --noEmit --strict --target ES2020 --module commonjs src/types/models.ts src/utils/collections.ts src/utils/search.ts src/utils/transformations.ts src/utils/validations.ts src/demo.ts
```

Run the demo and its assertions:

```sh
npx --yes --package tsx tsx src/demo.ts
```
