const projectFields = {
  0: 'projectId',
  1: 'name',
  2: 'rewardType',
  3: 'rewardPercent',
  4: 'videolink',
  5: 'story',
  6: 'creator',
  7: 'timestamp'
}

const projectBaseFields = {
  0: 'projectId',
  1: 'name',
  2: 'logoHash',
  3: 'category',
  4: 'shortBlurb',
  5: 'cap',
  6: 'duration',
  7: 'goal',
  8: 'timestamp'
}

const milestoneFields = {
  0: 'type',
  1: 'amount',
  2: 'items'
}

const forecastFields = {
  0: 'creator',
  1: 'projectId',
  2: 'raiting',
  3: 'timestamp',
  4: 'message'
}

const internalParser = (arr, fields) => {
  const result = {}

  for (let i in arr) {
    result[fields[i]] = arr[i]
  }

  return result
}

const parseProject = (arr) => internalParser(arr, projectFields)
const parseBaseProject = (arr) => internalParser(arr, projectBaseFields)
const parseMilestone = (arr) => internalParser(arr, milestoneFields)
const parseForecast = (arr) => internalParser(arr, forecastFields)

module.exports = {
  parseProject,
  parseBaseProject,
  parseMilestone,
  parseForecast
}
