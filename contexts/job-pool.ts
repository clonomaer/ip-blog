import { JobPool } from 'services/job-pool'
import { streamCache } from './stream-cache'

export const jobPool = new JobPool(streamCache)
