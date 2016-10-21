#include <Servo.h>

const static struct {
  int no;
  int dir;
} PIN[] = {
  { 9, 1},
  {10, -1},
};

#define SERVO_MIN 850
#define SERVO_MAX 2150
#define SERVO_SPEED (330.0/60)

#define MAX_BUTTON 2
#define MIN_BUTTON 4

Servo myServo[sizeof(PIN)/sizeof(PIN[0])];

void setup() {
  while (!Serial) ;
  Serial.begin(9600);
  Serial.println("intializing...");
  Serial.flush();
  setAngle(0);
  Serial.println("done.");
  pinMode(MIN_BUTTON, INPUT_PULLUP);
  pinMode(MAX_BUTTON, INPUT_PULLUP);
}

void setAngle(int a) {
  Serial.print("setAngle: ");
  Serial.println(a);
  int prevMax = 0;
  for (int i; i<sizeof(PIN)/sizeof(PIN[0]); i++) {
    myServo[i].attach(PIN[i].no, SERVO_MIN, SERVO_MAX);
    int a1 = PIN[i].dir>0 ? a: 180-a;
    int prev= (abs(a1-myServo[i].read()));
    if (prevMax < prev) {
      prevMax = prev;
    }
    Serial.print("[");
    Serial.print(i);
    Serial.print("]=");
    Serial.println(a1);
    myServo[i].write(a1);
  }
  Serial.print("waiting: ");
  Serial.println(prevMax*SERVO_SPEED+100);
  delay(prevMax*SERVO_SPEED+100);
  for (int i; i<sizeof(PIN)/sizeof(PIN[0]); i++) {
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
  if (digitalRead(MIN_BUTTON)==LOW) {
    Serial.println("min low");
    delay(30);
    if (digitalRead(MIN_BUTTON)==LOW) {
      setAngle(0);
    }
  }
  if (digitalRead(MAX_BUTTON)==LOW) {
    Serial.println("max low");
    delay(30);
    if (digitalRead(MAX_BUTTON)==LOW) {
      setAngle(180);
    }
  }
}
