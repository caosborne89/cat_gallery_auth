import OAuthClient from "./auth/OAuthClient.js";

const signInRedirect = async () => {
    const codeCallenge = await OAuthClient.createCodeChallenge();
    window.location.href = `https://us-west-2n9yh2zkeq.auth.us-west-2.amazoncognito.com/login?client_id=2t4vj8qe2792pfcj8jhj5cih6r&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost:8080&code_challenge=${codeCallenge}&code_challenge_method=S256`;
}

const signOutRedirect = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");
    window.location.href = `http://localhost:8080`;
}

const displayContent = () => {
    const username = "Anonymous";
    let imageContainers = "";

    for(let i = 1; i < 10; i++) {
        imageContainers += /*html*/`
            <div class="m-3">
              <img src="images/cat${i}.jpeg" alt="cat${i} image" style="max-width: 250px;"></img>
            </div>
        `
    }

    const content = /*html*/`
        <div class="d-flex justify-content-center mt-5">
            <div class="d-flex flex-column">
                <div class="d-flex justify-content-between m-4 ">
                    <h2>Hello ${username}</h2>
                    <button id="signoutButton" type="button" class="btn btn-outline-primary">Sign out</button>
                </div>
                <div class="d-flex flex-row flex-wrap bg-secondary mx-4" style="max-width: 100rem;">
                ${imageContainers}
                </div>
            </div>
        </div>
    `
    document.getElementById("container").innerHTML = content;
    document.getElementById("signoutButton").addEventListener("click", signOutRedirect);
}

const displaySignin = () => {
    const signIn = /*html*/`
        <div id="signin">
            <div class="d-flex justify-content-center p-3" style="margin-top: 8rem;">
                <div class="card bg-secondary d-flex justify-content-center align-items-center" style="width: 18rem; height: 10rem;">
                    <p class="text-light">Sign into AWS Cognito</p>
                    <button id="signinButton" class="btn btn-primary" style="width: 10rem;">Sign in</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById("container").innerHTML = signIn;
    document.getElementById("signinButton").addEventListener("click", signInRedirect);
}

const entry = async () => {
    const oauthClient = new OAuthClient("2t4vj8qe2792pfcj8jhj5cih6r", "http://localhost:8080", "/auth");
    const authenicated = await oauthClient.authenticate();

    if (!authenicated) {
        displaySignin();
        return;
    }

    displayContent();
}

entry();