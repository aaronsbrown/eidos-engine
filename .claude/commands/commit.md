# Commit Workflow

Complete preflight checks and commit process:

## Step 1: Preflight Validation

1. **Run `/preflight` command first**
2. **STOP if any preflight check fails** - Do not proceed to commit
3. **Only continue if all preflight checks pass**

## Step 2: Git Review

1. **`git status`** - Show untracked files and modifications
2. **`git diff`** - Review all staged and unstaged changes
3. **`git log --oneline -5`** - Check recent commit message style

## Step 3: Commit Process

1. **Stage relevant files** with `git add [files]`
2. **Create commit** with proper message format:
   ```bash
   git commit -m "$(cat <<'EOF'
   [type]: [description]
   
   [detailed explanation if needed]
   
   🤖 Generated with [Claude Code](https://claude.ai/code)
   
   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```
3. **Verify commit** with `git status`

## Critical Rules

- **Preflight must pass** - Never commit without full preflight success
- **Review all changes** - Understand what's being committed
- **Use proper message format** - Include AI attribution as per CLAUDE.md
- **Never commit broken code** - Stop if any check fails

## Success Criteria

✅ Preflight passed completely
✅ All changes reviewed and understood  
✅ Commit created with proper message format
✅ Working tree clean after commit