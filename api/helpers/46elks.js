
//for testing we set param to 'dryrun'
async function sms46Elks(phone, param) {

    const username = "< API Username >";
    const password = "< API Password >";
    const auth  = Buffer.from(username + ":" + password).toString("base64");

    let data = {
    from: "NodeElk",
    to: phone,
    message: "This is your EBL reminder"
    }

    data = new URLSearchParams(data);
    data = data.toString();

   const response = await fetch(`https://api.46elks.com/a1/sms/${param}`, {
        method: "post",
        body: data,
        headers: {"Authorization": "Basic "  + auth}
    })
   const smsSent = await response.json();
   return smsSent;
}

module.exports = { sms46Elks };