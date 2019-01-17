import '../sass/style.scss';
import { $, $$ } from './modules/bling';
import autocomplite from './modules/autocomplite';
import typeAhead from './modules/typeAhead';

autocomplite($('#address'), $('#lng'), $('#lat'))  

typeAhead( $('.search') );
