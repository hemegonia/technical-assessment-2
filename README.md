# technical-assessment-2

This project is for https://technical-assessment.konicaminoltamarketplace.com/
The solution was written in TypeScript by Eric Tran.
The server is a Node/Express application providing an Http API to the client.

To run the server:
npm install
nodemon

or

npm install
npm start

Open browser and go to: http://localhost:8080/client to get to pre configured client or point your own client API to  http://localhost:8080/
The server will run on port 8080 as requested in the instructions.

Design Philosophy
The program was designed with specific types to make it easier to test and easy to understand relative to the instructions.
Most of the logic is contained in the Game class located at: models\Game.ts
Types are defined in: models\types.ts

The algorithm is:
Track the currentClicks until a valid move is accepted.
Keep a stack of valid moves by the user and a stack of occupied positions that are no longer valid.
Upon every click, check if the first point is valid, if so, check if the second point is valid, then check if this proposed move if valid.
If the move is more than one unit wide, break it down into single  units and add it to the stack of invalid positions.
Most of the checking is done based checking the array.
There is a intersection checking function that was sourced from stackoverflow, this is for the cases where two lines would meet in between units, usually two oppositing diagonal lines.

The program is currently not 100% complete, I know of some outstanding issues.
The end game condition checking needs work, it is using a brute force approach.
Diagonal checking posed an issue for me but with some more time it can be fixed.

TODOS
Game over condition*
Diagonal valid move checking*
Unit testing

*Exists but is faulty
