#include <Servo.h>

const static int PIN_NO[] = {
   9, 10,
};

#define SERVO_MIN 1000
#define SERVO_MAX 2000
#define SERVO_SPEED (330.0/60)

Servo myServo[sizeof(PIN_NO)/sizeof(PIN_NO[0])];

void setup() {
  while (!Serial) ;
  Serial.begin(9600);
  Serial.println("intializing...");
  Serial.flush();
  setAngle(0);
  Serial.println("done.");
}

void setAngle(int a) {
  Serial.print("setAngle: ");
  Serial.println(a);
  int prevMax = 0;
  for (int i; i<sizeof(PIN_NO)/sizeof(PIN_NO[0]); i++) {
    myServo[i].attach(PIN_NO[i], SERVO_MIN, SERVO_MAX);
    int prev= (abs(a-myServo[i].read()));
    if (prevMax < prev) {
      prevMax = prev;
    }
    myServo[i].write(a);
  }
  Serial.print("waiting: ");
  Serial.println(prevMax*SERVO_SPEED+300);
  delay(prevMax*SERVO_SPEED+300);
  for (int i; i<sizeof(PIN_NO)/sizeof(PIN_NO[0]); i++) {
    myServo[i].detach();
  }
}

static char line[1024];
static int idx = 0;

void loop() {
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
