#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include "SSD1306.h"

#include <Wire.h> // Only needed for Arduino 1.6.5 and earlier
#include <sstream>
#include <string>
#include <stdio.h>

// Constants
const unsigned char WaitToSpinTime = 20; // seconds between spins
const unsigned char SpinTime = 10;       // seconds that takes to spin

// Set these to your desired credentials.
const char *ssid = "puie msd";
const char *password = "12345678";

enum State
{
    WaitingToSpin,
    Spinning
};

// Globals
unsigned long startTime;
unsigned long elapsedTime;
unsigned char waitTimeToSpin = WaitToSpinTime;
unsigned char timeToSpin = SpinTime;

unsigned char winningNumber;
unsigned long spinNumber = 1;

unsigned short lastNumbers[10];
unsigned short lastNumberIndex = 0;

State gameState = WaitingToSpin;
WebServer server(80);

SSD1306 mainDisplay(0x3c, 22, 21);
SSD1306 lastNumbersDisplay(0x3c, 5, 4);

void handleGetStatus();
void beginLastNumbersDisplay();
void beginMainDisplay();

void setup()
{
    Serial.begin(115200);
    // put your setup code here, to run once:
    startTime = millis();
    randomSeed(analogRead(0));

    // WiFi.softAP(ssid, password);
    // IPAddress myIP = WiFi.softAPIP();
    // Serial.print("AP IP address: ");
    // Serial.println(myIP);

    WiFi.begin("free wifi", "apaplatarece");

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    server.on("/status", handleGetStatus);
    server.begin();

    beginMainDisplay();
}

void beginLastNumbersDisplay()
{
    lastNumbersDisplay.init();
    lastNumbersDisplay.flipScreenVertically();
    lastNumbersDisplay.setFont(ArialMT_Plain_24);
}

void beginMainDisplay()
{
    mainDisplay.init();
    mainDisplay.flipScreenVertically();
    mainDisplay.setFont(ArialMT_Plain_10);
}

void handleGetStatus()
{
    char response[200];
    sprintf(response, "{ \"status\": \"%s\", \"spinNumber\": %d, \"timeLeft\": %d, \"totalTime\": %d, \"lastWinningNumber\": %d }",
            gameState == WaitingToSpin ? "WaitingForSpin" : "Spinning",
            spinNumber,
            gameState == WaitingToSpin ? waitTimeToSpin : timeToSpin,
            gameState == WaitingToSpin ? WaitToSpinTime : SpinTime,
            winningNumber);
    server.send(200, "application/json", response);
}

boolean checkSecondPassed()
{
    elapsedTime = millis();
    if (elapsedTime - startTime >= 1000)
    {
        startTime = elapsedTime;
        return true;
    }
    return false;
}

void drawLastNumbers()
{
    beginLastNumbersDisplay();
    lastNumbersDisplay.clear();
    std::stringstream firstRow;
    for (unsigned short i = 0; i < min((unsigned short)4, lastNumberIndex); i++)
    {
        firstRow << lastNumbers[i];
        if (i < 3)
            firstRow << " ";
    }
    lastNumbersDisplay.drawString(0, 8, firstRow.str().c_str());
    if (lastNumberIndex >= 4)
    {
        std::stringstream secondRow;
        for (unsigned short i = 4; i < min((unsigned short)8, lastNumberIndex); i++)
        {
            secondRow << lastNumbers[i];
            if (i < 7)
                secondRow << " ";
        }
        lastNumbersDisplay.drawString(0, 40, secondRow.str().c_str());
    }
    lastNumbersDisplay.display();
    beginMainDisplay();
}

void drawMainRoulette()
{
    mainDisplay.clear();
    std::stringstream strToDisplay;
    strToDisplay << "#" << spinNumber;
    mainDisplay.drawString(32, 16, strToDisplay.str().c_str());
    if (gameState == WaitingToSpin)
    {
        mainDisplay.drawString(32, 30, "Waiting for");
        mainDisplay.drawString(32, 40, "bets...");
    }
    else
    {
        mainDisplay.drawString(38, 36, "Spinning...");
    }

    strToDisplay.str("");
    unsigned short timeLeft = ((gameState == WaitingToSpin) ? waitTimeToSpin : timeToSpin);
    Serial.println(timeLeft);
    strToDisplay << timeLeft;
    mainDisplay.drawString(63, 52, strToDisplay.str().c_str());
    mainDisplay.display();
}

void startSpinning()
{
    timeToSpin = SpinTime;
    gameState = Spinning;
}

void startWaiting()
{
    winningNumber = random(36);
    if (lastNumberIndex >= 8)
    {
        for (int i = 1; i < lastNumberIndex; i++)
        {
            lastNumbers[i - 1] = lastNumbers[i];
        }
        lastNumbers[7] = winningNumber;
    }
    else
    {
        lastNumbers[lastNumberIndex++] = winningNumber;
    }

    spinNumber++;
    waitTimeToSpin = WaitToSpinTime;
    gameState = WaitingToSpin;
}

void handleSecondPassed()
{
    char t[200];
    sprintf(t, "[Spin number #%d - winning number: %d] -> ", spinNumber, winningNumber);
    Serial.print(t);
    Serial.print(gameState == WaitingToSpin ? "Waiting to spin, time left: " : "Spinning, time left: ");
    Serial.println(gameState == WaitingToSpin ? waitTimeToSpin : timeToSpin);

    if (gameState == WaitingToSpin)
    {
        waitTimeToSpin--;
        if (waitTimeToSpin == 0)
        {
            startSpinning();
        }
    }
    else if (gameState == Spinning)
    {
        timeToSpin--;
        if (timeToSpin == 0)
        {
            drawLastNumbers();
            startWaiting();
        }
    }
}

void loop()
{
    server.handleClient();

    if (checkSecondPassed())
    {
        handleSecondPassed();
        drawMainRoulette();
    }
    delay(10);
}
