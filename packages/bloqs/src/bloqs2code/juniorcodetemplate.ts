/*
 * File: arduinocodetemplate.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

const juniorcodetemplate: string = `
/** 
 * Bitbloq generated code for Junior Bloqs. 
 * For more info please visit https://bitbloq.cc 
 * {{date}} 
**/

// headers to be included

#include <ArduinoEventsLib.h>
{% for include in includes %}
#include {{include | safe}}
{% endfor %}


// global declarations

Heap heap;
{% for global in globals %}
{{global | safe}}
{% endfor %}

// Initialization and configuration
void setup(){
  {% for s in setup %}
  {{s | safe}}
  {% endfor %}
}

// Main loop program
void loop(){
  {% for l in loop %}
  {{l | safe}}
  {% endfor %}
  
  {% for l in endloop %}
  {{l | safe}}
  {% endfor %}

  heap.eventloop();
  
}

// Global functions definition
{% for def in definitions %}
{{def | safe}}
{% endfor %}

`;

export default juniorcodetemplate;
