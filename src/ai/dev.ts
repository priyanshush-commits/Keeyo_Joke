import { config } from 'dotenv';
config();

import '@/ai/flows/detect-joke-request.ts';
import '@/ai/flows/tell-hindi-joke-flow.ts';
import '@/ai/flows/uplift-sad-user.ts';
import '@/ai/flows/refuse-dark-joke.ts';