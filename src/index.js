/*
 * index.js
 */

const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')

const GITHUB_BOT_NAME = 'github-actions[bot]'

async function main() {
  try {
    console.log('Starting comment-on-pr...')

    const token = process.env.GITHUB_TOKEN
    // const actor = process.env.GITHUB_ACTOR
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
    const eventName = process.env.GITHUB_EVENT_NAME
    const eventPath = process.env.GITHUB_EVENT_PATH
    const event = JSON.parse(fs.readFileSync(eventPath).toString())
    const file = core.getInput('file')

    console.log({ owner, repo, eventName, eventPath, event, file })

    if (eventName !== 'pull_request') {
      console.log(`Not running for event "${eventName}"`)
      return
    }

    const pull_number = event.number

    const octokit = github.getOctokit(token)

    const message = fs.readFileSync(file).toString()

    console.log('Fetching PR')
    console.log({ owner, repo, pull_number })
    const pull = await octokit.pulls.get({ owner, repo, pull_number })
    console.log(pull)
    
    const target = {
      owner,
      repo,
      issue_number: pull.data.issue_number,
    }

    console.log('Fetching comments')
    console.log(target)
    const comments = await octokit.issues.listComments(target)

    const botComments = comments.data.filter(c => c.user.login === GITHUB_BOT_NAME)

    console.log('Deleting comments')
    for (let comment of botComments) {
      await octokit.issues.deleteComment({
        ...target,
        comment_id: comment.id,
      })
    }

    console.log('Adding comment')
    await octokit.issues.createComment({
      ...target,
      body: message,
    })

  } catch (error) {
    core.error(error.message)
    core.error(error.stack)
    core.setFailed(error)
  }
}

main()
