
# publish-to-github-action

Forked from [mikeal/publish-to-github-action](https://github.com/mikeal/publish-to-github-action) to work on all
supported OSes.

A GitHub Action to push any local file changes, including new files, back to supplied branch name.

This action is useful to put after other actions that modify files in the local checkout that you'd then like to persist back into the repository.

```
Usage:

- uses: romgrk/publish-to-github@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    # BRANCH_NAME: '' # Not implemented. Always set to 'master'. File an issue if you need it.
```
