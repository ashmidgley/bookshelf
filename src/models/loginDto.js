class LoginDto {
    constructor(email, password){
        this.email = email;
        this.password = password;
    }

    email;
    password;
}

export default LoginDto;