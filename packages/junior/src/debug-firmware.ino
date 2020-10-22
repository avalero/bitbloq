#include <BQZUMJunior.h>
#include <BQZUMJuniorPorts.h>
#include <BQZUMI2C7SegmentDisplay.h>
#include <BQZUMI2CALPSSensor.h>
#include <BQZUMI2CColorSensor.h>
#include <BQZUMI2CTempSensor.h>
#include <Servo.h>

#define START_COMMAND 20
#define SET_PIN_MODE 21
#define ANALOG_WRITE 22
#define DIGITAL_WRITE 23
#define DIGITAL_READ 30
#define SEVEN_SEGMENT_SETUP 40
#define SEVEN_SEGMENT_DISPLAY 41
#define PLAY_TONE 50
#define SERVO_SETUP 60
#define SERVO_WRITE 61
#define MULTISENSOR_SETUP 70
#define MULTISENSOR_GET_DISTANCE 71
#define MULTISENSOR_GET_COLOR 72
#define MULTISENSOR_GET_AL 73
#define MULTISENSOR_GET_TEMP 74

BQ::ZUMJunior zumJunior;
BQ::ZUM::I2C7SegmentDisplay sevenSegmentA(BQ::ZUMJunior::i2cPorts[A]);
BQ::ZUM::I2C7SegmentDisplay sevenSegmentB(BQ::ZUMJunior::i2cPorts[B]);
BQ::ZUM::I2CALPSSensor alpsA(BQ::ZUMJunior::i2cPorts[A]);
BQ::ZUM::I2CALPSSensor alpsB(BQ::ZUMJunior::i2cPorts[B]);
BQ::ZUM::I2CColorSensor colorA(BQ::ZUMJunior::i2cPorts[A]);
BQ::ZUM::I2CColorSensor colorB(BQ::ZUMJunior::i2cPorts[B]);
BQ::ZUM::I2CTempSensor tempA(BQ::ZUMJunior::i2cPorts[A]);
BQ::ZUM::I2CTempSensor tempB(BQ::ZUMJunior::i2cPorts[B]);

Servo servos[6];

int readByte() {    
    while (Serial.available() == 0) {
        delay(1);
    }
    return Serial.read();
}

void setup() {
    zumJunior.setup();
    Serial.begin(115200);
    Serial.write(START_COMMAND);    
}

void loop() {        
    int commandByte = readByte();
    int pin;
    int port;
    int mode;
    int value;
    int tone1, tone2, tone, duration1, duration2, duration;

    switch(commandByte) {
        case SET_PIN_MODE:
            pin = readByte();
            mode = readByte();
            pinMode(pin, mode);
            break;

        case ANALOG_WRITE:            
            pin = readByte();            
            value = readByte();
            analogWrite(pin, value);
            break;
        
        case DIGITAL_WRITE:
            pin = readByte();
            value = readByte();
            digitalWrite(pin, value);
            break;
        
        case DIGITAL_READ:
            pin = readByte();
            value = digitalRead(pin);
            Serial.write(DIGITAL_READ);
            Serial.write(pin);
            Serial.write(value);
            break;

        case SEVEN_SEGMENT_SETUP:
            port = readByte();
            if (port == 0) {
                sevenSegmentA.setup();
                sevenSegmentA.displayInt(0);
            } else {
                sevenSegmentB.setup();
                sevenSegmentB.displayInt(0);
            }
            break;
        
        case SEVEN_SEGMENT_DISPLAY:
            port = readByte();
            value = readByte();
            if (port == 0) {                
                sevenSegmentA.displayInt(value);
            } else {                
                sevenSegmentB.displayInt(value);
            }
            break;

        case PLAY_TONE:
            tone1 = readByte();
            tone2 = readByte();
            duration1 = readByte();
            duration2 = readByte();
            tone = (tone1 << 8) + tone2;
            duration = (duration1 << 8) + duration2;
            zumJunior.playTone(tone, duration);
            break;

        case SERVO_SETUP:
            port = readByte();            
            servos[port].attach(BQ::ZUMJunior::ports[port][0]);
            break;

        case SERVO_WRITE:
            port = readByte();
            value = readByte();
            servos[port].write(value);
            break;

        case MULTISENSOR_SETUP:
            port = readByte();
            if (port == 0) {
                alpsA.setup();
                colorA.setup();
                tempA.setup();
            } else {
                alpsB.setup();
                colorB.setup();
                tempB.setup();                
            }
            break;

        case MULTISENSOR_GET_DISTANCE:
            port = readByte();
            if (port == 0) {
                value = alpsA.getDistance();
            } else {
                value = alpsB.getDistance();
            }
            Serial.write(MULTISENSOR_GET_DISTANCE);
            Serial.write(port);
            Serial.write(value);
            break;

        case MULTISENSOR_GET_COLOR:
            port = readByte();
            if (port == 0) {
                value = colorA.whichColor();
            } else {
                value = colorB.whichColor();
            }
            Serial.write(MULTISENSOR_GET_COLOR);
            Serial.write(port);
            Serial.write(value);
            break;
        
        case MULTISENSOR_GET_AL:
            port = readByte();
            if (port == 0) {
                value = alpsA.getAL();
            } else {
                value = alpsB.getAL();
            }
            Serial.write(MULTISENSOR_GET_AL);
            Serial.write(port);
            Serial.write(value);
            break;

        case MULTISENSOR_GET_TEMP:
            port = readByte();
            if (port == 0) {
                value = tempA.getTemp();
            } else {
                value = tempB.getTemp();
            }
            Serial.write(MULTISENSOR_GET_TEMP);
            Serial.write(port);
            Serial.write(value);
            break;
            
    }
}


