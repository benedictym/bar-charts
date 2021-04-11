const codeStart = "842";

const loadCodes = async () => {
    const response = await fetch("https://bar-colour.nw.r.appspot.com/exit/codes");
    return await response.json();
}

const postCode = (code) => {
    fetch("https://bar-colour.nw.r.appspot.com/exit/codes", {
        headers: {'Content-Type': "application/json"},
        method: 'post',
        body: code
    })
        .then(function (res){console.log(res)})
        .catch(function (res) {console.log(res)});

}

async function generateCode() {
    let codeRandom;
    const codes = await loadCodes();
    const cookieCode = codes.cookieCode;
    const cookie = codes.cookie;
    if(cookie in cookieCode){
        codeRandom = cookieCode[cookie];
    } else{
        const surveyCodes = codes.surveyCodes;
        // generates last 3 digits of the survey code - a number between 100 and 999
        codeRandom = Math.floor(Math.random()*(999-100+1)+100);
        while(surveyCodes.includes(codeRandom)){
            codeRandom = Math.floor(Math.random()*(999-100+1)+100);
        }
    }
    const codeRandomString = codeRandom.toString();
    let codeRandomJson = `{"code": ${codeRandom}, "cookie": "${cookie}"}`;
    postCode(codeRandomJson);
    document.getElementById('surveyCode').innerHTML = "<b>" +codeStart+codeRandomString + "</b>";
}

generateCode();