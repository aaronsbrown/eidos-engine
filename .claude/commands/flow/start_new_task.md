# Start New Task

You are about to help the user start working on a new GitHub issue. This command accepts an optional issue number argument.

**Usage:**

- `/start_new_task` - Run full workflow starting from step 1
- `/start_new_task 123` - Skip to step 3 using issue #123

<optional_arguments>
$ARGUMENTS
</optional_arguments>

Follow this workflow:

## Step 1: Fetch Open Issues (Skip if issue number provided)

**Only run this step if no issue number was provided as an argument.**

Use the `gh` command to fetch all open issues from the repository:

```bash
gh issue list --state open --json number,title,body,labels
```

## Step 2: Present Issues to User (Skip if issue number provided)

**Only run this step if no issue number was provided as an argument.**

Display the open issues in a clear, numbered format and ask the user which one they want to work on. Include:

- Issue number
- Title  
- Brief description/body preview
- Labels (if any)

Ask: "Which issue would you like to work on? (Enter the issue number)"

## Step 3: Create Feature Branch

**Start here if an issue number was provided as an argument.**

For the selected issue (either from user selection in Step 2 or from the provided argument):

1. If an issue number was provided as argument, first fetch the specific issue details:

```bash
gh issue view [issue-number] --json number,title,body,labels
```

2. Create a descriptive branch name based on the issue (e.g., `feature/issue-123-add-controls`, `fix/issue-456-rendering-bug`)

3. Create and switch to the new branch:

```bash
git checkout -b [branch-name]
```

## Step 4: Create Starter Plan

You MUST switch to Plan-Mode.

Based on the selected issue:

1. Use the TodoWrite tool to create a structured plan breaking down the work into small, specific, actionable tasks

2. Consider the project's architecture and existing patterns:
   - Reference CLAUDE.md and especially note the Golden Rules
   - Reference docs/tech/architecture_notes for future plans to keep in mind
   - Reference docs/tech/implementation_notes for interesting architectural decisions
   - Look over Pull Request topics to see if any thing worth reading from github

3. Include tasks for:
   - Code implementation
   - Testing (if applicable; all test should be behavioral tests vs implementation tests)
   - Documentation updates (anchor comments, updates to CLaude.MD, or IMplementation Notes.)
   - Any other relevant steps

## Step 5: Confirm Plan

Present the plan to the user and ask: "Does this plan look good? Would you like me to proceed or make any adjustments?"

Remember to follow all guidelines from CLAUDE.md, especially:

- Use anchor comments (AIDEV-NOTE, etc.)
- Follow the established architecture
- Maintain type safety
- Consider performance implications
- Follow preflight then commit process
