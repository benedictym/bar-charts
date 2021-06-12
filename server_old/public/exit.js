const codeStart = "842";
const ip_address = "localhost:8080"

const loadCodes = async () => {
    const response = await fetch("/exit/codes");
    return await response.json();
}

const postCode = (code) => {
    fetch("/exit/codes", {
        headers: {'Content-Type': "application/json"},
        method: 'post',
        body: code
    })
        .then(function (res){console.log(res)})
        .catch(function (res) {console.log(res)});

}

// const postMsg = (msg_txt) => {
//     fetch("https://bar-colour.nw.r.appspot.com/exit/form", {
//         headers: {'Content-Type': "application/json"},
//         method: 'post',
//         body: msg_txt
//     })
//         .then(function (res){console.log(res)})
//         .catch(function (res) {console.log(res)});
// }

// async function reloadPage(cookie){
//     const msg = document.getElementById("msg").value;
//     const msg_text = {
//         cookie: cookie,
//         msg: msg
//     };
//     await postMsg(msg_text);
//     window.location.href = "/exit";
// }

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
    // const submit_button = document.getElementById('submit_button');
    // submit_button.addEventListener('click', reloadPage(cookie).then(
    //     () => {
    //         console.log("comment sent");
    //     }
    //     )
    // )
    // await reloadPage(cookie);
}



generateCode().then(
    () =>{
        console.log("code generated");
    }
);

// reloadPage().then(
//     () => {
//         console.log("comment sent");
//     }
// )