/*
 * index.js
 */

const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')

async function main() {
  try {
    // `who-to-greet` input defined in action metadata file
    // const nameToGreet = core.getInput('who-to-greet')
    console.log('Starting comment-on-pr...')

    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_ACTOR
    const repo = process.env.GITHUB_REPOSITORY
    const eventName = process.env.GITHUB_EVENT_NAME
    const eventPath = process.env.GITHUB_EVENT_PATH

    if (eventName !== 'pull_request')
      return

    const event = JSON.parse(fs.readFileSync(eventPath).toString())
    const pull_number = event.number

    const octokit = github.getOctokit(token)

    const filepath = core.getInput('file')
    const message = fs.readFileSync(filepath).toString()

    const target = {
      owner,
      repo,
      issue_number: pull_number,
    }

    const comments = await octokit.issues.listComments(target)

    console.log(comments)

    await octokit.issues.createComment({
      ...target,
      body: message,
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
