/* global contract, Wings, before, assert, it */

const crypto = require('crypto')
const Chance = require('chance')
const Web3 = require('web3')
const Promise = require('bluebird')
const parser = require('../helpers/parser')
// const delay = require('../helpers/delay')
const uuid = require('uuid')
const BigNumber = require('bignumber.js')

let chance = new Chance()
let web3 = new Web3()

contract('Wings', (accounts) => {
  let wings, creator

  let projectId, project, milestone
  let forecast

  let addedMilestones

  before('Should Create Project', (done) => {
    creator = accounts[0]
    console.log('Creator: ', creator)

    Wings.new({
      from: creator
    }).then((_wings) => {
      wings = _wings
    }).then(() => {
      return wings.setAdmin.sendTransaction(creator, {
        from: creator
      })
    }).then(() => {
      project = {
        name: uuid.v4(), // chance.word(),
        shortBlurb: '0x' + crypto.randomBytes(32).toString('hex'),
        logoHash: '0x' + crypto.randomBytes(32).toString('hex'),
        category: chance.integer({min: 0, max: 2}),
        rewardType: chance.integer({min: 0, max: 2}),
        percent: chance.integer({min: 1, max: 100}),
        duration: chance.integer({min: 1, max: 180}),
        goal: web3.toWei(chance.integer({min: 100, max: 1000}), 'ether'),
        videolink: 'https://www.youtube.com/watch?v=4FeJ0QPZnGc',
        story: '0x' + crypto.randomBytes(32).toString('hex'),
        cap: true
      }

      projectId = '0x' + crypto.createHash('sha256').update(new Buffer(project.name, 'utf8')).digest().toString('hex')

      return wings.addProject.sendTransaction(
        project.name,
        project.shortBlurb,
        project.logoHash,
        project.category,
        project.rewardType,
        project.percent,
        project.duration,
        project.goal,
        project.videolink,
        project.story,
        project.cap,
        {
          from: creator
        }
      ).then(() => {
        return wings.getBaseProject.call(projectId)
      }).then((rawProject) => {
        let bcProject = parser.parseBaseProject(rawProject)

        assert.notEqual(bcProject, null)
        assert.equal(bcProject.projectId, projectId)
        assert.equal(bcProject.name, project.name)
        assert.equal(bcProject.duration.toString(), project.duration.toString())
      })
    }).then(done).catch(done)
  })

  it('Shouldnt allot to create project from new user', (done) => {
    const user = accounts[1]

    const newProject = {
      name: uuid.v4(), // chance.word(),
      shortBlurb: '0x' + crypto.randomBytes(32).toString('hex'),
      logoHash: '0x' + crypto.randomBytes(32).toString('hex'),
      category: chance.integer({min: 0, max: 2}),
      rewardType: chance.integer({min: 0, max: 2}),
      percent: chance.integer({min: 1, max: 100}),
      duration: chance.integer({min: 1, max: 180}),
      goal: web3.toWei(chance.integer({min: 100, max: 1000}), 'ether'),
      videolink: 'https://www.youtube.com/watch?v=4FeJ0QPZnGc',
      story: '0x' + crypto.randomBytes(32).toString('hex'),
      cap: true
    }

    const newProjectId = '0x' + crypto.createHash('sha256').update(new Buffer(project.name, 'utf8')).digest().toString('hex')

    return wings.addProject.sendTransaction(
      project.name,
      project.shortBlurb,
      project.logoHash,
      project.category,
      project.rewardType,
      project.percent,
      project.duration,
      project.goal,
      project.videolink,
      project.story,
      project.cap,
      {
        from: creator
      }
    ).then(() => {
      assert.equal(1, 0)
    }).catch((err) => {
      done()
    })
  })

  it('Should return base project info', (done) => {
    wings.getBaseProject.call(projectId).then((rawProject) => {
      assert.notEqual(rawProject, null)

      const project = parser.parseBaseProject(rawProject)

      assert.notEqual(project.projectId, null)
      assert.notEqual(project.name, null)
      assert.notEqual(project.logoHash, null)
      assert.notEqual(project.category, null)
      assert.notEqual(project.shortBlurb, null)
    }).then(done).catch(done)
  })

  it('Should return 1 my project', (done) => {
    wings.getMyProjectsCount.call(creator).then((count) => {
      assert.equal(count, 1)
    }).then(done).catch(done)
  })

  it('Should return one my project', (done) => {
    wings.getMyProjectId.call(creator, 0).then((_projectId) => {
      assert.equal(_projectId, projectId)
    }).then(done).catch(done)
  })

  it("Should doesn't allow to change creator to another account from not owner account", (done) => {
    const user = accounts[1]

    wings.changeCreator.sendTransaction(projectId, user, {
      from: user
    }).then(() => {
      assert.equal(1, null)
      done()
    }).catch((err) => {
      assert.notEqual(err, null)
      done()
    })
  })

  it('Should allow to change creator to another account', (done) => {
    const user = accounts[1]

    wings.changeCreator.sendTransaction(projectId, user, {
      from: creator
    }).then((txId) => {
      assert.notEqual(txId, null)
    }).then(done).catch(done)
  })

  it('Should confirm that owner changed to another account', (done) => {
    const user = accounts[1]

    wings.changeCreator.sendTransaction(projectId, creator, {
      from: creator
    }).then(() => {
      assert.notEqual(1, null)
      done()
    }).catch((err) => {
      assert.notEqual(err, null)
      done()
    })
  })

  it('Should have 1 project', (done) => {
    wings.getCount.call().then((count) => {
      assert.equal(count.toNumber(), 1)
    }).then(done).catch(done)
  })

  it('Should allow to add milestone', (done) => {
    const user = accounts[1]

    let amount = new BigNumber(project.goal).div(2).floor()
    milestone = {
      type: chance.integer({min: 0, max: 1}),
      projectId: projectId,
      amount: amount.toString(),
      items: 'abc\nabc\nabc\n'
    }

    wings.addMilestone.sendTransaction(
      milestone.projectId,
      milestone.type,
      milestone.amount,
      milestone.items,
      {
        from: user
      }
    ).then((txId) => {
      assert.notEqual(txId, null)
    }).then(done).catch(done)
  })

  it('Should contains one milestone', (done) => {
    wings.getMilestonesCount.call(projectId).then((result) => {
      assert.equal(result.toNumber(), 1)
    }).then(done).catch(done)
  })

  it("Shouldn't allow to add more sum milestones than goal", (done) => {
    const user = accounts[1]

    wings.addMilestone.sendTransaction(
      projectId,
      chance.integer({min: 0, max: 1}),
      project.goal,
      'abc\0abc\0abc',
      {
        from: user
      }
    ).then((txId) => {
      assert.equal(1, null)
      done()
    }).catch((err) => {
      assert.notEqual(err, null)
      done()
    })
  })

  it("Shouldn't allow to add more than 10 items to milestone", (done) => {
    const user = accounts[1]

    let s = ''
    for (let i = 0; i < 10; i++) {
      s += 'abc'

      if (i + 1 !== 10) {
        s += '\0'
      }
    }

    let amount = new BigNumber(project.goal).div(3).floor()

    wings.addMilestone.sendTransaction(
      projectId,
      chance.integer({min: 0, max: 1}),
      project.goal,
      s,
      {
        from: user
      }
    ).then((txId) => {
      assert.equal(1, null)
      done()
    }).catch((err) => {
      assert.notEqual(err, null)
      done()
    })
  })

  it('Should allow to get milestone', (done) => {
    wings.getMilestone.call(projectId, 0).then((rawMilestone) => {
      let milestoneObj = parser.parseMilestone(rawMilestone)

      assert.equal(milestoneObj.amount.toString(), milestone.amount)
      assert.equal(milestoneObj.items, milestone.items)
    }).then(done).catch(done)
  })

  it("Shouldn't allow to add more than 10 milestones to project", (done) => {
    const user = accounts[1]
    addedMilestones = []

    for (let i = 0; i < 9; i++) {
      addedMilestones.push({
        type: chance.integer({min: 0, max: 1}),
        projectId: projectId,
        amount: chance.integer({min: 1, max: 10}),
        items: 'abc\n'
      })
    }

    return Promise.each(addedMilestones, (milestone, index) => {
      return wings.addMilestone.sendTransaction(
        milestone.projectId,
        milestone.type,
        milestone.amount,
        milestone.items, {
          from: user
        })
    }).catch(done).then(() => {
      return wings.addMilestone.sendTransaction(
        milestones[0].projectId,
        milestones[0].type,
        milestones[0].amount,
        milestones[0].items,
        {
          from: user
        })
    }).then((txId) => {
      assert.equal(txId, null)
      done()
    }).catch((err) => {
      assert.notEqual(err, null)
      done()
    })
  })

  it.skip('Should return correct milestones', (done) => {
    return wings.getMilestonesCount.call(projectId).then((rawN) => {
      let n = rawN.toNumber()

      return new Promise((resolve, reject) => {
        let milestones = []

        let getMilestone = (milestoneId) => {
          return wings.getMilestone.call(projectId, milestoneId)
        }

        let start = (milestoneId) => {
          return getMilestone(i).then((rawMilestone) => {
            let milestoneObj = parser.parseMilestone(rawMilestone)
            milestones.push(milestoneObj)
            i++

            if (i >= n) {
              return
            } else {
              return start(i)
            }
          })
        }

        let i = 0
        start(i).then(() => {
          resolve(milestones)
        }).catch(reject)
      }).then((milestones) => {
        return Promise.each(addedMilestones, (milestone, index) => {
          assert.equal(milestone.amount.toString(), milestones[index].amount.toString())
        }).then(() => {
          return
        })
      }).then(done).catch(done)
    })
  })

  it.skip('Get project minimal goal', (done) => {
    return wings.getMinimalGoal.call(projectId).then((goal) => {
      assert.equal(goal.toString(), addedMilestones[0].amount.toString())
    }).then(done).catch(done)
  })

  it.skip('Get project cap', (done) => {
    return wings.getCap.call(projectId).then((cap) => {
      return Promise.reduce(addedMilestones, (r, milestone) => {
        return new BigNumber(milestone.amount).add(r)
      }, new BigNumber(0)).then((realCap) => {
        assert.equal(realCap.toString(), cap.toString())
      })
    }).then(done).catch(done)
  })

  it('Should add forecast to the project', (done) => {
    forecast = {
      projectId: projectId,
      raiting: 0,
      message: '0x' + crypto.randomBytes(32).toString('hex')
    }

    return wings.addForecast.sendTransaction(
        forecast.projectId,
        1,
        forecast.message,
      {
        from: creator
      }
      ).then((txId) => {
        assert.notEqual(txId, null)
      }).then(done).catch(done)
  })

  it('Should return forecast equal to 1', (done) => {
    return wings.getForecastCount.call(projectId).then((count) => {
      assert.equal(count.toNumber(), 1)
    }).then(done).catch(done)
  })

  it('Should get my one forecast', (done) => {
    return wings.getForecast.call(projectId, 0).then((rawForecast) => {
      let forecastInst = parser.parseForecast(rawForecast)

      assert.notEqual(forecastInst, null)
      assert.equal(forecastInst.projectId, forecast.projectId)
      assert.equal(forecastInst.creator, creator)
        // assert.equal(forecastInst.raiting, forecast.raiting);
      assert.equal(forecastInst.message, forecast.message)
    }).then(done).catch(done)
  })

  it("Shouldn't allow to add already exists forecast", (done) => {
    return wings.addForecast.sendTransaction(
        projectId,
        1,
        '0x' + crypto.randomBytes(32).toString('hex'),
      {
        from: creator
      }
      ).then(() => {
        assert.equal(1, null)
        done()
      }).catch((err) => {
        assert.notEqual(err, null)
        done()
      })
  })

  it('Should add forecast from another account', (done) => {
    const user = accounts[1]

    return wings.addForecast.sendTransaction(
        projectId,
        0,
        '0x' + crypto.randomBytes(32),
      {
        from: user
      }
      ).then((txId) => {
        assert.notEqual(txId, null)
      }).then(done).catch(done)
  })

  it('Should contains two forecasts', (done) => {
    return wings.getForecastCount.call(projectId).then((count) => {
      assert.equal(count.toNumber(), 2)
    }).then(done).catch(done)
  })

  it('Should disable forecasting', (done) => {
    return wings.disableForecast.sendTransaction(projectId, {
      from: creator
    }).then((txId) => {
      assert.notEqual(txId, null)
    }).then(done).catch(done)
  })

  it('Shouldn\'t allow to forecast now', (done) => {
    const user = accounts[2]

    return wings.addForecast.sendTransaction(
        projectId,
        0,
        '0x' + crypto.randomBytes(32),
      {
        from: user
      }
      ).then(() => {
        asset.equal(1, 0)
      }).catch((err) => {
        done()
      })
  })

  it('Should allow to start crowdsale', (done) => {
    const user = accounts[1]
    return wings.startCrowdsale.sendTransaction(
        projectId,
      {
        from: user
      }
      ).then((txId) => {
        assert.notEqual(txId, null)
      }).then(done).catch(done)
  })

  it('Should return crowdsale contract', (done) => {
    return wings.getCrowdsale.call(projectId).then((crowdsale) => {
      assert.notEqual(crowdsale, null)
    }).then(done).catch(done)
  })
})
