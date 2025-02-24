function getAuthCode() {
    let params = new URLSearchParams(document.location.search);
    let code = params.get("code");
    
    return code;
}

const getAccessToken = async (code) => {
    const verificationCode = getCookie("catGallaryCognitoCodeChallenge");

    let data = {
        grant_type: "authorization_code",
        client_id: "2t4vj8qe2792pfcj8jhj5cih6r",
        code: code,
        code_verifier: verificationCode,
        redirect_uri: "http://localhost:8080"
    };

    let formBody = new URLSearchParams(data).toString();

    fetch(`/auth/oauth2/token`, {
        method: "POST",
        body: formBody,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
    .then((response) => response.json())
    .then((json) => {
        localStorage.setItem("id_token", json.id_token);
        localStorage.setItem("access_token", json.access_token);
        localStorage.setItem("refresh_token", json.refresh_token);
        console.log(json);
    });
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
    let codeCallenge = await createCodeChallenge();

    window.location.href = `https://us-west-2n9yh2zkeq.auth.us-west-2.amazoncognito.com/login?client_id=2t4vj8qe2792pfcj8jhj5cih6r&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost:8080&code_challenge=${codeCallenge}&code_challenge_method=S256`;
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
    
    if (idToken == null || idToken == "undefined") {
        return false;
    }
    
    let tokenPayload = parseJwtPayload(idToken);
    let dateObj = new Date(tokenPayload.exp * 1000);
    
    console.log(dateObj.getTime());
    
    return dateObj.getTime() < new Date().getTime();
}

function refreshToken() {
    return false;
}

function displayContent() {
    console.log("Success");
}

function entry() {
    if(validIdToken() || refreshToken()) {
        displayContent();
    } else {
        let code = getAuthCode();
        if(code) {
            getAccessToken(getAuthCode(code));
        } 
    }
}

entry();