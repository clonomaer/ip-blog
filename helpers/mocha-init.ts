import chai from 'chai'
import chaiShallowDeepEqual from 'chai-shallow-deep-equal'
import { loadEnvConfig } from '@next/env'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiShallowDeepEqual)
chai.use(chaiAsPromised)
const projectDir = process.cwd()
loadEnvConfig(projectDir)
