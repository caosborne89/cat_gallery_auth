import OAuthClient from "./OAuthClient.js";

function getAuthCode() {
    let params = new URLSearchParams(document.location.search);
    let code = params.get("code");
    
    return code;
}

const getAccessToken = async (grant_type,code=null) => {
    let data = {
        grant_type: grant_type,
        client_id: "2t4vj8qe2792pfcj8jhj5cih6r",
    };

    if (grant_type == "authorization_code") {
        const verificationCode = getCookie("catGallaryCognitoCodeChallenge");
        data.code = code;
        data.code_verifier = verificationCode;
        data.redirect_uri = "http://localhost:8080";
    } else if (grant_type == "refresh_token") {
        data.refresh_token = localStorage.getItem("refresh_token");
    }

    let formBody = new URLSearchParams(data).toString();

    let response = await fetch(`/auth/oauth2/token`, {
        method: "POST",
        body: formBody,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
    response = await response.json();
    localStorage.setItem("id_token", response.id_token);
    localStorage.setItem("access_token", response.access_token);
    
    if (grant_type == "authorization_code") {
        localStorage.setItem("refresh_token", response.refresh_token);
    }
    
    console.log(response);
}

// Generate a random code verifier
function generateCodeVerifier() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codeVerifier = '';
    for (let i = 0; i < 128; i++) {
        codeVerifier += characters.charAt(crypto.getRandomValues(new Uint32Array(1))[0] % characters.length);
    }

    return codeVerifier;
}

// Hash the code verifier using SHA-256
async function sha256(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64Url = btoa(String.fromCharCode(...hashArray))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return base64Url;
}

const createCodeChallenge = async () => {

    const codeVerifier = generateCodeVerifier();
    const hashedCodeVerifier = await sha256(codeVerifier);
    const now = new Date();
    now.setDate(now.getDate() + (5 * 1000));
    const expirationDate = now.toUTCString();
    document.cookie = `catGallaryCognitoCodeChallenge=${codeVerifier}; expires=${expirationDate}; path=/`;
    return hashedCodeVerifier;
}

const signInRedirect = async () => {
    const codeCallenge = await OAuthClient.createCodeChallenge();
    window.location.href = `https://us-west-2n9yh2zkeq.auth.us-west-2.amazoncognito.com/login?client_id=2t4vj8qe2792pfcj8jhj5cih6r&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost:8080&code_challenge=${codeCallenge}&code_challenge_method=S256`;
}

const signOutRedirect = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");
    window.location.href = `http://localhost:8080`;
}

function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
}

function parseJwtPayload(token) {
    const parts = token.split('.');
    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
}

function validIdToken() {
    const idToken = localStorage.getItem("id_token");
    console.log(`Id token: ${idToken}`);
    
    if (idToken == null || idToken == "undefined") {
        return false;
    }
    
    const tokenPayload = parseJwtPayload(idToken);
    const expDate = new Date(tokenPayload.exp * 1000);
    const dateNow = new Date();
    console.log(`Time now: ${dateNow.toString()}`);
    console.log(`Exp time: ${expDate.toString()}`);
    console.log(dateNow.getTime() < expDate.getTime());
    return dateNow.getTime() < expDate.getTime();
}

async function refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    
    if (refreshToken == null || refreshToken == "undefined") {
        return false;
    }

    await getAccessToken("refresh_token");
    return validIdToken();
    
}

function displayContent() {
    const username = parseJwtPayload(localStorage.getItem("access_token")).username;
    console.log(username);
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
                    <button type="button" class="btn btn-outline-primary" onclick="signOutRedirect()">Sign out</button>
                </div>
                <div class="d-flex flex-row flex-wrap bg-secondary mx-4" style="max-width: 100rem;">
                ${imageContainers}
                </div>
            </div>
        </div>
    `
    document.getElementById("container").innerHTML = content;
}

function displaySignin() {
    
    const signIn = /*html*/`
        <div id="signin">
            <div class="d-flex justify-content-center p-3" style="margin-top: 8rem;">
                <div class="card bg-secondary d-flex justify-content-center align-items-center" style="width: 18rem; height: 10rem;">
                    <p class="text-light">Sign into AWS Cognito</p>
                    <button class="btn btn-primary" style="width: 10rem;" onclick="signInRedirect()">Sign in</button>
                </div>
            </div>
        </div>
    `
    document.getElementById("container").innerHTML = signIn;
}

async function entry() {
    const oauthClient = new OAuthClient("2t4vj8qe2792pfcj8jhj5cih6r", "http://localhost:8080", "/auth");
    const authenicated = await oauthClient.authenticate();

    if (!authenicated) {
        displaySignin();
        return;
    }

    displayContent();


    // if(validIdToken() || await refreshToken()) {
    //     displayContent();
    // } else {
    //     let code = getAuthCode();
    //     if(code) {
    //         console.log("Found code!")
    //         await getAccessToken("authorization_code", getAuthCode(code));
    //         if (validIdToken()) {
    //             displayContent();
    //         }
    //     } else {
    //         displaySignin();
    //     } 
    // }
}

entry();