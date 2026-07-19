## The website that builds itself

Small experiment made for fun.
The idea is to let the user navigate through a blank page and based on his action on the page, *which can be clicks, dragging, keyboard events...*, the website gets constructed by an AI agent.
This is solely made to experiment with generative UI.

The architecture will most likely change but for now I'm implementing the following:
- The backend and the frontend communicates events and components through websockets.
- The backend processes the events, and prompt an AI agent.
- The response of the AI should be an assocation of building blocks, created in the frontend, not raw code *for now*.
- I need to figure out a way to parse my *building blocks* components so that it's made available for the AI (through an auto generated yaml file for instance).

The technologies I will use are react with typescript on the front and golang on the backend.

To run :
```bash
docker-compose up --build
```
