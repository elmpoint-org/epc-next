# elmpoint.org

This repository contains the codebase for the updated Elm Point website. The most recent [release](https://github.com/elmpoint-org/epc-next/releases) represents the currently deployed version.

## Links

- The [beta site](https://one.elmpoint.xyz/) can be found here.
- See the [Overall Progress board](https://github.com/orgs/elmpoint-org/projects/3?pane=info) for most recent project status.
- See the [Issue Tracker](https://github.com/elmpoint-org/epc-next/issues?q=sort%3Aupdated-desc+) for the highest technical detail and most up-to-date progress (and to submit bugs).
- General discussion, feature suggestions, or open-ended questions can be added to the [discussions board](https://github.com/elmpoint-org/epc-next/discussions).

## Contributing

Website editors can most easily make contributions through the website CMS (Content Management System). If you have website editing permissions, head to [elmpoint.org/cms](https://one.elmpoint.xyz/cms/pages) to get started.

To edit anything else not found in the CMS editor, **you'll need a free Github account**. Editing simple text or hard-coded items such as the sidebar links can be easily done [on this Github site](#editing-website-data-online). More complex operations may require [running the code locally](#running-the-code-locally).

### Editing website data online

If you have a simple change to make to the website, the easiest way to contribute is here on Github.

For example, let's say you found a typo in a help message on the site.

1. Use the search function above to look for a snippet of the text you'd like to update. What you're looking for will be in the `/client/src/` directory.
1. Click the pencil in the top right to edit the document online. Make your changes.
1. Click the green **Commit changes...** button.
   - In the popup screen, write a quick explanation of what you changed.
   - Click **Propose changes**, then **Create Pull Request**.
1. You are now shown the **Pull Request** created for you, which is where someone may comment on your change, make or suggest an additional revision, or merge the change directly into the website.

### Running the code locally

For more complex changes, or if you'd like to create your own feature, you'll need to run the development server on your own computer.

1.  **Get the code.** Fork the repository and clone your fork—see the [PR guide](#submitting-local-changes) below for more.
1.  **Download required software.** To run the software, you'll need
    - [Node.js](https://nodejs.org/) - The most recent LTS version will probably work.
    - [PNPM](https://pnpm.io) - This is the package manager that manages project dependencies.
    - (recommended) [Visual Studio Code](https://code.visualstudio.com/) - VSCode settings and extensions come with the project to get you running fastest.
1.  **Add AWS Credentials.** In order to run build tests, SST uses an AWS account to manage a few assets in development. You'll need an AWS Account for this, but no created assets will surpass the standard AWS free tier.

    1. Create an [AWS account](https://aws.amazon.com/) if you don't already have one.

    1. Create an IAM user ([tutorial](https://guide.sst.dev/chapters/create-an-iam-user.html)) with administrator access.

    1. Register the IAM user in your environment.

       Create a new file called `.env` in the root project folder.

       Fill in the file with one of the two formats below based on your preference:

       ```sh
       # if you only use this AWS account for this project...
       AWS_ACCESS_KEY_ID=abc123
       AWS_SECRET_ACCESS_KEY=abc123

       # -- OR --

       # if you have already regstered an AWS profile on your machine...
       AWS_PROFILE=your-profile-name-here
       ```

1.  **Create a Tiptap account.** The site uses Tiptap for rich text editing, and they require that you create a free account to access their code. Follow Tiptap's instructions [here](https://tiptap.dev/docs/guides/pro-extensions#configure-global-authentication)—use the commands for _pnpm_.

1.  **Install project dependencies.** Run the following command in the root project folder to install the required dependencies:
    ```
    pnpm install
    ```
1.  **Configure to use the public API.** Running the full Elm Point server locally requires substantially more setup and comfort with AWS, none of which is currently automated. It is much easier to instead use the public server API while you're working.

    To enable this, add the following line to your `.env` file from earlier:

    ```
    NEXT_PUBLIC_USE_PUBLIC_API=1
    ```

1.  **Run the development server.** Open a terminal in the root project directory, and run:
    ```
    pnpm dev-client
    ```
1.  **Head to the development URL.** Your terminal should tell you where to go, but it's probably `http://localhost:3001/`.

### Using the API

The server API is accessible through a GraphQL endpoint, which is easiest to explore using the [Apollo Editor](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fapi.elmpoint.xyz%2Fone%2Fgql) (or any other introspection viewer.)

The endpoint above allows you to explore the available commands and documentation as is, but in order to run commands you'll need to add your authentication token like so:
![connection settings](https://github.com/user-attachments/assets/71717eb9-8285-4752-87e7-6754b4c2ca0f)
![add authorization token](https://github.com/user-attachments/assets/dd1027b4-e249-4117-b2a1-c4464320ed3e)

You can find your authorization token in your browser's cookies.

### Submitting local changes

If you've made local changes to the code, you'll need to manually submit a Pull Request for your code. Please follow standard [Github Flow](https://docs.github.com/en/get-started/using-github/github-flow).

Helpful guides:

- [Open Source Guide: Making a Pull Request](https://opensource.guide/how-to-contribute/#opening-a-pull-request) - A general overview of the process.
- [Musescore's "Git Workflow"](https://musescore.org/en/handbook/developers-handbook/finding-your-way-around/git-workflow#Suggested_workflow) - This is a great step-by-step guide to completing a contribution, including dealing with new changes that happen during your development.

The rough process:

1. Fork the repository. [(click)](https://github.com/elmpoint-org/epc-next/fork)
1. Clone your fork. `git clone https://github.com/YOUR_USERNAME/epc-next.git`
1. Create a branch for your update. `git checkout -b name-of-your-update`
1. Make and commit your changes. `git commit`
1. Push your changes to Github. `git push`
1. Create a Pull Request. [do it manually](https://github.com/elmpoint-org/epc-next/compare) or just go to your fork's homepage on Github—usually a banner appears to create an automatic PR.
