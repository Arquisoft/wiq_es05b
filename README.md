<img src="projectmedia/logo.svg">

CYT is a fork from the repo of the [Software Architecture course](http://arquisoft.github.io/) in [2023/2024 edition](https://arquisoft.github.io/course2324.html). The goal of this project is to provide a fun way of learning and enhancing our general knowledge through an entertaining Q&A game.

Check out [deployed docs](https://arquisoft.github.io/wiq_es05b/) on github pages for further information, and do not forget to explore our process over the [wiki](https://github.com/Arquisoft/wiq_es05b/wiki).

[![Forks](https://img.shields.io/github/forks/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b/network/members)
[![Stars](https://img.shields.io/github/stars/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b/stargazers)

[![Deploy on release](https://github.com/Arquisoft/wiq_es05b/actions/workflows/deploy.yml/badge.svg)](https://github.com/Arquisoft/wiq_es05b/actions/workflows/deploy.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_es05b&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_es05b) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_es05b&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_es05b)

[![Open Issues](https://img.shields.io/github/issues-raw/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b/issues) [![Closed Issues](https://img.shields.io/github/issues-closed-raw/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b/issues?q=is%3Aissue+is%3Aclosed)
[![Repo Size](https://img.shields.io/github/repo-size/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b)
[![Code Size](https://img.shields.io/github/languages/code-size/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b)
[![Languages](https://img.shields.io/github/languages/count/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b) [![Top Language](https://img.shields.io/github/languages/top/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b)
[![Commit Activity](https://img.shields.io/github/commit-activity/m/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b/commits/main)
[![Contributors](https://img.shields.io/github/contributors/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b/graphs/contributors) [![Last Commit](https://img.shields.io/github/last-commit/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b/commits/main) 

[![Pull Requests](https://img.shields.io/github/issues-pr/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b/pulls)
[![License](https://img.shields.io/github/license/Arquisoft/wiq_es05b)](https://github.com/Arquisoft/wiq_es05b/blob/main/LICENSE)

<img src="projectmedia/footer.svg">

# Summary

This repo is a basic application composed of several components.

- **Gateway service**. Express service that is exposed to the public and serves as a proxy to the two previous ones.
- **User service**. Express service that handles the insertion of new users in the system.
- **Auth service**. Express service that handles the authentication of users.
- **Webapp**. React web application that uses the gateway service to allow basic login and new user features.
- **Jordi Ask Service**. Express service that handles the wikidata-based questions generated.
- **Jordi Think Service**. Local service that generates questions periodically using the WikiData API.
- **Ranking Service**. Express service that handles the global scoring system of the app.

Both the user and auth service share a Mongo database that is accessed with mongoose.

# Quick start guide

## Using docker

The fastest way tp launch this sample project is using docker. Just clone the project:

```sh
git clone https://github.com/Arquisoft/wiq_es05b.git
```

Launch it with docker compose:

```sh
docker compose --profile dev up --build
```

And tear it down:

```sh
docker compose --profile dev down
```

Available profiles: "dev" and "prod".

## Starting Component by component

First, start the mongo databases. Either install and run on Mongo or run them using docker:

```sh
# Users database
docker run -d -p 27017:27017 --name=mongo-users-cyt mongo:latest

# User history database
docker run -d -p 27018:27017 --name=mongo-history-cyt mongo:latest

# Ranking database
docker run -d -p 27019:27017 --name=mongo-ranking-cyt mongo:latest

# Question serving database
docker run -d -p 27020:27017 --name=mongo-siwofi-cyt mongo:latest

# Question generation database
docker run -d -p 27021:27017 --name=mongo-turnuri-cyt mongo:latest
```

You can also use services like Mongo Altas for running a Mongo database in the cloud. Or running a Postgres on your own with the proper schema.

Now, launch the ranking, users, jordis and gateway services. Just go to each directory and run `npm install` followed by `npm start`.

Lastly, go to the webapp directory and launch this component with `npm install` followed by `npm start`.

After all the components are launched, the app should be available in localhost in port 3000.

You can also access the public API from the `port:8000`.

# Deployment

For the deployment, we have several options. 

The first and more flexible is to deploy to a virtual machine using SSH. This will work with any cloud service (or with our own server). 

Other options include using the container services that most cloud services provide. This means, deploying our Docker containers directly. 

We are going to use the first approach, creating a virtual machine in a cloud service and after installing docker and docker-compose, deploy our containers there using GitHub Actions and SSH.

## Machine requirements for deployment

The machine for deployment can be created in services like Microsoft Azure or Amazon AWS. These are in general the settings that it must have:

- Linux machine with Ubuntu > 20.04.
- Docker and docker-compose installed.
- Open ports for the applications installed (in this case, ports 3000 for the webapp and 8000 for the gateway service).

Once you have the virtual machine created, you can install **docker** and **docker-compose** using the following instructions:

```ssh
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
sudo apt install docker-ce
sudo usermod -aG docker ${USER}
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Continuous delivery (GitHub Actions)

Once we have our machine ready, we could deploy by hand the application, taking our docker-compose file and executing it in the remote machine. 

In this repository, this process is done automatically using **GitHub Actions**. The idea is to trigger a series of actions when some condition is met in the repository. 

As you can see, unitary tests of each module and e2e tests are executed before pushing the docker images and deploying them. Using this approach we avoid deploying versions that do not pass the tests.

The deploy action is the following:

```yml
deploy:
    name: Deploy over SSH
    runs-on: ubuntu-latest
    needs: [docker-push-userservice,docker-push-authservice,docker-push-gatewayservice,docker-push-webapp]
    steps:
    - name: Deploy over SSH
      uses: fifsky/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        user: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        command: |
          wget https://raw.githubusercontent.com/arquisoft/wiq_es05b/master/docker-compose.yml -O docker-compose.yml
          wget https://raw.githubusercontent.com/arquisoft/wiq_es05b/master/.env -O .env
          docker compose --profile prod down
          docker compose --profile prod up -d
```

This action uses three secrets that must be configured in the repository:
- DEPLOY_HOST: IP of the remote machine.
- DEPLOY_USER: user with permission to execute the commands in the remote machine.
- DEPLOY_KEY: key to authenticate the user in the remote machine.

Note that this action logs in the remote machine and downloads the docker-compose file from the repository and launches it. Obviously, previous actions have been executed which have uploaded the docker images to the GitHub Packages repository.

# Main Development Team

| 📚 UOId | 🧑‍💻 Name | 📧 Email | 😺 GitHub |
| :---: | :---: | :---: | :---: |
| UO289295 | Álvaro García | [UO289295@uniovi.es](mailto:UO289295@uniovi.es) | [![GitHub](https://img.shields.io/badge/GitHub-algarfer-brightgreen)](https://github.com/algarfer) |
| UO288787 | Donato Martín | [UO288787@uniovi.es](mailto:UO288787@uniovi.es) | [![GitHub](https://img.shields.io/badge/GitHub-dononitram-brightgreen)](https://github.com/dononitram) |
| UO288705 | David Álvarez | [UO288705@uniovi.es](mailto:UO288705@uniovi.es) | [![GitHub](https://img.shields.io/badge/GitHub-DavidAlvrz-brightgreen)](https://github.com/DavidAlvrz) |
| UO276255 | Rubén Rubio | [UO276255@uniovi.es](mailto:UO276255@uniovi.es) | [![GitHub](https://img.shields.io/badge/GitHub-UO276255-brightgreen)](https://github.com/UO2766255) |
| UO289321 | Luna Valdés | [UO289321@uniovi.es](mailto:UO289321@uniovi.es) | [![GitHub](https://img.shields.io/badge/GitHub-uo28931-brightgreen)](https://github.com/uo289321) |

## Special Thanks and Collaborations

We would like to extend our special thanks to the following individuals for their valuable contributions and collaborations:

- Thanks to all of the JordiBurger Easter Event participants.
- Thanks to Jordi Hurtado for not denouncing us legally.
- Thanks to Omitg24 for the footer I've just stolen.

We are grateful for their support and dedication in making this project a success.

<p style="color: #10ff00">To be continued</p>
<img src="projectmedia/console.svg" style="width: 5%">
