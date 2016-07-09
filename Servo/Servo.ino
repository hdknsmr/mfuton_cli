#include <Servo.h>

#define SERVO_PIN 9
#define SERVO_MIN 1000
#define SERVO_MAX 2000
#define SERVO_SPEED (330.0/60)

Servo myServo;

void setup() {
  Serial.begin(9600);
  myServo.attach(SERVO_PIN, SERVO_MIN, SERVO_MAX);
  myServo.write(0);
  delay(2000);
}

void setAngle(int a) {
  myServo.attach(SERVO_PIN);
  int prev = myServo.read();
  myServo.write(a);
  delay(abs(a-prev)*SERVO_SPEED+100);
  myServo.detach();
}
void loop() {
  char line[1024];
  int idx = 0;
  while (Serial.available()>0) {
    char ch;
    switch ((ch=Serial.read())) {
    case '\r':
      break;
    case '\n':
      setAngle(atoi(line));
      line[0] = 0;
      idx = 0;
      break;
    default:
      if (sizeof(line)<=idx) {
        Serial.println("buffer overflow");
        idx = 0;
      }
      line[idx++] = ch;
      line[idx] = 0;
    }
  }
}
