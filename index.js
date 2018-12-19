#!/usr/bin/env node
const chalk = require('chalk')
const inquirer = require('inquirer')
const { inspect } = require('util')

const BODY_PARTS = [
  // Front side
  'Shoulders',
  'Biceps',
  'Forearms',
  'Chest',
  'Abs',
  'Quads',
  // Back side
  'Triceps',
  'Upper Back',
  'Lower Back',
  'Glutes',
  'Hamstrings',
  'Calves'
]

function getBodySideTags (part) {
  return [ `L ${part}`, `R ${part}` ]
}

async function collectBodyPartData (part) {
  console.log(chalk.bold(part))
  const answers = await inquirer.prompt([
    { type: 'input', name: 'mq', message: `Muscle Quality` },
    { type: 'input', name: 'fat', message: `Fat %` }
  ])
  console.log()
  return {
    mq: parseFloat(answers.mq),
    fat: parseFloat(answers.fat)
  }
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

  // get MQ and Fat% for each body part
  const allBodyParts = BODY_PARTS.map(getBodySideTags)
    .reduce((all, sides) => {
      return all.concat(sides)
    }, [])

  const data = {}
  for (const part of allBodyParts) {
    const { mq, fat } = await collectBodyPartData(part)
    data[part] = { mq, fat }
  }

  console.log(inspect(createJson('tkuminecz', timestamp, data), { depth: null }))

  console.log()
  console.log(JSON.stringify(createJson('tkuminecz', timestamp, data)))
}

main()
  .catch(err => console.error(err))
