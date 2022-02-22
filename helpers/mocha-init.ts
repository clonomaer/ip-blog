import chai from 'chai';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import { loadEnvConfig } from '@next/env';

chai.use(chaiShallowDeepEqual);
const projectDir = process.cwd();
loadEnvConfig(projectDir);
