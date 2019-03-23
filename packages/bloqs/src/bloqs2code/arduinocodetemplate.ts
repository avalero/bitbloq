/*
 * File: arduinocodetemplate.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

const arduinocodetemplate: string = `
/** 
 * Bitbloq generated code. 
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
{{globals}}

// Initialization and configuration
void setup(){

{% for code in setup %}
  {{code | safe}}
{% endfor %}

}

// Main loop program
void loop(){

  {{loop}}

}

// Global functions definition
{{definitionsCode}}
`;

export default arduinocodetemplate;
