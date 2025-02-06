import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import './api.js';
import './commands/phoneCommands.js';
import './modules/phoneMainModule.js';

const Rebar = useRebar();
const api = Rebar.useApi();
