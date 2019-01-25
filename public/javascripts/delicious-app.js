import '../sass/style.scss';
import { $, $$ } from './modules/bling';
import autocomplite from './modules/autocomplite';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';


autocomplite($('#address'), $('#lng'), $('#lat'))  

typeAhead( $('.search') );

makeMap($('#map'));

const heartForms = $$('form.heart');

heartForms.on('submit', ajaxHeart);
