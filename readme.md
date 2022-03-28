<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/tq-bit/chattergram">
    <img src="assets/logo.gif" alt="Logo" width="120px" height="120px">
  </a>

  <h3 align="center">Chattergram</h3>

  <p align="center">
    Transcribe speech messages into written text
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

Chattergram is a full-stack Typescript chat application. With a particular extra:

> It transcribes other people's (english) voice messages into writte text for you (and vice versa)

[![Chattergram landingpage][product-screenshot]](#)

I've created it for the [Dev.to & Deepgram Hackathon](https://dev.to/devteam/join-us-for-a-new-kind-of-hackathon-on-dev-brought-to-you-by-deepgram-2bjd). And to make a wish upon a shining star (Frankly speaking, I'd rather skim through 5 seconds of text than listening to 3 minutes of a stopwords-filled monologue. And Deepgram gets rid of most of these by default).


[![Chattergram audio recording][example-screenshot-I]](#)
<div align="center">Recorded voice messages are automatically transcribed by <a href="https://developers.deepgram.com/api-reference/">Deepgram's Audio API.</a>.  </div>

### Features
- Above all: Voice message transcription from recorded audiofiles
- User authentication
- Persistent chats
- Developed using Docker & docker-compose
- Typed data structures & OpenAPI specification under `/api/docs`
- Last but not least: Light & darkmode

### Non-features
- Accurate user login stati
- User profiling
- Chat rooms
- Automated CI/CD
- Automated testing

### Demo

You can try chattergram under https://chat.q-bit.me/.

> The demo will remain up till the 31. of April. It runs on a 2GB DO Droplet.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

All application components of Chattergram are written in Typescript. In the following, you can see the foundation modules it uses:

#### Frontend

* [Vue 3 & its Composition API](https://vuejs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Nginx](https://www.nginx.com/) (production only)

#### Backend
* [Fastify + Plugins](https://www.fastify.io/)
* [WS for realtime websockets](https://github.com/websockets/ws)
* [Sequelize ORM](https://sequelize.org/) & [PostgreSQL](https://www.postgresql.org/)

#### External Services
* [Deepgram Speech-To-Text SAAS](https://deepgram.com/)

#### Development & deployment
* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
* [Vite](https://vitejs.dev/) (development only)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Chattergram can be used in `production` and `development` mode. Before running any, you must follow the following, few steps:

### Prerequisites

At a bare minimum, you need to have a working version of Docker and docker-compose installed on your machine. Please follow the official docs to set these up:

* [Install Docker](https://docs.docker.com/engine/install/)
* [Install Docker Compose](https://docs.docker.com/compose/install/)

For development, you will also need a working version of node & npm.

* [Install Nodejs & NPM](https://nodejs.org/en/download/)
* Install with apt (Linux Ubuntu):
  ```sh
  $ sudo apt update
  $ sudo apt install nodejs
  $ node -v # output: vX.Y.Z
  ```

### Installation

Chattergram uses the Deepgram API for STT. So register and grab an API key.

1. Create an account at [https://console.deepgram.com/signup](https://console.deepgram.com/signup)
2. Create a new API key (persmission: Member is sufficient)
3. Clone the repo
   ```sh
   git clone https://github.com/tq-bit/chattergram.git
   ```
4. Create a `.env` file in the root directory (you can use the .env.example file for templating)
5. Enter your API key under `DEEPGRAM_KEY`

> Note: If you change global variables in this file, you have to adjust the respective docker-compose.(d|p).yaml file as well

### Run the app

There are two docker-compose files in the root directory. Each runs a few simple steps to build and run the application in an appropriate setup.

> Please note: I had problems running the app on a 1GB droplet on DO, Vite had problems with the allocated memory to Node, so there seems to be some minimum RAM requirement.

**Run in dev mode**

After cloning the repos, run:

```bash
sudo docker-compose  --file docker-compose.d.yaml up --build
```

**Run in prod mode**

If you would like to run chattergram in your own environment, there are a few prerequisites. Or maybe not, if you're an experienced sysadmin.

In any way, these were the points I set up for the demo:

- You must have a valid domainname
- In the frontend, you must adjust the constants `BASE_URL` for axios and `WS_BASE_URL` for the websocket connection to match your domain. (You can do a quick `CTRL+SHIFT+F` to search & replace `chat.q-bit.me`)
- You must configure your server to use TLS for a `wss://` connection.
- You must configure your server to connect to the backend app via websocket

<details>
  <summary>If you're using nginx, a config as follows will do the trick. </summary>
<pre>
# In a dedicated file under /etc/nginx/sites-enabled/<your-domain>
location /ws/ {
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "Upgrade";
  proxy_set_header Host $host;
  proxy_read_timeout 86400s; # Prevents the WS connection from breaking after ~ 60secs
  proxy_send_timeout 86400s;
  proxy_pass http://localhost:9090/;
}
</pre>
</details>

Finally, you can start the app by using:

```bash
sudo docker-compose  --file docker-compose.p.yaml up --build
```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

 After starting the app, open a browser at `localhost:3000/` (dev) or your domain name (production) & create a new account.

> All your information will be stored in a local PostgreSQL database

[![Chattergram signup gif][onboarding-screenshot-I]](#)

Select another user and start using STT. You can also use Chattergram for good-ol text chats.


[![Chattergram transcription gif][onboarding-screenshot-II]](#)


<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Please tell me how you liked the submission. You can reach me on Twitter or on [dev.to](https://dev.to/tqbit)

> Please note that I will not actively develop this app. If you find a breaking bug, please open an issue and I'll look into it .

Mail: [tobi@q-bit.me](mailto:tobi@q-bit.me) - Twitter: [@qbitme](https://twitter.com/qbitme)

Project Link: [https://github.com/tq-bit/chattergram](https://github.com/tq-bit/chattergram)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Tsvetomira Dichevska](https://www.linkedin.com/in/tsvetomira-dichevska/) thank you for creating my Logo and help me figure out this idea
* [Othneildrew's Best-README-Template](https://github.com/othneildrew/Best-README-Template) which was used to write this template
* [Heroicons](https://heroicons.com/) which are used throughout the application
* [@sinclair/typebox](https://www.npmjs.com/package/@sinclair/typebox) for saving me the headache of typing twice

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/tq-bit/chattergram.svg??style=plastic&logo=appveyor
[contributors-url]: https://github.com/tq-bit/chattergram/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tq-bit/chattergram.svg??style=plastic&logo=appveyor
[forks-url]: https://github.com/tq-bit/chattergram/network/members
[stars-shield]: https://img.shields.io/github/stars/tq-bit/chattergram.svg??style=plastic&logo=appveyor
[stars-url]: https://github.com/tq-bit/chattergram/stargazers
[issues-shield]: https://img.shields.io/github/issues/tq-bit/chattergram.svg??style=plastic&logo=appveyor
[issues-url]: https://github.com/tq-bit/chattergram/issues
[license-shield]: https://img.shields.io/github/license/tq-bit/chattergram.svg??style=plastic&logo=appveyor
[license-url]: https://github.com/tq-bit/chattergram/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg??style=social&logo=appveyor&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/tobias-quante-764aa1140/
[product-logo]: assets/logo.gif
[product-screenshot]: assets/chattergram_landingpage.png
[example-screenshot-I]: assets/chattergram_chat_I.png
[example-screenshot-II]: assets/chattergram_chat_II.png
[onboarding-screenshot-I]: assets/chattergram_signup.gif
[onboarding-screenshot-II]: assets/chattergram_transcribe.gif