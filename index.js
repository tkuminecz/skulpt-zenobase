#!/usr/bin/env node
const chalk = require('chalk')
const inquirer = require('inquirer')
const { inspect } = require('util')

const BODY_PARTS = [
  // Front side
  'Shoulders',
  'Chest',
  'Biceps',
  'Abs',
  'Forearms',
  'Quads',
  // Back side
  'Upper Back',
  'Triceps',
  'Lower Back',
  'Glutes',
  'Hamstrings',
  'Calves'
]

function getBodySideTags (part) {
  return [ `L ${part}`, `R ${part}` ]
}

function createEvent (author, timestamp, part, data) {
  return {
    author,
    percentage: [ data.fat ],
    currency: [ data.mq ],
    tag: [ part ],
    timestamp: [ timestamp ],
    version: 1
  }
}

function createJson (author, timestamp, data) {
  const events = []
  for (const part in data) {
    events.push(createEvent(author, timestamp, part, data[part]))
  }
  return { events }
}

function getCurrentTimestamp () {
  const date = new Date()
  // 2018-12-16T23:32:00.000-05:00
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const mins = date.getMinutes()

  return `${year}-${month}-${day}T${hours}:${mins}:00.000-05:00`
}

async function main () {
  // get timestamp
  const currentTimestamp = getCurrentTimestamp()
  console.log(currentTimestamp)
  const { timestamp } = await inquirer.prompt([
    { type: 'input', name: 'timestamp', message: 'Time of record', default: currentTimestamp }
  ])
  console.log()

  // generate tags for both sides of all body parts
  const allBodyParts = BODY_PARTS.map(getBodySideTags)
    .reduce((all, tags) => {
      return all.concat(tags)
    }, [])

  const data = {}

  // collect muscle quality
  for (const part of allBodyParts) {
    console.log(chalk.bold(part))
    const { mq } = await inquirer.prompt([
      { type: 'input', name: 'mq', message: 'Muscle Quality' }
    ])
    data[part] = { mq: parseFloat(mq) }
    console.log()
  }

  // collect fat %
  for (const part of allBodyParts) {
    console.log(chalk.bold(part))
    const { fat } = await inquirer.prompt([
      { type: 'input', name: 'fat', message: 'Fat %' }
    ])
    data[part] = { ...data[part], fat: parseFloat(fat) }
    console.log()
  }

  console.log(inspect(createJson('qijg17hom0', timestamp, data), { depth: null }))

  console.log()
  console.log(JSON.stringify(createJson('tkuminecz', timestamp, data)))
}

main()
  .catch(err => console.error(err))
