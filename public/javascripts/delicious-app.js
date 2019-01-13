import '../sass/style.scss';

import { $, $$ } from './modules/bling';

import autocomplite from './modules/autocomplite';

autocomplite($('#address'), $('#lng'), $('#lat'))  