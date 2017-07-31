import { values } from 'lodash'

import * as Api from '../../apis'
import * as TYPES from '../types'

const state = {
    error: null,
    status: 'inactive',
    jobsPerMinute: 0,
    recentJobs: 0,
    recentlyFailed: 0,
    processes: 0,
    maxWaitQueue: 0,
    maxWaitTime: 0,
    queueWithMaxRuntime: 0,
    queueWithMaxThroughput: 0,
    fetching: false,
}

const actions = {
    fetch({ commit }) {
        commit('STATS_REQUEST')
        Api.fetchStats()
            .then(response => {
                commit('STATS_SUCCESS', response.data)
            })
            .catch(error => {
                commit('STATS_FAILURE', error.message)
            })
    }
}

const mutations = {
    [TYPES.STATS_SUCCESS] (state, { stats }) {
        if (_.values(stats.wait)[0]) {
            stats.maxWaitTime = _.values(stats.wait)[0];
            stats.maxWaitQueue = _.keys(stats.wait)[0].split(':')[1];
        }
        state.fetching = false
        state.error = null
        Object.assign({}, state, stats);
    },

    [TYPES.STATS_FAILURE] (state, { message }) {
        state.fetching = false
        state.error = message
    },

    [TYPES.STATS_REQUEST] (state) {
        state.fetching = true
        state.error = null
    },
}

export default {
    state,
    actions,
    mutations,
}
