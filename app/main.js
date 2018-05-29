import Vue from 'vue'
import App from './app.vue'

import style from "../assets/css/style.css"
import fonts from '../assets/font-awesome-4.6.3/css/font-awesome.min.css'


// Global Scripts
import "script-loader!moment";
import "script-loader!../node_modules/jquery/dist/jquery.min.js";
import "script-loader!bootstrap";


new Vue({
  el: '#app',
  render: h => h(App)
})///