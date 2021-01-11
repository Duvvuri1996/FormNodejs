let Email = (email) => {
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(email.match(emailFormat)) {
        return email
    } else {
        return false
    }
}

module.exports = {
email : Email
}