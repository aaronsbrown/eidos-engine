# Preflight Checklist

Run all required checks before committing code:

## Commands to Execute

1. **`npm run lint`** - Check code style and syntax
2. **`npm run build`** - Verify TypeScript compilation and Next.js build
3. **`npm run test`** - Run complete test suite  
4. **`npm run storybook -- --no-open`** - Verify Storybook builds without opening browser

## Rules

- **Stop on first failure** - Do not proceed if any command fails
- **All must pass** - Only report success if every command succeeds
- **Report clearly** - Show which command failed and why

## Success Criteria

✅ All 4 commands complete without errors
✅ No lint warnings or TypeScript errors
✅ All tests pass
✅ Storybook builds successfully

Only proceed to commit workflow if preflight passes completely.